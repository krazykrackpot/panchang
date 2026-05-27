// Vrat reminder emails — day-before and parana streams.
//
// Both templates are intentionally bilingual-light (EN copy with the
// vrat name in the user's locale). The full Devanagari template will
// follow once the vrat-specific copy is reviewed by Aditya; this MVP
// ships English + transliterated vrat names which the existing tl()
// helper already produces correctly.

export interface VratReminderTemplateData {
  displayName: string;
  vratName: string;
  deity: string;
  fastDate: string;        // YYYY-MM-DD
  fastDateLocal: string;   // "Wednesday, 28 May" — pre-formatted in user tz
  fastStartLocal?: string; // "06:14" — local time on fastDate
  paranaDate?: string;     // YYYY-MM-DD
  paranaDateLocal?: string; // "Thursday, 29 May"
  paranaStartLocal?: string; // "06:15"
  paranaEndLocal?: string;   // "09:42"
  paranaNote?: string;       // moonrise hint etc.
  pujaUrl?: string;
  dashboardUrl: string;
  unsubscribeUrl: string;
}

const BRAND_FOOT = `<p style="margin-top:32px;padding-top:16px;border-top:1px solid #e5e5e5;font-size:13px;color:#6a6a6a;">— <a href="https://dekhopanchang.com" style="color:#8a6d2b;">Dekho Panchang</a></p>`;

function unsubscribeBlock(url: string): string {
  return `<p style="margin-top:18px;font-size:12px;color:#8a8a8a;">You are receiving this because you subscribed to vrat reminders. <a href="${url}" style="color:#8a8a8a;text-decoration:underline;">Manage reminders</a> in your dashboard.</p>`;
}

/**
 * Day-before reminder — sent during the user's local evening of the day
 * before the fast. Includes the full parana schedule so users get the
 * complete view even if they don't opt into the parana reminder.
 */
export function vratDayBeforeEmail(data: VratReminderTemplateData): { subject: string; html: string } {
  const greeting = data.displayName.trim().length > 0 ? data.displayName.trim() : 'there';
  const subject = `Tomorrow is ${data.vratName} — fast starts at sunrise`;

  const paranaBlock = data.paranaDate && data.paranaStartLocal && data.paranaEndLocal
    ? `<p><strong>Parana (break the fast):</strong><br>${data.paranaDateLocal ?? data.paranaDate}, ${data.paranaStartLocal}–${data.paranaEndLocal}</p>`
    : data.paranaNote
      ? `<p><strong>Parana:</strong> ${data.paranaNote}</p>`
      : '';

  const pujaLink = data.pujaUrl
    ? `<p style="margin-top:16px;"><a href="${data.pujaUrl}" style="color:#8a6d2b;text-decoration:underline;">Read the full puja vidhi →</a></p>`
    : '';

  const html = `<!DOCTYPE html>
<html>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Inter,Helvetica,sans-serif;max-width:560px;margin:32px auto;color:#1a1a1a;line-height:1.6;padding:0 16px;">
  <p style="margin:0 0 16px;">Dear ${greeting},</p>
  <p>Tomorrow, <strong>${data.fastDateLocal}</strong>, is <strong>${data.vratName}</strong> — dedicated to ${data.deity}.</p>
  <div style="margin:24px 0;padding:16px 18px;background:#f5f1e8;border-left:3px solid #d4a853;border-radius:4px;">
    <p style="margin:0 0 8px;"><strong>Fast begins:</strong> ${data.fastStartLocal ? `${data.fastStartLocal} (local sunrise) on ${data.fastDateLocal}` : `sunrise on ${data.fastDateLocal}`}</p>
    ${paranaBlock}
  </div>
  ${pujaLink}
  <p style="margin-top:20px;">Subhakaryeshu shubham bhavatu — may this observance bring you peace.</p>
  ${BRAND_FOOT}
  ${unsubscribeBlock(data.unsubscribeUrl)}
</body>
</html>`;

  return { subject, html };
}

/**
 * Parana reminder — sent N minutes before the parana window opens.
 * Sharp, time-bound: "your window opens at HH:MM".
 */
export function vratParanaEmail(data: VratReminderTemplateData): { subject: string; html: string } {
  const greeting = data.displayName.trim().length > 0 ? data.displayName.trim() : 'there';
  const opening = data.paranaStartLocal ?? '—';
  const subject = `${data.vratName} parana window opens at ${opening}`;

  const window = data.paranaStartLocal && data.paranaEndLocal
    ? `${data.paranaStartLocal} – ${data.paranaEndLocal}`
    : data.paranaStartLocal ?? data.paranaNote ?? '—';

  const pujaLink = data.pujaUrl
    ? `<p style="margin-top:16px;"><a href="${data.pujaUrl}" style="color:#8a6d2b;text-decoration:underline;">Fast-break ritual notes →</a></p>`
    : '';

  const html = `<!DOCTYPE html>
<html>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Inter,Helvetica,sans-serif;max-width:560px;margin:32px auto;color:#1a1a1a;line-height:1.6;padding:0 16px;">
  <p style="margin:0 0 16px;">Dear ${greeting},</p>
  <p>Your <strong>${data.vratName}</strong> parana window is about to open.</p>
  <div style="margin:24px 0;padding:16px 18px;background:#f5f1e8;border-left:3px solid #d4a853;border-radius:4px;">
    <p style="margin:0;font-size:18px;font-weight:600;">${window}</p>
    ${data.paranaDateLocal ? `<p style="margin:6px 0 0;color:#6a6a6a;font-size:14px;">${data.paranaDateLocal}</p>` : ''}
    ${data.paranaNote ? `<p style="margin:8px 0 0;color:#6a6a6a;font-size:13px;">${data.paranaNote}</p>` : ''}
  </div>
  ${pujaLink}
  ${BRAND_FOOT}
  ${unsubscribeBlock(data.unsubscribeUrl)}
</body>
</html>`;

  return { subject, html };
}
