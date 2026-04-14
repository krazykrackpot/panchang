import { tl } from '@/lib/utils/trilingual';
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

  const subject = tl({ en: `${data.vara} Panchang — ${data.tithi}, ${data.nakshatra} | ${data.date}`, hi: `${data.vara} पंचांग — ${data.tithi}, ${data.nakshatra} | ${data.date}`, sa: `${data.vara} पंचांग — ${data.tithi}, ${data.nakshatra} | ${data.date}` }, data.locale);

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
      ${tl({ en: 'Daily Panchang', hi: 'दैनिक पंचांग', sa: 'दैनिक पंचांग' }, data.locale)}
    </div>
    <div style="color:${textSecondary};font-size:12px;margin-top:4px">
      ${data.vara} — ${data.date} — ${data.locationName}
    </div>
  </div>

  <!-- Five Elements -->
  <div style="background:${bgCard};border-radius:12px;margin:16px 0;border:1px solid ${gold}20;overflow:hidden">
    <div style="padding:10px 12px;background:${gold}15;border-bottom:1px solid ${gold}15">
      <span style="color:${gold};font-size:10px;text-transform:uppercase;letter-spacing:1.5px;font-weight:700">
        ${tl({ en: 'Five Elements', hi: 'पंच अंग', sa: 'पंच अंग' }, data.locale)}
      </span>
    </div>
    <table style="width:100%;border-collapse:collapse">
      ${row(tl({ en: 'Tithi', hi: 'तिथि', sa: 'तिथि' }, data.locale), data.tithi)}
      ${row(tl({ en: 'Nakshatra', hi: 'नक्षत्र', sa: 'नक्षत्र' }, data.locale), `${data.nakshatra} (${tl({ en: 'Pada', hi: 'पाद', sa: 'पाद' }, data.locale)} ${data.nakshatraPada})`)}
      ${row(tl({ en: 'Yoga', hi: 'योग', sa: 'योग' }, data.locale), data.yoga)}
      ${row(tl({ en: 'Karana', hi: 'करण', sa: 'करण' }, data.locale), data.karana)}
      ${row(tl({ en: 'Vara', hi: 'वार', sa: 'वार' }, data.locale), data.vara)}
    </table>
  </div>

  <!-- Timings -->
  <div style="display:flex;gap:8px;margin:16px 0">
    <div style="flex:1;background:${bgCard};border-radius:8px;padding:10px;text-align:center;border:1px solid ${gold}15">
      <div style="color:${textSecondary};font-size:9px;text-transform:uppercase;letter-spacing:0.5px">${tl({ en: 'Sunrise', hi: 'सूर्योदय', sa: 'सूर्योदय' }, data.locale)}</div>
      <div style="color:#e67e22;font-weight:700;font-size:16px;font-family:monospace">${data.sunrise}</div>
    </div>
    <div style="flex:1;background:${bgCard};border-radius:8px;padding:10px;text-align:center;border:1px solid ${gold}15">
      <div style="color:${textSecondary};font-size:9px;text-transform:uppercase;letter-spacing:0.5px">${tl({ en: 'Sunset', hi: 'सूर्यास्त', sa: 'सूर्यास्त' }, data.locale)}</div>
      <div style="color:#3498db;font-weight:700;font-size:16px;font-family:monospace">${data.sunset}</div>
    </div>
  </div>

  <!-- Caution windows -->
  <div style="background:${bgCard};border-radius:12px;margin:16px 0;border:1px solid #e74c3c33;overflow:hidden">
    <div style="padding:10px 12px;background:#e74c3c15;border-bottom:1px solid #e74c3c15">
      <span style="color:#e74c3c;font-size:10px;text-transform:uppercase;letter-spacing:1.5px;font-weight:700">
        ${tl({ en: 'Caution — Inauspicious Periods', hi: 'सावधान — अशुभ काल', sa: 'सावधान — अशुभ काल' }, data.locale)}
      </span>
    </div>
    <table style="width:100%;border-collapse:collapse">
      ${row(tl({ en: 'Rahu Kaal', hi: 'राहु काल', sa: 'राहु काल' }, data.locale), data.rahuKaal, '#e74c3c')}
      ${row(tl({ en: 'Yamaganda', hi: 'यमगण्ड', sa: 'यमगण्ड' }, data.locale), data.yamaganda, '#e74c3c')}
      ${data.varjyam ? row(tl({ en: 'Varjyam', hi: 'वर्ज्यम्', sa: 'वर्ज्यम्' }, data.locale), data.varjyam, '#e74c3c') : ''}
    </table>
  </div>

  <!-- Auspicious window -->
  ${data.amritKalam ? `
  <div style="background:${bgCard};border-radius:12px;margin:16px 0;border:1px solid #2ecc7133;overflow:hidden">
    <div style="padding:10px 12px;background:#2ecc7115;border-bottom:1px solid #2ecc7115">
      <span style="color:#2ecc71;font-size:10px;text-transform:uppercase;letter-spacing:1.5px;font-weight:700">
        ${tl({ en: 'Auspicious — Amrit Kalam', hi: 'शुभ — अमृत काल', sa: 'शुभ — अमृत काल' }, data.locale)}
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
      ${tl({ en: 'View Full Panchang', hi: 'पूर्ण पंचांग देखें', sa: 'पूर्ण पंचांग देखें' }, data.locale)}
    </a>
  </div>

  <!-- Footer -->
  <div style="text-align:center;padding:16px 0;border-top:1px solid ${gold}15;color:${textSecondary};font-size:10px">
    <div>Dekho Panchang — dekhopanchang.com</div>
    <div style="margin-top:8px">
      <a href="${data.unsubscribeUrl}" style="color:${textSecondary};text-decoration:underline;font-size:10px">
        ${tl({ en: 'Unsubscribe', hi: 'सदस्यता समाप्त करें', sa: 'सदस्यता समाप्त करें' }, data.locale)}
      </a>
    </div>
  </div>

</div>
</body>
</html>`;

  return { subject, html };
}
