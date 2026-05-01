// api/check.js — Environment variable diagnostic + Resend connection test

module.exports = async function handler(req, res) {
  const vars = [
    'ANTHROPIC_API_KEY',
    'GOOGLE_SHEET_ID',
    'GOOGLE_SERVICE_ACCOUNT_JSON',
    'RESEND_API_KEY',
    'NOTIFY_EMAIL',
    'CRM_PASSWORD',
  ];

  const status = {};
  for (const v of vars) {
    const val = process.env[v];
    status[v] = val ? `SET (${val.length} chars)` : 'MISSING';
  }

  // Test Resend API
  let resendStatus = 'not tested';
  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      resendStatus = 'MISSING API KEY';
    } else {
      const res = await fetch('https://api.resend.com/domains', {
        headers: { 'Authorization': `Bearer ${apiKey}` },
      });
      if (res.ok) {
        resendStatus = 'CONNECTED';
      } else {
        resendStatus = `FAILED: HTTP ${res.status}`;
      }
    }
  } catch (err) {
    resendStatus = `FAILED: ${err.message}`;
  }

  return res.status(200).json({
    timestamp: new Date().toISOString(),
    environment: status,
    resend_api: resendStatus,
  });
};
