import { tl } from '@/lib/utils/trilingual';
/**
 * Daily Panchang Email Template
 * Sent at sunrise (via cron) to subscribed users.
 */

interface HoroscopeEmailData {
  moonSignName: string;
  rashiSlug: string;
  overallScore: number;
  insight: string;
  areas: {
    career: number;
    love: number;
    health: number;
    finance: number;
    spirituality: number;
  };
  luckyColor: string;
  luckyNumber: number;
}

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
  horoscope?: HoroscopeEmailData;
  vratReminders?: { name: string; sunrise: string }[];
}

/**
 * Renders the daily rashifal (horoscope) section for the email.
 * Only called when the user has moon sign data from their kundali snapshot.
 */
function generateRashifalSection(
  h: HoroscopeEmailData,
  locale: 'en' | 'hi',
  gold: string,
  goldLight: string,
  _bg: string,
  bgCard: string,
  textPrimary: string,
  textSecondary: string,
): string {
  const isHi = locale === 'hi';

  const areaLabel = (en: string, hi: string) => isHi ? hi : en;
  const areaRow = (label: string, score: number) => {
    // Score 1-10, render as filled/empty dots for email compatibility
    const filled = Math.round(score);
    const dots = Array.from({ length: 10 }, (_, i) =>
      `<span style="display:inline-block;width:8px;height:8px;border-radius:50%;margin:0 1px;background:${i < filled ? gold : gold + '25'}">&nbsp;</span>`
    ).join('');
    return `<tr>
      <td style="padding:5px 12px;color:${textSecondary};font-size:11px;width:35%;vertical-align:middle">${label}</td>
      <td style="padding:5px 12px;vertical-align:middle">${dots}</td>
      <td style="padding:5px 8px;color:${goldLight};font-size:12px;font-weight:600;width:30px;text-align:right;vertical-align:middle">${score.toFixed(1)}</td>
    </tr>`;
  };

  // Score colour: green for 7+, gold for 4-6.9, red-ish for <4
  const scoreColor = h.overallScore >= 7 ? '#2ecc71' : h.overallScore >= 4 ? gold : '#e74c3c';

  return `
  <!-- Rashifal Section -->
  <div style="margin:24px 0;border-top:1px solid ${gold}20;padding-top:20px">
    <div style="text-align:center;margin-bottom:16px">
      <div style="color:${gold};font-size:10px;text-transform:uppercase;letter-spacing:2px;font-weight:700;margin-bottom:4px">
        ${tl({ en: 'Your Daily Rashifal', hi: 'आपका दैनिक राशिफल', sa: 'आपका दैनिक राशिफल' }, locale)}
      </div>
      <div style="color:${goldLight};font-size:18px;font-weight:700">${h.moonSignName}</div>
    </div>

    <!-- Overall Score -->
    <div style="text-align:center;margin:16px 0">
      <div style="display:inline-block;width:64px;height:64px;border-radius:50%;border:3px solid ${scoreColor};line-height:58px;text-align:center">
        <span style="color:${scoreColor};font-size:22px;font-weight:800">${h.overallScore.toFixed(1)}</span>
      </div>
      <div style="color:${textSecondary};font-size:10px;margin-top:4px">${tl({ en: 'out of 10', hi: '10 में से', sa: '10 में से' }, locale)}</div>
    </div>

    <!-- Insight -->
    <div style="background:${bgCard};border-radius:10px;padding:12px 14px;margin:12px 0;border:1px solid ${gold}15;text-align:center">
      <div style="color:${textPrimary};font-size:13px;line-height:1.5;font-style:italic">${h.insight}</div>
    </div>

    <!-- Area Scores -->
    <div style="background:${bgCard};border-radius:12px;margin:12px 0;border:1px solid ${gold}20;overflow:hidden">
      <div style="padding:10px 12px;background:${gold}10;border-bottom:1px solid ${gold}15">
        <span style="color:${gold};font-size:10px;text-transform:uppercase;letter-spacing:1.5px;font-weight:700">
          ${tl({ en: 'Life Areas', hi: 'जीवन क्षेत्र', sa: 'जीवन क्षेत्र' }, locale)}
        </span>
      </div>
      <table style="width:100%;border-collapse:collapse">
        ${areaRow(areaLabel('Career', 'करियर'), h.areas.career)}
        ${areaRow(areaLabel('Love', 'प्रेम'), h.areas.love)}
        ${areaRow(areaLabel('Health', 'स्वास्थ्य'), h.areas.health)}
        ${areaRow(areaLabel('Finance', 'वित्त'), h.areas.finance)}
        ${areaRow(areaLabel('Spirituality', 'आध्यात्म'), h.areas.spirituality)}
      </table>
    </div>

    <!-- Lucky Colour & Number -->
    <div style="display:flex;gap:8px;margin:12px 0">
      <div style="flex:1;background:${bgCard};border-radius:8px;padding:10px;text-align:center;border:1px solid ${gold}15">
        <div style="color:${textSecondary};font-size:9px;text-transform:uppercase;letter-spacing:0.5px">${tl({ en: 'Lucky Colour', hi: 'शुभ रंग', sa: 'शुभ रंग' }, locale)}</div>
        <div style="color:${goldLight};font-weight:700;font-size:14px;margin-top:2px">${h.luckyColor}</div>
      </div>
      <div style="flex:1;background:${bgCard};border-radius:8px;padding:10px;text-align:center;border:1px solid ${gold}15">
        <div style="color:${textSecondary};font-size:9px;text-transform:uppercase;letter-spacing:0.5px">${tl({ en: 'Lucky Number', hi: 'शुभ अंक', sa: 'शुभ अंक' }, locale)}</div>
        <div style="color:${goldLight};font-weight:700;font-size:14px;margin-top:2px">${h.luckyNumber}</div>
      </div>
    </div>

    <!-- Full Horoscope CTA -->
    <div style="text-align:center;margin:16px 0">
      <a href="https://dekhopanchang.com/${locale}/horoscope/${h.rashiSlug}"
         style="display:inline-block;padding:10px 24px;background:${gold}30;border:1px solid ${gold}60;border-radius:8px;color:${goldLight};font-weight:700;font-size:13px;text-decoration:none">
        ${tl({ en: 'Full Horoscope \u2192', hi: '\u092A\u0942\u0930\u094D\u0923 \u0930\u093E\u0936\u093F\u092B\u0932 \u2192', sa: '\u092A\u0942\u0930\u094D\u0923 \u0930\u093E\u0936\u093F\u092B\u0932 \u2192' }, locale)}
      </a>
    </div>
  </div>`;
}

