#!/usr/bin/env tsx
import { Resend } from 'resend';
import { config as loadEnv } from 'dotenv';
loadEnv({ path: '.env.local' });

async function main() {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) {
    console.error('RESEND_API_KEY missing from .env.local');
    process.exit(1);
  }
  const resend = new Resend(key);

  const html = `
<!DOCTYPE html>
<html>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 560px; margin: 32px auto; color: #1a1a1a; line-height: 1.55;">
  <h2 style="font-weight: 600; margin-bottom: 16px;">Demo email — pipeline test</h2>
  <p>This is a sender / pipeline verification message from the Dekho Panchang Resend client.</p>
  <p>If you're reading this, the <code>namaste@dekhopanchang.com</code> sender is verified and ready to deliver real user emails.</p>
  <p style="margin-top: 24px; color: #6a6a6a; font-size: 13px;">Sent ${new Date().toISOString()} via Resend.</p>
</body>
</html>
`;

  const result = await resend.emails.send({
    from: 'Dekho Panchang <namaste@dekhopanchang.com>',
    to: 'aditya.kr.jha@gmail.com',
    subject: 'Demo email — Dekho Panchang sender test',
    html,
  });

  if (result.error) {
    console.error('Send failed:');
    console.error(JSON.stringify(result.error, null, 2));
    process.exit(1);
  }
  console.log('Sent OK. Message ID:', result.data?.id);
}

main();
