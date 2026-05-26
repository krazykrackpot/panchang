#!/usr/bin/env tsx
/**
 * Inbox-test: deliver a message TO namaste@dekhopanchang.com so the
 * founder can confirm replies to the NPS email will actually be seen.
 */
import { Resend } from 'resend';
import { config as loadEnv } from 'dotenv';
loadEnv({ path: '.env.local' });

async function main() {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) { console.error('RESEND_API_KEY missing'); process.exit(1); }
  const resend = new Resend(key);

  const html = `<!DOCTYPE html>
<html>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Inter, sans-serif; max-width: 560px; margin: 32px auto; color: #1a1a1a; line-height: 1.6; padding: 0 16px;">
  <h2 style="font-weight: 600; margin-bottom: 16px;">Inbox test — namaste@dekhopanchang.com</h2>
  <p>This message is a deliverability check for the <code>namaste@dekhopanchang.com</code> inbox.</p>
  <p>If you're reading this, replies from users (including Mr Hanumanth Rao's NPS response when it arrives) will land here. If you're <em>not</em> reading this, the inbox needs forwarding or POP/IMAP set up before any NPS replies will reach you.</p>
  <p style="margin-top: 24px; color: #6a6a6a; font-size: 13px;">Sent ${new Date().toISOString()} via Resend.</p>
</body>
</html>`;

  const result = await resend.emails.send({
    from: 'Dekho Panchang <namaste@dekhopanchang.com>',
    to: 'namaste@dekhopanchang.com',
    subject: 'Inbox test — can you see this?',
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