/**
 * Renders the vrat reminder section for the daily email.
 * Shown when the user has enabled vrats and tomorrow matches one.
 */
function generateVratReminderSection(
  reminders: { name: string; sunrise: string }[],
  locale: 'en' | 'hi',
  gold: string,
  goldLight: string,
  bgCard: string,
  textSecondary: string,
): string {
  const reminderRows = reminders.map(vr => `
    <div style="padding:10px 14px;border-bottom:1px solid ${gold}10">
      <div style="color:${goldLight};font-weight:700;font-size:14px">${vr.name}</div>
      <div style="color:${textSecondary};font-size:11px;margin-top:2px">
        ${tl({ en: 'Fast begins at sunrise (' + vr.sunrise + ')', hi: '\u0938\u0942\u0930\u094D\u092F\u094B\u0926\u092F (' + vr.sunrise + ') \u092A\u0930 \u0935\u094D\u0930\u0924 \u0906\u0930\u092E\u094D\u092D', sa: '\u0938\u0942\u0930\u094D\u092F\u094B\u0926\u092F\u0947 (' + vr.sunrise + ') \u0935\u094D\u0930\u0924\u093E\u0930\u092E\u094D\u092D\u0903' }, locale)}
      </div>
    </div>`).join('');

  return `
  <!-- Vrat Reminder -->
  <div style="margin:24px 0;border-top:1px solid ${gold}20;padding-top:20px">
    <div style="text-align:center;margin-bottom:12px">
      <div style="color:${gold};font-size:10px;text-transform:uppercase;letter-spacing:2px;font-weight:700">
        ${tl({ en: 'Vrat Reminder \u2014 Tomorrow', hi: '\u0935\u094D\u0930\u0924 \u0905\u0928\u0941\u0938\u094D\u092E\u093E\u0930\u0915 \u2014 \u0915\u0932', sa: '\u0935\u094D\u0930\u0924\u0938\u094D\u092E\u093E\u0930\u0915\u092E\u094D \u2014 \u0936\u094D\u0935\u0903' }, locale)}
      </div>
    </div>
    <div style="background:${bgCard};border-radius:12px;border:1px solid #e67e2233;overflow:hidden">
      <div style="padding:10px 12px;background:#e67e2215;border-bottom:1px solid #e67e2215">
        <span style="color:#e67e22;font-size:10px;text-transform:uppercase;letter-spacing:1.5px;font-weight:700">
          ${tl({ en: 'Your Fasts', hi: '\u0906\u092A\u0915\u0947 \u0935\u094D\u0930\u0924', sa: '\u092D\u0935\u0924\u0903 \u0935\u094D\u0930\u0924\u093E\u0928\u093F' }, locale)}
        </span>
      </div>
      ${reminderRows}
    </div>
    <div style="text-align:center;margin-top:12px">
      <a href="https://dekhopanchang.com/${locale}/dashboard"
         style="display:inline-block;padding:8px 20px;background:#e67e2225;border:1px solid #e67e2250;border-radius:8px;color:#e67e22;font-weight:700;font-size:12px;text-decoration:none">
        ${tl({ en: 'View Vrat Tracker', hi: '\u0935\u094D\u0930\u0924 \u091F\u094D\u0930\u0948\u0915\u0930 \u0926\u0947\u0916\u0947\u0902', sa: '\u0935\u094D\u0930\u0924\u092A\u0930\u093F\u0936\u0940\u0932\u0928\u0902 \u092A\u0936\u094D\u092F\u0924\u0941' }, locale)}
      </a>
    </div>
  </div>`;
}

