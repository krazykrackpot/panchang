// Weekly digest email — sent every Monday

interface DigestDay {
  date: string;       // "Mon, Apr 7"
  quality: string;    // "Excellent", "Good", etc.
  color: string;      // hex color for the quality
  taraName: string;
}

interface DigestData {
  name: string;
  dashaInfo: string;          // "Mars Mahadasha / Saturn Antardasha"
  days: DigestDay[];          // 7 days
  festivals: string[];        // upcoming festival names
  transitAlerts: string[];    // active alerts
  sadeSatiActive: boolean;
}

export function weeklyDigestEmail(data: DigestData): { subject: string; html: string } {
  const qualityColors: Record<string, string> = {
    Excellent: '#4ade80', Good: '#d4a853', Neutral: '#9b97a0', Caution: '#facc15', Challenging: '#f87171',
  };

  const daysHtml = data.days.map(d => `
    <tr>
      <td style="color:#e8e6e3;font-size:13px;padding:8px 0;border-bottom:1px solid rgba(212,168,83,0.08);">${d.date}</td>
      <td style="padding:8px 0;text-align:center;border-bottom:1px solid rgba(212,168,83,0.08);">
        <span style="display:inline-block;padding:2px 10px;border-radius:10px;font-size:11px;font-weight:bold;color:${qualityColors[d.quality] || '#9b97a0'};background:${qualityColors[d.quality] || '#9b97a0'}15;">${d.quality}</span>
      </td>
      <td style="color:#9b97a0;font-size:12px;padding:8px 0;text-align:right;border-bottom:1px solid rgba(212,168,83,0.08);">${d.taraName}</td>
    </tr>
  `).join('');

  const festivalsHtml = data.festivals.length > 0
    ? data.festivals.map(f => `<li style="color:#e8e6e3;font-size:13px;margin-bottom:6px;">${f}</li>`).join('')
    : '<li style="color:#9b97a0;font-size:13px;">No major festivals this week</li>';

  const alertsHtml = data.transitAlerts.length > 0
    ? data.transitAlerts.map(a => `
      <div style="background:rgba(251,146,60,0.08);border:1px solid rgba(251,146,60,0.2);border-radius:8px;padding:10px 14px;margin-bottom:8px;">
        <span style="color:#fb923c;font-size:13px;">${a}</span>
      </div>
    `).join('')
    : '';

  return {
    subject: `Your Week Ahead — Dekho Panchang`,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0a0e27;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
    <!-- Header -->
    <div style="text-align:center;margin-bottom:24px;">
      <h1 style="color:#d4a853;font-size:24px;margin:0;">Dekho Panchang</h1>
      <p style="color:#9b97a0;font-size:13px;margin:4px 0 0;">Your Weekly Vedic Forecast</p>
    </div>

    <!-- Greeting -->
    <div style="background:#111638;border:1px solid rgba(212,168,83,0.2);border-radius:16px;padding:24px;margin-bottom:20px;">
      <h2 style="color:#f0d48a;font-size:18px;margin:0 0 8px;">Namaste, ${data.name}</h2>
      <p style="color:#9b97a0;font-size:13px;margin:0;">Current period: <span style="color:#e8e6e3;font-weight:bold;">${data.dashaInfo}</span></p>
      ${data.sadeSatiActive ? '<p style="color:#f87171;font-size:12px;margin:8px 0 0;font-weight:bold;">&#9888; Sade Sati is active — Saturn remedies recommended</p>' : ''}
    </div>

    <!-- Week forecast -->
    <div style="background:#111638;border:1px solid rgba(212,168,83,0.1);border-radius:16px;padding:24px;margin-bottom:20px;">
      <h3 style="color:#d4a853;font-size:14px;margin:0 0 16px;text-transform:uppercase;letter-spacing:1px;">This Week's Forecast</h3>
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <th style="color:#9b97a0;font-size:11px;text-align:left;padding:0 0 8px;text-transform:uppercase;">Day</th>
          <th style="color:#9b97a0;font-size:11px;text-align:center;padding:0 0 8px;text-transform:uppercase;">Quality</th>
          <th style="color:#9b97a0;font-size:11px;text-align:right;padding:0 0 8px;text-transform:uppercase;">Tara</th>
        </tr>
        ${daysHtml}
      </table>
    </div>

    <!-- Transit alerts -->
    ${alertsHtml ? `
    <div style="margin-bottom:20px;">
      <h3 style="color:#fb923c;font-size:14px;margin:0 0 12px;text-transform:uppercase;letter-spacing:1px;">&#9888; Transit Alerts</h3>
      ${alertsHtml}
    </div>
    ` : ''}

    <!-- Upcoming festivals -->
    <div style="background:#111638;border:1px solid rgba(212,168,83,0.1);border-radius:16px;padding:24px;margin-bottom:20px;">
      <h3 style="color:#4ade80;font-size:14px;margin:0 0 12px;text-transform:uppercase;letter-spacing:1px;">Upcoming Festivals</h3>
      <ul style="margin:0;padding:0 0 0 20px;">
        ${festivalsHtml}
      </ul>
    </div>

    <!-- CTA -->
    <div style="text-align:center;margin:28px 0;">
      <a href="https://dekhopanchang.com/en/dashboard" style="display:inline-block;padding:12px 32px;background:linear-gradient(135deg,#8a6d2b,#d4a853);color:#0a0e27;font-size:14px;font-weight:bold;text-decoration:none;border-radius:10px;">
        View Full Dashboard
      </a>
    </div>

    <!-- Footer -->
    <div style="text-align:center;padding-top:20px;border-top:1px solid rgba(212,168,83,0.1);">
      <p style="color:#9b97a0;font-size:11px;margin:0;">
        <a href="https://dekhopanchang.com/en/settings" style="color:#d4a853;text-decoration:none;">Manage email preferences</a>
        &nbsp;|&nbsp;
        <a href="https://dekhopanchang.com" style="color:#d4a853;text-decoration:none;">Dekho Panchang</a>
      </p>
    </div>
  </div>
</body>
</html>`,
  };
}
