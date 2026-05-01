// api/chat.js — WoodburyNest Chatbot (Nest)
// Saves leads to Google Sheets + Resend email notification

const Anthropic = require('@anthropic-ai/sdk');

const FROM_EMAIL   = 'gian@woodburynest.com';
const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL || 'gian@woodburynest.com';

const SYSTEM_PROMPT = `You are Nest, the virtual assistant for WoodburyNest. You represent Gian "G" Visciglio, a licensed REALTOR® at Keller Williams Premier Realty in Woodbury, MN (MN License #41031450). Licensed as Gianpaulo Visciglio.

Be professional and concise. Keep responses to 1-2 sentences. Do not use filler phrases or be overly conversational. Ask for the visitor's name and a contact method (phone or email) early — one question at a time.

About Gian "G" Visciglio:
- Licensed REALTOR® in Minnesota, License #41031450 (licensed as Gianpaulo Visciglio)
- Keller Williams Premier Realty, 635 Bielenberg Dr STE 100, Woodbury, MN 55125
- Phone: (612) 520-1009 | Email: gian@woodburynest.com
- Serves Woodbury, Minneapolis, Saint Paul, and the Twin Cities metro
- Listings: https://gianpaulovisciglio.kw.com/
- Down payment assistance: https://www.workforce-resource.com/dpr/pmt/MSP/GIANPAULO_VISCIGLIO

Rules:
- No legal or financial advice
- No brokerage-level details; direct to Gian
- Never fabricate listings or market data
- For specific home search or contract questions, direct to Gian directly`

// ── Resend email ──────────────────────────────────────────────────────────────
async function sendLeadEmail(name, contact, intent) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('[Chat] Email skipped: RESEND_API_KEY not set');
    return;
  }

  const isEmail = contact.includes('@');
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: `WoodburyNest <${FROM_EMAIL}>`,
      to:   [NOTIFY_EMAIL],
      subject: `New Chatbot Lead: ${name}`,
      html: `<div style="font-family:Arial,sans-serif;max-width:500px;">
        <div style="background:#1a1a2e;padding:16px 24px;border-radius:6px 6px 0 0;">
          <h3 style="color:#c9a84c;margin:0;">New Chatbot Lead</h3>
        </div>
        <div style="background:#fff;padding:20px 24px;border:1px solid #e0dbd0;border-radius:0 0 6px 6px;">
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>${isEmail ? 'Email' : 'Phone'}:</strong> ${contact}</p>
          <p><strong>Intent:</strong> ${intent || 'general'}</p>
          <p style="font-size:0.78rem;color:#aaa;">${new Date().toLocaleString('en-US',{timeZone:'America/Chicago'})} CT</p>
        </div>
      </div>`,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Resend error: ${res.status} ${err}`);
  }
  console.log(`[Chat] Email sent via Resend for: ${name}`);
}

// ── Save to Google Sheets ─────────────────────────────────────────────────────
async function saveLead(name, contact, intent) {
  try {
    const { google } = require('googleapis');
    const SHEET_ID   = process.env.GOOGLE_SHEET_ID;
    const creds      = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
    const auth       = new google.auth.GoogleAuth({
      credentials: creds,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    const sheets = google.sheets({ version: 'v4', auth });
    const now    = new Date().toISOString();
    const id     = Date.now().toString();

    const isEmail = contact.includes('@');
    const email   = isEmail ? contact : '';
    const phone   = isEmail ? '' : contact;
    const row     = [id, name, email, phone, intent || 'general', '', 'new', 'Via chatbot', '', 'chatbot', now, now];

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
      console.log(`[Chat] Sheets: chatbot lead saved — ${name}`);
    } catch (e) {
      console.error(`[Chat] Leads tab failed: ${e.message} — trying Sheet1`);
      await sheets.spreadsheets.values.append({
        spreadsheetId: SHEET_ID, range: 'Sheet1!A:H', valueInputOption: 'RAW',
        requestBody: { values: [[now, name, email, phone, intent || 'general', '', 'Via chatbot', 'chatbot']] },
      });
    }

    // Send email — awaited so Vercel doesn't kill it before it completes
    try {
      await sendLeadEmail(name, contact, intent);
    } catch (err) {
      console.error('[Chat] Email failed (non-fatal):', err.message);
    }

  } catch (err) {
    console.error('[Chat] saveLead failed:', err.message);
  }
}

// ── Handler ───────────────────────────────────────────────────────────────────
module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Frontend lead capture — action: 'save_lead'
  if (req.body && req.body.action === 'save_lead') {
    const { name, contact, intent } = req.body;
    if (name && contact) {
      await saveLead(name, contact, intent || 'general');
    }
    return res.status(200).json({ success: true });
  }

  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid request' });
  }

  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const response = await client.messages.create({
      model:      'claude-haiku-4-5-20251001',
      max_tokens: 350,
      system:     SYSTEM_PROMPT,
      messages:   messages.slice(-10),
    });

    let reply = response.content?.[0]?.text ||
      "I'm having trouble right now. Please contact G directly at (612) 520-1009.";

    return res.status(200).json({ reply });

  } catch (err) {
    console.error('[Chat] API error:', err);
    return res.status(500).json({
      reply: "I'm offline right now. Reach G at (612) 520-1009 or gian@woodburynest.com.",
    });
  }
};