export function generateDailyPanchangEmail(data: DailyPanchangEmailData): { subject: string; html: string } {
  const isHi = data.locale === 'hi';
  const gold = '#d4a853';
  const goldLight = '#f0d48a';
  const bg = '#0a0e27';
  const bgCard = '#111633';
  const textPrimary = '#e6e2d8';
  const textSecondary = '#8a8478';

  const subject = tl({ en: `${data.vara} Panchang  –  ${data.tithi}, ${data.nakshatra} | ${data.date}`, hi: `${data.vara} पंचांग  –  ${data.tithi}, ${data.nakshatra} | ${data.date}`, sa: `${data.vara} पंचांग  –  ${data.tithi}, ${data.nakshatra} | ${data.date}` }, data.locale);

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
      ${data.vara}  –  ${data.date}  –  ${data.locationName}
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
        ${tl({ en: 'Caution  –  Inauspicious Periods', hi: 'सावधान  –  अशुभ काल', sa: 'सावधान  –  अशुभ काल' }, data.locale)}
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
        ${tl({ en: 'Auspicious  –  Amrit Kalam', hi: 'शुभ  –  अमृत काल', sa: 'शुभ  –  अमृत काल' }, data.locale)}
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

  ${data.horoscope ? generateRashifalSection(data.horoscope, data.locale, gold, goldLight, bg, bgCard, textPrimary, textSecondary) : ''}

  ${(data.vratReminders && data.vratReminders.length > 0) ? generateVratReminderSection(data.vratReminders, data.locale, gold, goldLight, bgCard, textSecondary) : ''}

  <!-- Footer -->
  <div style="text-align:center;padding:16px 0;border-top:1px solid ${gold}15;color:${textSecondary};font-size:10px">
    <div>Dekho Panchang  –  dekhopanchang.com</div>
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
