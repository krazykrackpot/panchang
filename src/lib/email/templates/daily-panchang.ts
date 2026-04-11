/**
 * Daily Panchang Email Template
 * Sent at sunrise (via cron) to subscribed users.
 */

interface DailyPanchangEmailData {
  date: string;
  vara: string;
  tithi: string;
  nakshatra: string;
  nakshatraPada: number;
  yoga: string;
  karana: string;
  sunrise: string;
  sunset: string;
  rahuKaal: string;
  yamaganda: string;
  amritKalam?: string;
  varjyam?: string;
  locale: 'en' | 'hi';
  locationName: string;
  unsubscribeUrl: string;
}

export function generateDailyPanchangEmail(data: DailyPanchangEmailData): { subject: string; html: string } {
  const isHi = data.locale === 'hi';
  const gold = '#d4a853';
  const goldLight = '#f0d48a';
  const bg = '#0a0e27';
  const bgCard = '#111633';
  const textPrimary = '#e6e2d8';
  const textSecondary = '#8a8478';

  const subject = isHi
    ? `${data.vara} पंचांग — ${data.tithi}, ${data.nakshatra} | ${data.date}`
    : `${data.vara} Panchang — ${data.tithi}, ${data.nakshatra} | ${data.date}`;

  const row = (label: string, value: string, color = goldLight) =>
    `<tr><td style="padding:6px 12px;color:${textSecondary};width:35%;font-size:12px">${label}</td><td style="padding:6px 12px;color:${color};font-weight:600;font-size:13px">${value}</td></tr>`;

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:${bg};font-family:'Segoe UI',Inter,system-ui,sans-serif">
<div style="max-width:480px;margin:0 auto;padding:20px">

  <!-- Header -->
  <div style="text-align:center;padding:20px 0;border-bottom:1px solid ${gold}33">
    <div style="color:${goldLight};font-size:22px;font-weight:700;letter-spacing:1px">
      ${isHi ? 'दैनिक पंचांग' : 'Daily Panchang'}
    </div>
    <div style="color:${textSecondary};font-size:12px;margin-top:4px">
      ${data.vara} — ${data.date} — ${data.locationName}
    </div>
  </div>

  <!-- Five Elements -->
  <div style="background:${bgCard};border-radius:12px;margin:16px 0;border:1px solid ${gold}20;overflow:hidden">
    <div style="padding:10px 12px;background:${gold}15;border-bottom:1px solid ${gold}15">
      <span style="color:${gold};font-size:10px;text-transform:uppercase;letter-spacing:1.5px;font-weight:700">
        ${isHi ? 'पंच अंग' : 'Five Elements'}
      </span>
    </div>
    <table style="width:100%;border-collapse:collapse">
      ${row(isHi ? 'तिथि' : 'Tithi', data.tithi)}
      ${row(isHi ? 'नक्षत्र' : 'Nakshatra', `${data.nakshatra} (${isHi ? 'पाद' : 'Pada'} ${data.nakshatraPada})`)}
      ${row(isHi ? 'योग' : 'Yoga', data.yoga)}
      ${row(isHi ? 'करण' : 'Karana', data.karana)}
      ${row(isHi ? 'वार' : 'Vara', data.vara)}
    </table>
  </div>

  <!-- Timings -->
  <div style="display:flex;gap:8px;margin:16px 0">
    <div style="flex:1;background:${bgCard};border-radius:8px;padding:10px;text-align:center;border:1px solid ${gold}15">
      <div style="color:${textSecondary};font-size:9px;text-transform:uppercase;letter-spacing:0.5px">${isHi ? 'सूर्योदय' : 'Sunrise'}</div>
      <div style="color:#e67e22;font-weight:700;font-size:16px;font-family:monospace">${data.sunrise}</div>
    </div>
    <div style="flex:1;background:${bgCard};border-radius:8px;padding:10px;text-align:center;border:1px solid ${gold}15">
      <div style="color:${textSecondary};font-size:9px;text-transform:uppercase;letter-spacing:0.5px">${isHi ? 'सूर्यास्त' : 'Sunset'}</div>
      <div style="color:#3498db;font-weight:700;font-size:16px;font-family:monospace">${data.sunset}</div>
    </div>
  </div>

  <!-- Caution windows -->
  <div style="background:${bgCard};border-radius:12px;margin:16px 0;border:1px solid #e74c3c33;overflow:hidden">
    <div style="padding:10px 12px;background:#e74c3c15;border-bottom:1px solid #e74c3c15">
      <span style="color:#e74c3c;font-size:10px;text-transform:uppercase;letter-spacing:1.5px;font-weight:700">
        ${isHi ? 'सावधान — अशुभ काल' : 'Caution — Inauspicious Periods'}
      </span>
    </div>
    <table style="width:100%;border-collapse:collapse">
      ${row(isHi ? 'राहु काल' : 'Rahu Kaal', data.rahuKaal, '#e74c3c')}
      ${row(isHi ? 'यमगण्ड' : 'Yamaganda', data.yamaganda, '#e74c3c')}
      ${data.varjyam ? row(isHi ? 'वर्ज्यम्' : 'Varjyam', data.varjyam, '#e74c3c') : ''}
    </table>
  </div>

  <!-- Auspicious window -->
  ${data.amritKalam ? `
  <div style="background:${bgCard};border-radius:12px;margin:16px 0;border:1px solid #2ecc7133;overflow:hidden">
    <div style="padding:10px 12px;background:#2ecc7115;border-bottom:1px solid #2ecc7115">
      <span style="color:#2ecc71;font-size:10px;text-transform:uppercase;letter-spacing:1.5px;font-weight:700">
        ${isHi ? 'शुभ — अमृत काल' : 'Auspicious — Amrit Kalam'}
      </span>
    </div>
    <div style="padding:10px 12px;color:#2ecc71;font-weight:700;font-size:14px;font-family:monospace">
      ${data.amritKalam}
    </div>
  </div>` : ''}

  <!-- CTA -->
  <div style="text-align:center;margin:24px 0">
    <a href="https://dekhopanchang.com/${data.locale}/panchang"
       style="display:inline-block;padding:10px 24px;background:${gold}30;border:1px solid ${gold}60;border-radius:8px;color:${goldLight};font-weight:700;font-size:13px;text-decoration:none">
      ${isHi ? 'पूर्ण पंचांग देखें' : 'View Full Panchang'}
    </a>
  </div>

  <!-- Footer -->
  <div style="text-align:center;padding:16px 0;border-top:1px solid ${gold}15;color:${textSecondary};font-size:10px">
    <div>Dekho Panchang — dekhopanchang.com</div>
    <div style="margin-top:8px">
      <a href="${data.unsubscribeUrl}" style="color:${textSecondary};text-decoration:underline;font-size:10px">
        ${isHi ? 'सदस्यता समाप्त करें' : 'Unsubscribe'}
      </a>
    </div>
  </div>

</div>
</body>
</html>`;

  return { subject, html };
}
