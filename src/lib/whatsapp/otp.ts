// OTP generation, hashing, and verification for WhatsApp opt-in.
//
// Threat model:
//   - 6-digit numeric code, 10-minute validity window
//   - Single attempt rate-limited by API route (max 5 attempts per pending
//     subscription before we force re-request)
//   - DB dump → attacker should NOT be able to recover live OTPs
//
// Hashing strategy: HMAC-SHA-256(code, OTP_HMAC_SECRET).
//   - Fast (no scrypt cost) — OTP brute force is already bounded by the
//     10-min expiry + 5-attempt cap, not by hash speed
//   - Server-secret keying means a DB dump alone can't enumerate valid
//     OTPs without also exfiltrating OTP_HMAC_SECRET from env
//   - Per-record salt unnecessary because the secret is server-wide

const CODE_LENGTH = 6;
const VALIDITY_MINUTES = 10;

export function generateOtp(): string {
  // crypto.getRandomValues is cryptographically secure and available in
  // both Node and Edge runtimes.
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  // Mod into [0, 10^6) then zero-pad. Bias is negligible at this range
  // (2^32 / 10^6 ≈ 4295, so codes 0-95 are very slightly over-represented;
  // not exploitable for OTP enumeration since each guess still has
  // ~1/1_000_000 chance of matching).
  const n = buf[0] % 10 ** CODE_LENGTH;
  return n.toString().padStart(CODE_LENGTH, '0');
}

export async function hashOtp(code: string, secret?: string): Promise<string> {
  const k = (secret ?? process.env.OTP_HMAC_SECRET ?? '').trim();
  if (!k) {
    throw new Error('[whatsapp/otp] OTP_HMAC_SECRET is not set');
  }
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(k),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(code));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/** Constant-time compare so a partial-match timing attack can't enumerate. */
export function safeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

export async function verifyOtp(
  userCode: string,
  storedHash: string,
  secret?: string,
): Promise<boolean> {
  if (!/^\d{6}$/.test(userCode)) return false;
  const incomingHash = await hashOtp(userCode, secret);
  return safeEqualHex(incomingHash, storedHash);
}

export function otpExpiresAt(now: Date = new Date()): Date {
  return new Date(now.getTime() + VALIDITY_MINUTES * 60 * 1000);
}

export const OTP_VALIDITY_MINUTES = VALIDITY_MINUTES;
