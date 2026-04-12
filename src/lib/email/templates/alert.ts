// Alert email — for dasha transitions, sade sati, festival reminders

type AlertType = 'dasha_transition' | 'sade_sati' | 'festival_reminder';

const ALERT_STYLES: Record<AlertType, { emoji: string; color: string; bgColor: string }> = {
  dasha_transition: { emoji: '&#9733;', color: '#d4a853', bgColor: 'rgba(212,168,83,0.08)' },
  sade_sati: { emoji: '&#9888;', color: '#f87171', bgColor: 'rgba(248,113,113,0.08)' },
  festival_reminder: { emoji: '&#127881;', color: '#4ade80', bgColor: 'rgba(74,222,128,0.08)' },
};

export function alertEmail({ name, type, title, body, ctaUrl, ctaText }: {
  name: string;
  type: AlertType;
  title: string;
  body: string;
  ctaUrl?: string;
  ctaText?: string;
}): { subject: string; html: string } {
  const style = ALERT_STYLES[type];

  return {
    subject: `${title} — Dekho Panchang`,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0a0e27;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
    <!-- Header -->
    <div style="text-align:center;margin-bottom:24px;">
      <h1 style="color:#d4a853;font-size:24px;margin:0;">Dekho Panchang</h1>
    </div>

    <!-- Alert card -->
    <div style="background:#111638;border:1px solid ${style.color}30;border-radius:16px;padding:32px;margin-bottom:24px;">
      <div style="text-align:center;margin-bottom:16px;">
        <span style="font-size:36px;">${style.emoji}</span>
      </div>
      <h2 style="color:${style.color};font-size:20px;margin:0 0 12px;text-align:center;">${title}</h2>
      <p style="color:#e8e6e3;font-size:15px;line-height:1.7;margin:0;text-align:center;">${body}</p>
    </div>

    ${ctaUrl ? `
    <div style="text-align:center;margin:28px 0;">
      <a href="${ctaUrl}" style="display:inline-block;padding:12px 32px;background:linear-gradient(135deg,#8a6d2b,#d4a853);color:#0a0e27;font-size:14px;font-weight:bold;text-decoration:none;border-radius:10px;">
        ${ctaText || 'View Details'}
      </a>
    </div>
    ` : ''}

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
