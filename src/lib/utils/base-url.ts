/**
 * Resolve the application's own base URL for server-side same-origin
 * requests (e.g. an API route calling another API route on the same
 * deployment).
 *
 * Vercel env values can have trailing whitespace — always .trim().
 * NEXT_PUBLIC_SITE_URL takes precedence so a custom-domain deployment
 * doesn't accidentally hand out the *.vercel.app preview URL.
 */
export function getInternalBaseUrl(): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (siteUrl) {
    // If the env value was set without a protocol (e.g. `example.com`),
    // server-side fetch() in Node.js rejects it as an invalid URL. Add
    // https:// when missing so the caller gets a usable absolute URL.
    const sanitized = siteUrl.replace(/\/+$/, '');
    return sanitized.includes('://') ? sanitized : `https://${sanitized}`;
  }

  const vercelUrl = process.env.VERCEL_URL?.trim();
  if (vercelUrl) return `https://${vercelUrl}`;

  return 'http://localhost:3000';
}
