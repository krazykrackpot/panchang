/**
 * Pandit CRM — TypeScript shapes that mirror the SQL schema (migration 049).
 *
 * These are the canonical shapes the app uses; `mock-fixtures.ts` was the
 * P0 prototype version. Production code should import from THIS file, not
 * from mock-fixtures.
 *
 * Spec: docs/specs/2026-06-04-pandit-crm.md §4.
 */

export type LinkState =
  | 'unlinked'
  | 'invited'
  | 'linked'
  | 'paused'
  | 'declined';

export type EngagementState =
  | 'prospect'
  | 'active'
  | 'past'
  | 'archived';

export type AlertSeverity = 'info' | 'notable' | 'critical';

export type AlertKind =
  | 'maha_dasha_change'
  | 'antar_dasha_change'
  | 'pratyantar_dasha_change'
  | 'sade_sati_entry'
  | 'sade_sati_peak'
  | 'sade_sati_exit'
  | 'jupiter_aspect_natal'
  | 'saturn_ingress_natal_house'
  | 'rahu_ketu_ingress'
  | 'eclipse_impact'
  | 'birthday'
  | 'followup_due'
  | 'birthday_solar_return';

export type DeliverableKind =
  | 'kundali_report'
  | 'tippanni'
  | 'muhurta_pick'
  | 'matching_report'
  | 'consultation_summary'
  | 'custom_letter';

export type ConsultationChannel =
  | 'in_person'
  | 'phone'
  | 'video'
  | 'chat'
  | 'email'
  | 'async_note';

export type FamilyRelationship =
  | 'spouse'
  | 'son'
  | 'daughter'
  | 'father'
  | 'mother'
  | 'sibling'
  | 'other';

export interface BirthData {
  date: string; // YYYY-MM-DD
  time: string; // HH:MM (24h)
  place: string;
  lat: number;
  lng: number;
  tz: string;
  time_estimated?: boolean;
}

export interface ClientPermissions {
  read_birth_data: boolean;
  read_family_charts: boolean;
  generate_readings: boolean;
  push_deliverables: boolean;
  send_alerts_to_client: boolean;
  view_consultation_history: boolean;
}

export const DEFAULT_REQUESTED_PERMISSIONS: ClientPermissions = {
  read_birth_data: true,
  read_family_charts: true,
  generate_readings: true,
  push_deliverables: true,
  send_alerts_to_client: true,
  view_consultation_history: true,
};

export interface PanditClient {
  id: string;
  pandit_user_id: string;
  full_name: string;
  client_user_id: string | null;
  birth_data: BirthData;
  birth_data_source: 'pandit_entered' | 'client_synced';
  contact_email: string | null;
  contact_phone: string | null;
  contact_address: string | null;
  photo_url: string | null;
  display_label: string | null;
  tags: string[];
  pandit_notes: string | null;
  color: string | null;
  link_state: LinkState;
  engagement_state: EngagementState;
  engagement_state_before_archive: EngagementState | null;
  permissions: ClientPermissions | null;
  first_consult_at: string | null;
  last_consult_at: string | null;
  link_state_changed_at: string | null;
  engagement_state_changed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface PanditClientFamilyMember {
  id: string;
  client_record_id: string;
  pandit_user_id: string;
  full_name: string;
  birth_data: BirthData | null;
  relationship: FamilyRelationship;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface PanditClientInvitation {
  id: string;
  client_record_id: string;
  pandit_user_id: string;
  invitation_token: string;
  invited_email: string;
  invited_user_id: string | null;
  permissions_requested: ClientPermissions;
  pandit_message: string | null;
  status: 'pending' | 'accepted' | 'declined' | 'expired' | 'revoked';
  sent_at: string;
  responded_at: string | null;
  expires_at: string;
  created_at: string;
}

export interface PanditConsultation {
  id: string;
  client_record_id: string;
  pandit_user_id: string;
  client_user_id: string | null;
  consulted_at: string;
  channel: ConsultationChannel | null;
  duration_minutes: number | null;
  pandit_private_notes: string | null;
  client_visible_summary: string | null;
  shared_with_client: boolean;
  shared_at: string | null;
  attachments: unknown | null;
  next_followup_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface PanditAlert {
  id: string;
  client_record_id: string;
  pandit_user_id: string;
  client_user_id: string | null;
  kind: AlertKind;
  fires_at: string; // ISO date
  severity: AlertSeverity;
  payload: Record<string, unknown> | null;
  acknowledged_at: string | null;
  emailed_at: string | null;
  client_emailed_at: string | null;
  created_at: string;
}

export interface PanditDeliverable {
  id: string;
  client_record_id: string;
  pandit_user_id: string;
  client_user_id: string | null;
  kind: DeliverableKind;
  title: string;
  content: unknown | null;
  locale: string;
  content_pdf_url: string | null;
  visibility: 'pandit_only' | 'client_pushed';
  pushed_at: string | null;
  client_seen_at: string | null;
  client_acknowledged_at: string | null;
  notification_id: string | null;
  engine_version: string | null;
  created_at: string;
  updated_at: string;
}

export interface PanditSettings {
  pandit_user_id: string;
  letterhead_name: string | null;
  letterhead_subtitle: string | null;
  letterhead_address: string | null;
  logo_url: string | null;
  signature_url: string | null;
  contact_phone: string | null;
  contact_email: string | null;
  default_report_locale: string;
  alert_email_enabled: boolean;
  alert_lookahead_days: number;
  past_threshold_months: number;
  weekly_digest_enabled: boolean;
  digest_day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  created_at: string;
  updated_at: string;
}

/** Helpers ------------------------------------------------------------ */

export function clientInitials(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function ageFromBirthDate(date: string): number | null {
  const m = date.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return null;
  const [, y, mo, d] = m;
  const birth = new Date(Date.UTC(+y, +mo - 1, +d));
  const now = new Date();
  let age = now.getUTCFullYear() - birth.getUTCFullYear();
  const beforeBirthday =
    now.getUTCMonth() < birth.getUTCMonth() ||
    (now.getUTCMonth() === birth.getUTCMonth() && now.getUTCDate() < birth.getUTCDate());
  if (beforeBirthday) age -= 1;
  return age;
}

export function relativeTimeSince(iso: string | null | undefined): string {
  if (!iso) return '—';
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return '—';
  const now = Date.now();
  const diffMs = now - then;
  if (diffMs < 0) return relativeTimeUntil(iso);
  const day = 24 * 60 * 60 * 1000;
  if (diffMs < day) {
    const h = Math.floor(diffMs / (60 * 60 * 1000));
    if (h < 1) return 'just now';
    return `${h}h ago`;
  }
  const days = Math.floor(diffMs / day);
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

export function relativeTimeUntil(iso: string | null | undefined): string {
  if (!iso) return '—';
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return '—';
  const now = Date.now();
  const diffMs = then - now;
  if (diffMs < 0) return relativeTimeSince(iso);
  const day = 24 * 60 * 60 * 1000;
  if (diffMs < day) {
    const h = Math.ceil(diffMs / (60 * 60 * 1000));
    return `in ${h}h`;
  }
  const days = Math.ceil(diffMs / day);
  if (days < 7) return `in ${days}d`;
  if (days < 30) return `in ${Math.floor(days / 7)}w`;
  if (days < 365) return `in ${Math.floor(days / 30)}mo`;
  return `in ${Math.floor(days / 365)}y`;
}
