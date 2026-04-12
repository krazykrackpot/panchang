// Welcome email — sent after first sign-in + onboarding

export function welcomeEmail({ name, moonSign, nakshatra, ascendant }: {
  name: string;
  moonSign?: string;
  nakshatra?: string;
  ascendant?: string;
}): { subject: string; html: string } {
  const hasBirthData = moonSign && nakshatra && ascendant;

  return {
    subject: `Welcome to Dekho Panchang, ${name}!`,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0a0e27;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
    <!-- Header -->
    <div style="text-align:center;margin-bottom:30px;">
      <h1 style="color:#d4a853;font-size:28px;margin:0;">Dekho Panchang</h1>
      <p style="color:#9b97a0;font-size:14px;margin:8px 0 0;">Vedic Astrology Companion</p>
    </div>

    <!-- Welcome card -->
    <div style="background:#111638;border:1px solid rgba(212,168,83,0.2);border-radius:16px;padding:32px;margin-bottom:24px;">
      <h2 style="color:#f0d48a;font-size:22px;margin:0 0 16px;">Namaste, ${name}!</h2>
      <p style="color:#e8e6e3;font-size:15px;line-height:1.6;margin:0 0 16px;">
        Welcome to Dekho Panchang — your personal Vedic astrology companion. We're delighted to have you.
      </p>

      ${hasBirthData ? `
      <!-- Birth chart summary -->
      <div style="background:rgba(212,168,83,0.08);border:1px solid rgba(212,168,83,0.15);border-radius:12px;padding:20px;margin:20px 0;">
        <p style="color:#d4a853;font-size:12px;text-transform:uppercase;letter-spacing:2px;margin:0 0 12px;font-weight:bold;">Your Chart at a Glance</p>
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="color:#9b97a0;font-size:13px;padding:4px 0;">Moon Sign (Rashi)</td>
            <td style="color:#f0d48a;font-size:13px;padding:4px 0;text-align:right;font-weight:bold;">${moonSign}</td>
          </tr>
          <tr>
            <td style="color:#9b97a0;font-size:13px;padding:4px 0;">Birth Nakshatra</td>
            <td style="color:#f0d48a;font-size:13px;padding:4px 0;text-align:right;font-weight:bold;">${nakshatra}</td>
          </tr>
          <tr>
            <td style="color:#9b97a0;font-size:13px;padding:4px 0;">Ascendant (Lagna)</td>
            <td style="color:#f0d48a;font-size:13px;padding:4px 0;text-align:right;font-weight:bold;">${ascendant}</td>
          </tr>
        </table>
      </div>
      ` : `
      <p style="color:#9b97a0;font-size:14px;line-height:1.6;margin:16px 0 0;">
        Complete your birth details in Settings to unlock personalized predictions, Tara Bala, and daily guidance.
      </p>
      `}
    </div>

    <!-- What you can do -->
    <div style="background:#111638;border:1px solid rgba(212,168,83,0.1);border-radius:16px;padding:24px;margin-bottom:24px;">
      <h3 style="color:#f0d48a;font-size:16px;margin:0 0 16px;">What you can do:</h3>
      <div style="margin-bottom:12px;">
        <span style="color:#4ade80;font-size:14px;">&#9733;</span>
        <span style="color:#e8e6e3;font-size:14px;margin-left:8px;">View your personalized daily Panchang</span>
      </div>
      <div style="margin-bottom:12px;">
        <span style="color:#4ade80;font-size:14px;">&#9733;</span>
        <span style="color:#e8e6e3;font-size:14px;margin-left:8px;">Generate detailed Kundali with AI interpretations</span>
      </div>
      <div style="margin-bottom:12px;">
        <span style="color:#4ade80;font-size:14px;">&#9733;</span>
        <span style="color:#e8e6e3;font-size:14px;margin-left:8px;">Check Sade Sati status and personalized remedies</span>
      </div>
      <div style="margin-bottom:12px;">
        <span style="color:#4ade80;font-size:14px;">&#9733;</span>
        <span style="color:#e8e6e3;font-size:14px;margin-left:8px;">Browse festival Puja Vidhis with mantras</span>
      </div>
    </div>

    <!-- CTA -->
    <div style="text-align:center;margin:32px 0;">
      <a href="https://dekhopanchang.com/en/dashboard" style="display:inline-block;padding:14px 36px;background:linear-gradient(135deg,#8a6d2b,#d4a853);color:#0a0e27;font-size:16px;font-weight:bold;text-decoration:none;border-radius:12px;">
        Go to My Dashboard
      </a>
    </div>

    <!-- Footer -->
    <div style="text-align:center;padding-top:24px;border-top:1px solid rgba(212,168,83,0.1);">
      <p style="color:#9b97a0;font-size:12px;margin:0;">Dekho Panchang — Vedic Astrology Companion</p>
      <p style="color:#9b97a0;font-size:11px;margin:8px 0 0;">
        <a href="https://dekhopanchang.com/en/settings" style="color:#d4a853;text-decoration:none;">Manage email preferences</a>
        &nbsp;|&nbsp;
        <a href="https://dekhopanchang.com" style="color:#d4a853;text-decoration:none;">Visit website</a>
      </p>
    </div>
  </div>
</body>
</html>`,
  };
}
