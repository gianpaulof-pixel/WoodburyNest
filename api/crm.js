// api/crm.js — WoodburyNest CRM
// CommonJS | Resend API | Google Sheets | Public POST

const { google } = require('googleapis');

const SHEET_ID     = process.env.GOOGLE_SHEET_ID;
const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL || 'gian@woodburynest.com';
const FROM_EMAIL   = 'gian@woodburynest.com';

// ── Resend email ─────────────────────────────────────────────────────────────
async function sendNotification(lead) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('[CRM] Email skipped: RESEND_API_KEY not set');
    return;
  }

  const sourceLabel = {
    'chatbot':      'Nest Chatbot',
    'contact-form': 'Contact Form',
    'cma-request':  'CMA Request',
    'manual':       'Manual Entry',
  }[lead.source] || lead.source || 'Form';

  const name   = lead.name  || 'Unknown';
  const email  = lead.email || 'Not provided';
  const phone  = lead.phone || 'Not provided';
  const intent = lead.intent || lead.interest || 'Not provided';
  const notes  = (lead.notes || lead.message || 'None').replace(/\|/g, '<br>');

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: `WoodburyNest <${FROM_EMAIL}>`,
      to:   [NOTIFY_EMAIL],
      subject: `New Lead: ${name} (${sourceLabel})`,
      html: `<div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;">
        <div style="background:#1a1a2e;padding:20px 28px;border-radius:6px 6px 0 0;">
          <h2 style="color:#c9a84c;margin:0;">New WoodburyNest Lead</h2>
          <p style="color:rgba(255,255,255,0.55);margin:4px 0 0;font-size:0.82rem;">${sourceLabel}</p>
        </div>
        <div style="background:#fff;padding:24px 28px;border:1px solid #e0dbd0;border-radius:0 0 6px 6px;">
          <table style="width:100%;border-collapse:collapse;font-size:0.9rem;">
            <tr><td style="padding:8px 0;color:#888;width:100px;">Name</td><td style="padding:8px 0;font-weight:500;">${name}</td></tr>
            <tr><td style="padding:8px 0;color:#888;">Email</td><td><a href="mailto:${email}" style="color:#c9a84c;">${email}</a></td></tr>
            <tr><td style="padding:8px 0;color:#888;">Phone</td><td><a href="tel:${phone}" style="color:#c9a84c;">${phone}</a></td></tr>
            <tr><td style="padding:8px 0;color:#888;">Intent</td><td>${intent}</td></tr>
            <tr><td style="padding:8px 0;color:#888;vertical-align:top;">Notes</td><td style="line-height:1.65;">${notes}</td></tr>
          </table>
          <p style="margin-top:16px;font-size:0.78rem;color:#aaa;">${new Date().toLocaleString('en-US',{timeZone:'America/Chicago'})} CT</p>
        </div>
      </div>`,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Resend API error: ${res.status} ${err}`);
  }

  console.log(`[CRM] Email sent via Resend to ${NOTIFY_EMAIL}`);
}

// ── Google Sheets ─────────────────────────────────────────────────────────────
function getAuth() {
  const creds = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
  return new google.auth.GoogleAuth({
    credentials: creds,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
}

async function appendToSheet(lead) {
  const auth   = await getAuth();
  const sheets = google.sheets({ version: 'v4', auth });
  const now    = new Date().toISOString();
  const id     = Date.now().toString();

  const name     = lead.name     || '';
  const email    = lead.email    || '';
  const phone    = lead.phone    || '';
  const intent   = lead.intent   || lead.interest || '';
  const timeline = lead.timeline || '';
  const status   = lead.status   || 'new';
  const notes    = lead.notes    || lead.message  || '';
  const source   = lead.source   || 'contact-form';
  const row = [id, name, email, phone, intent, timeline, status, notes, '', source, now, now];

  try {
    const check = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID, range: 'Leads!A1:L1',
    });
    if (!check.data.values?.[0] || check.data.values[0][0] !== 'ID') {
      await sheets.spreadsheets.values.update({
        spreadsheetId: SHEET_ID, range: 'Leads!A1:L1', valueInputOption: 'RAW',
        requestBody: { values: [['ID','Name','Email','Phone','Intent','Timeline','Status','Notes','FollowUp','Source','CreatedAt','UpdatedAt']] },
      });
    }
    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID, range: 'Leads!A:L', valueInputOption: 'RAW',
      requestBody: { values: [row] },
    });
    console.log(`[CRM] Sheets: saved to Leads tab — ${name}`);
    return { tab: 'Leads', id };
  } catch (err) {
    console.error(`[CRM] Leads tab failed: ${err.message} — trying Sheet1`);
    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID, range: 'Sheet1!A:H', valueInputOption: 'RAW',
      requestBody: { values: [[now, name, email, phone, intent, '', notes, source]] },
    });
    console.log(`[CRM] Sheets: saved to Sheet1 fallback — ${name}`);
    return { tab: 'Sheet1', id };
  }
}

// ── Handler ───────────────────────────────────────────────────────────────────
module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    const auth = req.headers['authorization'];
    if (auth !== `Bearer ${process.env.CRM_PASSWORD}`) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    if (req.method === 'GET') {
      try {
        const a = await getAuth();
        const sheets = google.sheets({ version: 'v4', auth: a });
        const result = await sheets.spreadsheets.values.get({
          spreadsheetId: SHEET_ID, range: 'Leads!A:L',
        });
        const rows = result.data.values || [];
        if (rows.length <= 1) return res.status(200).json({ leads: [] });
        const leads = rows.slice(1).map(r => ({
          id:r[0]||'',name:r[1]||'',email:r[2]||'',phone:r[3]||'',
          intent:r[4]||'',timeline:r[5]||'',status:r[6]||'new',
          notes:r[7]||'',followUp:r[8]||'',source:r[9]||'',
          createdAt:r[10]||'',updatedAt:r[11]||'',
        }));
        return res.status(200).json({ leads });
      } catch (err) {
        return res.status(500).json({ error: err.message });
      }
    }
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const lead = req.body || {};
  if (!lead.name || !lead.email) {
    return res.status(400).json({ success: false, error: 'Name and email are required.' });
  }

  let sheetResult;
  try {
    sheetResult = await appendToSheet(lead);
  } catch (err) {
    console.error('[CRM] SHEETS FAILED:', err.message);
    return res.status(500).json({
      success: false,
      error: 'Could not save your info. Please call (612) 520-1009.',
    });
  }

  // Email AWAITED — Vercel shuts down after response, non-blocking gets killed
  try {
    await sendNotification(lead);
  } catch (err) {
    console.error('[CRM] EMAIL FAILED:', err.message);
    // Don't fail the response — Sheets already saved
  }

  return res.status(200).json({
    success: true,
    id: sheetResult.id,
    message: 'Thanks! G will be in touch within 24 hours.',
  });
};
