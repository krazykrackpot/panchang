/**
 * Pandit CRM — invitation token generation.
 *
 * URL-safe random 32 bytes (base64url). Used as the unique link a
 * recipient clicks to land on /pandit-invitation/[token].
 *
 * Generated server-side only — never expose the generator function to
 * client code. Tokens are stored as the primary lookup key on
 * pandit_client_invitations.invitation_token (UNIQUE NOT NULL).
 *
 * Spec §5.2 + §5.3.
 */

import { randomBytes } from 'crypto';

export function generateInvitationToken(): string {
  // 32 bytes → 43 base64url chars → ~256 bits of entropy. Comfortable
  // for collision resistance against guess attacks even at billions of
  // invitations.
  return randomBytes(32)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}
