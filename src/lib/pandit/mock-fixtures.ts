/**
 * Mock fixtures for the Pandit dashboard prototypes.
 *
 * These exist so the prototype routes under /dashboard-preview/pandit/
 * render with realistic-feeling data WITHOUT touching Supabase, auth,
 * or any backend wiring. The fixtures match the schema shapes from the
 * spec (docs/specs/2026-06-04-pandit-crm.md §4) so the components built
 * here drop into the real implementation in P1+ with no signature
 * changes.
 *
 * When the real implementation lands, this file becomes a Storybook-only
 * fixture source — production reads from Supabase.
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

export interface BirthData {
  date: string; // YYYY-MM-DD
  time: string; // HH:MM (24h)
  place: string;
  lat: number;
  lng: number;
  tz: string;
  time_estimated?: boolean;
}

export interface MockPandit {
  id: string;
  full_name_en: string;
  full_name_hi: string;
  letterhead_subtitle: string;
  city: string;
  default_locale: string;
  logo_initial: string;
  accent_color: string;
}

export interface MockClient {
  id: string;
  full_name: string;
  display_label?: string;
  birth_data: BirthData;
  age: number;
  contact_email?: string;
  contact_phone?: string;
  link_state: LinkState;
  engagement_state: EngagementState;
  // Astrological state (pre-computed for prototype)
  janma_rashi_en: string;
  janma_rashi_hi: string;
  janma_rashi_degrees: string; // e.g., "5°10'"
  nakshatra_en: string;
  nakshatra_hi: string;
  current_maha_lord_en: string;
  current_maha_lord_hi: string;
  current_antar_lord_en: string;
  current_antar_lord_hi: string;
  current_pratyantar_lord_en?: string;
  maha_started_at: string;
  maha_ends_at: string;
  antar_started_at: string;
  antar_ends_at: string;
  sade_sati_phase?: 'pre' | 'peak' | 'post' | null;
  // CRM
  tags: string[];
  pandit_notes?: string;
  first_consult_at?: string;
  last_consult_at?: string;
  next_followup_at?: string;
  initials: string;
  avatar_color: string;
  critical_alerts: number;
  notable_alerts: number;
}

export interface MockFamilyMember {
  id: string;
  client_id: string;
  full_name: string;
  relationship: 'spouse' | 'son' | 'daughter' | 'father' | 'mother' | 'sibling' | 'other';
  birth_data?: BirthData;
  notes?: string;
}

export interface MockConsultation {
  id: string;
  client_id: string;
  consulted_at: string;
  channel: 'in_person' | 'phone' | 'video' | 'chat' | 'email';
  duration_minutes: number;
  pandit_private_notes: string;
  client_visible_summary?: string;
  shared_with_client: boolean;
  next_followup_at?: string;
}

export interface MockAlert {
  id: string;
  client_id: string;
  client_full_name: string;
  kind: AlertKind;
  fires_at: string; // ISO date
  severity: AlertSeverity;
  title_en: string;
  title_hi?: string;
  context: string; // 1-2 sentence Pandit-facing context
  acknowledged_at?: string;
  payload?: Record<string, unknown>;
}

export interface MockDeliverable {
  id: string;
  client_id: string;
  kind:
    | 'kundali_report'
    | 'tippanni'
    | 'muhurta_pick'
    | 'matching_report'
    | 'consultation_summary'
    | 'custom_letter';
  title: string;
  locale: string;
  pushed_at?: string;
  client_seen_at?: string;
  client_acknowledged_at?: string;
  visibility: 'pandit_only' | 'client_pushed';
}

// ───────────────────────────────────────────────────────────────────────
// The Pandit using the dashboard
// ───────────────────────────────────────────────────────────────────────

export const MOCK_PANDIT: MockPandit = {
  id: 'pandit-mock-1',
  full_name_en: 'Pandit Aditya Kumar Jha',
  full_name_hi: 'पंडित आदित्य कुमार झा',
  letterhead_subtitle: 'Jyotish Acharya · Mumbai',
  city: 'Mumbai',
  default_locale: 'hi',
  logo_initial: 'अ',
  accent_color: '#5a3aa3',
};

// ───────────────────────────────────────────────────────────────────────
// 10 clients covering the full lifecycle matrix
// ───────────────────────────────────────────────────────────────────────

export const MOCK_CLIENTS: MockClient[] = [
  {
    id: 'client-001',
    full_name: 'Mrs. Sunita Sharma',
    display_label: 'Mrs Sharma (Bandra)',
    birth_data: {
      date: '1978-03-12',
      time: '14:30',
      place: 'Mumbai, India',
      lat: 19.076,
      lng: 72.8777,
      tz: 'Asia/Kolkata',
    },
    age: 48,
    contact_email: 'sunita.sharma@example.com',
    contact_phone: '+91 98202 11122',
    link_state: 'linked',
    engagement_state: 'active',
    janma_rashi_en: 'Tula',
    janma_rashi_hi: 'तुला',
    janma_rashi_degrees: "5°10'",
    nakshatra_en: 'Svati',
    nakshatra_hi: 'स्वाती',
    current_maha_lord_en: 'Saturn',
    current_maha_lord_hi: 'शनि',
    current_antar_lord_en: 'Mercury',
    current_antar_lord_hi: 'बुध',
    current_pratyantar_lord_en: 'Venus',
    maha_started_at: '2020-08-14',
    maha_ends_at: '2039-08-14',
    antar_started_at: '2024-02-15',
    antar_ends_at: '2026-10-23',
    sade_sati_phase: null,
    tags: ['career-focused', 'high-priority', 'monthly'],
    pandit_notes:
      'Concerned about Mercury AD ending; deeply curious about career shift in 2027.',
    first_consult_at: '2024-02-20T10:30:00Z',
    last_consult_at: '2026-06-02T11:00:00Z',
    next_followup_at: '2026-06-09T11:00:00Z',
    initials: 'SS',
    avatar_color: '#5a3aa3',
    critical_alerts: 1,
    notable_alerts: 2,
  },
  {
    id: 'client-002',
    full_name: 'Mr. Rajesh Patel',
    display_label: 'Mr Patel',
    birth_data: {
      date: '1965-09-04',
      time: '03:18',
      place: 'Ahmedabad, India',
      lat: 23.0225,
      lng: 72.5714,
      tz: 'Asia/Kolkata',
    },
    age: 60,
    contact_phone: '+91 79844 23119',
    link_state: 'unlinked',
    engagement_state: 'active',
    janma_rashi_en: 'Vrischika',
    janma_rashi_hi: 'वृश्चिक',
    janma_rashi_degrees: "22°48'",
    nakshatra_en: 'Jyeshtha',
    nakshatra_hi: 'ज्येष्ठा',
    current_maha_lord_en: 'Mercury',
    current_maha_lord_hi: 'बुध',
    current_antar_lord_en: 'Jupiter',
    current_antar_lord_hi: 'गुरु',
    maha_started_at: '2024-08-01',
    maha_ends_at: '2041-08-01',
    antar_started_at: '2025-04-12',
    antar_ends_at: '2027-09-30',
    sade_sati_phase: 'pre',
    tags: ['family-business', 'sade-sati-watch'],
    pandit_notes:
      'No email; calls every 2 months. Saturn entering Aquarius (12th from natal moon) — Sade Sati pre-phase imminent.',
    first_consult_at: '2023-01-15T09:00:00Z',
    last_consult_at: '2026-05-28T16:30:00Z',
    initials: 'RP',
    avatar_color: '#c97a4a',
    critical_alerts: 1,
    notable_alerts: 0,
  },
  {
    id: 'client-003',
    full_name: 'Ananya Kumar',
    birth_data: {
      date: '1995-11-22',
      time: '08:45',
      place: 'Bengaluru, India',
      lat: 12.9716,
      lng: 77.5946,
      tz: 'Asia/Kolkata',
    },
    age: 30,
    contact_email: 'ananya.kumar@example.com',
    link_state: 'linked',
    engagement_state: 'active',
    janma_rashi_en: 'Tula',
    janma_rashi_hi: 'तुला',
    janma_rashi_degrees: "14°22'",
    nakshatra_en: 'Svati',
    nakshatra_hi: 'स्वाती',
    current_maha_lord_en: 'Venus',
    current_maha_lord_hi: 'शुक्र',
    current_antar_lord_en: 'Sun',
    current_antar_lord_hi: 'सूर्य',
    maha_started_at: '2018-06-03',
    maha_ends_at: '2038-06-03',
    antar_started_at: '2025-09-20',
    antar_ends_at: '2026-09-20',
    sade_sati_phase: null,
    tags: ['marriage-2026', 'tech', 'monthly'],
    first_consult_at: '2024-11-04T14:00:00Z',
    last_consult_at: '2026-06-04T09:30:00Z',
    initials: 'AK',
    avatar_color: '#3aa370',
    critical_alerts: 1,
    notable_alerts: 1,
  },
  {
    id: 'client-004',
    full_name: 'Mr. Rajiv Gupta',
    birth_data: {
      date: '1962-07-18',
      time: '11:50',
      place: 'New Delhi, India',
      lat: 28.6139,
      lng: 77.209,
      tz: 'Asia/Kolkata',
    },
    age: 63,
    contact_email: 'rajiv.gupta@example.com',
    link_state: 'linked',
    engagement_state: 'past',
    janma_rashi_en: 'Kanya',
    janma_rashi_hi: 'कन्या',
    janma_rashi_degrees: "8°50'",
    nakshatra_en: 'Hasta',
    nakshatra_hi: 'हस्त',
    current_maha_lord_en: 'Mars',
    current_maha_lord_hi: 'मंगल',
    current_antar_lord_en: 'Mars',
    current_antar_lord_hi: 'मंगल',
    maha_started_at: '2023-12-08',
    maha_ends_at: '2030-12-08',
    antar_started_at: '2023-12-08',
    antar_ends_at: '2024-05-07',
    tags: ['retired', 'health-focus'],
    first_consult_at: '2022-03-10T11:00:00Z',
    last_consult_at: '2025-05-18T15:00:00Z',
    initials: 'RG',
    avatar_color: '#c79a4a',
    critical_alerts: 0,
    notable_alerts: 0,
  },
  {
    id: 'client-005',
    full_name: 'Priya Mehta',
    birth_data: {
      date: '1991-04-09',
      time: '06:12',
      place: 'Pune, India',
      lat: 18.5204,
      lng: 73.8567,
      tz: 'Asia/Kolkata',
    },
    age: 34,
    contact_email: 'priya.mehta@example.com',
    link_state: 'invited',
    engagement_state: 'active',
    janma_rashi_en: 'Simha',
    janma_rashi_hi: 'सिंह',
    janma_rashi_degrees: "11°44'",
    nakshatra_en: 'Purva Phalguni',
    nakshatra_hi: 'पूर्व फाल्गुनी',
    current_maha_lord_en: 'Sun',
    current_maha_lord_hi: 'सूर्य',
    current_antar_lord_en: 'Moon',
    current_antar_lord_hi: 'चन्द्र',
    maha_started_at: '2023-11-04',
    maha_ends_at: '2029-11-04',
    antar_started_at: '2026-02-14',
    antar_ends_at: '2026-08-14',
    tags: ['startup-founder', 'invitation-sent-2026-06-03'],
    pandit_notes: 'Invitation sent 1 day ago. Waiting for her to accept.',
    first_consult_at: '2026-05-22T18:00:00Z',
    last_consult_at: '2026-05-29T19:30:00Z',
    initials: 'PM',
    avatar_color: '#d4a853',
    critical_alerts: 0,
    notable_alerts: 1,
  },
  {
    id: 'client-006',
    full_name: 'Mr. Sanjay Iyer',
    birth_data: {
      date: '1955-12-30',
      time: '21:05',
      place: 'Chennai, India',
      lat: 13.0827,
      lng: 80.2707,
      tz: 'Asia/Kolkata',
      time_estimated: true,
    },
    age: 70,
    contact_phone: '+91 95001 19284',
    link_state: 'unlinked',
    engagement_state: 'active',
    janma_rashi_en: 'Karka',
    janma_rashi_hi: 'कर्क',
    janma_rashi_degrees: "19°02'",
    nakshatra_en: 'Ashlesha',
    nakshatra_hi: 'आश्लेषा',
    current_maha_lord_en: 'Jupiter',
    current_maha_lord_hi: 'गुरु',
    current_antar_lord_en: 'Mercury',
    current_antar_lord_hi: 'बुध',
    maha_started_at: '2020-03-21',
    maha_ends_at: '2036-03-21',
    antar_started_at: '2025-12-04',
    antar_ends_at: '2028-03-15',
    sade_sati_phase: 'peak',
    tags: ['family-elder', 'in-person-only', 'sade-sati'],
    pandit_notes:
      'No tech/email. Comes in person quarterly. Birth time approximate (within 30 min). Sade Sati peak phase active.',
    first_consult_at: '2019-08-12T15:00:00Z',
    last_consult_at: '2026-04-11T11:00:00Z',
    initials: 'SI',
    avatar_color: '#6b7180',
    critical_alerts: 1,
    notable_alerts: 1,
  },
  {
    id: 'client-007',
    full_name: 'Ms. Kavita Reddy',
    birth_data: {
      date: '1988-06-15',
      time: '12:30',
      place: 'Hyderabad, India',
      lat: 17.385,
      lng: 78.4867,
      tz: 'Asia/Kolkata',
    },
    age: 37,
    contact_email: 'kavita.reddy@example.com',
    link_state: 'paused',
    engagement_state: 'active',
    janma_rashi_en: 'Dhanu',
    janma_rashi_hi: 'धनु',
    janma_rashi_degrees: "8°12'",
    nakshatra_en: 'Mula',
    nakshatra_hi: 'मूल',
    current_maha_lord_en: 'Rahu',
    current_maha_lord_hi: 'राहु',
    current_antar_lord_en: 'Saturn',
    current_antar_lord_hi: 'शनि',
    maha_started_at: '2017-04-29',
    maha_ends_at: '2035-04-29',
    antar_started_at: '2024-11-08',
    antar_ends_at: '2027-09-14',
    tags: ['author', 'long-term'],
    pandit_notes:
      'Paused permissions last month. Likely returning after personal break — keep her as active.',
    first_consult_at: '2021-09-22T10:00:00Z',
    last_consult_at: '2026-04-30T13:00:00Z',
    initials: 'KR',
    avatar_color: '#c97a4a',
    critical_alerts: 0,
    notable_alerts: 0,
  },
  {
    id: 'client-008',
    full_name: 'Mr. Arjun Bhardwaj',
    birth_data: {
      date: '2001-02-19',
      time: '16:48',
      place: 'Jaipur, India',
      lat: 26.9124,
      lng: 75.7873,
      tz: 'Asia/Kolkata',
    },
    age: 24,
    contact_email: 'arjun.b@example.com',
    link_state: 'unlinked',
    engagement_state: 'prospect',
    janma_rashi_en: 'Vrishabha',
    janma_rashi_hi: 'वृषभ',
    janma_rashi_degrees: "27°33'",
    nakshatra_en: 'Mrigashira',
    nakshatra_hi: 'मृगशीर्ष',
    current_maha_lord_en: 'Jupiter',
    current_maha_lord_hi: 'गुरु',
    current_antar_lord_en: 'Saturn',
    current_antar_lord_hi: 'शनि',
    maha_started_at: '2024-02-19',
    maha_ends_at: '2040-02-19',
    antar_started_at: '2026-02-15',
    antar_ends_at: '2028-08-30',
    tags: ['referred-by-mr-patel', 'new'],
    pandit_notes: 'Referred by Mr Patel last week. First consultation scheduled.',
    initials: 'AB',
    avatar_color: '#7a8499',
    critical_alerts: 0,
    notable_alerts: 0,
  },
  {
    id: 'client-009',
    full_name: 'Dr. Meera Krishnan',
    birth_data: {
      date: '1972-10-08',
      time: '07:20',
      place: 'Kochi, India',
      lat: 9.9312,
      lng: 76.2673,
      tz: 'Asia/Kolkata',
    },
    age: 53,
    contact_email: 'dr.meera.k@example.com',
    link_state: 'linked',
    engagement_state: 'active',
    janma_rashi_en: 'Kanya',
    janma_rashi_hi: 'कन्या',
    janma_rashi_degrees: "2°15'",
    nakshatra_en: 'Uttara Phalguni',
    nakshatra_hi: 'उत्तर फाल्गुनी',
    current_maha_lord_en: 'Mercury',
    current_maha_lord_hi: 'बुध',
    current_antar_lord_en: 'Ketu',
    current_antar_lord_hi: 'केतु',
    maha_started_at: '2018-12-12',
    maha_ends_at: '2035-12-12',
    antar_started_at: '2025-08-04',
    antar_ends_at: '2026-08-25',
    tags: ['doctor', 'spiritual-questions'],
    first_consult_at: '2022-11-14T18:30:00Z',
    last_consult_at: '2026-05-15T20:00:00Z',
    next_followup_at: '2026-06-15T20:00:00Z',
    initials: 'MK',
    avatar_color: '#3aa370',
    critical_alerts: 0,
    notable_alerts: 1,
  },
  {
    id: 'client-010',
    full_name: 'Mr. Vikram Joshi',
    birth_data: {
      date: '1984-01-26',
      time: '23:14',
      place: 'Mumbai, India',
      lat: 19.076,
      lng: 72.8777,
      tz: 'Asia/Kolkata',
    },
    age: 42,
    contact_email: 'vikram.joshi@example.com',
    link_state: 'declined',
    engagement_state: 'past',
    janma_rashi_en: 'Mesha',
    janma_rashi_hi: 'मेष',
    janma_rashi_degrees: "16°48'",
    nakshatra_en: 'Bharani',
    nakshatra_hi: 'भरणी',
    current_maha_lord_en: 'Saturn',
    current_maha_lord_hi: 'शनि',
    current_antar_lord_en: 'Saturn',
    current_antar_lord_hi: 'शनि',
    maha_started_at: '2024-09-30',
    maha_ends_at: '2043-09-30',
    antar_started_at: '2024-09-30',
    antar_ends_at: '2027-10-03',
    tags: ['declined-link-2026-03'],
    pandit_notes: 'Declined link invitation in March 2026. Still consults occasionally in person.',
    first_consult_at: '2020-06-10T16:00:00Z',
    last_consult_at: '2026-03-15T11:00:00Z',
    initials: 'VJ',
    avatar_color: '#8a4040',
    critical_alerts: 0,
    notable_alerts: 0,
  },
];

// ───────────────────────────────────────────────────────────────────────
// Family members for some clients (used in the Family tab)
// ───────────────────────────────────────────────────────────────────────

export const MOCK_FAMILY_MEMBERS: MockFamilyMember[] = [
  {
    id: 'fam-001',
    client_id: 'client-001',
    full_name: 'Mr. Rakesh Sharma',
    relationship: 'spouse',
    birth_data: {
      date: '1975-09-08',
      time: '07:30',
      place: 'Mumbai, India',
      lat: 19.076,
      lng: 72.8777,
      tz: 'Asia/Kolkata',
    },
  },
  {
    id: 'fam-002',
    client_id: 'client-001',
    full_name: 'Aanya Sharma',
    relationship: 'daughter',
    birth_data: {
      date: '2008-06-14',
      time: '11:20',
      place: 'Mumbai, India',
      lat: 19.076,
      lng: 72.8777,
      tz: 'Asia/Kolkata',
    },
  },
  {
    id: 'fam-003',
    client_id: 'client-001',
    full_name: 'Arnav Sharma',
    relationship: 'son',
    birth_data: {
      date: '2010-12-02',
      time: '15:45',
      place: 'Mumbai, India',
      lat: 19.076,
      lng: 72.8777,
      tz: 'Asia/Kolkata',
    },
  },
  {
    id: 'fam-004',
    client_id: 'client-002',
    full_name: 'Mrs. Hina Patel',
    relationship: 'spouse',
    birth_data: {
      date: '1968-04-22',
      time: '14:00',
      place: 'Ahmedabad, India',
      lat: 23.0225,
      lng: 72.5714,
      tz: 'Asia/Kolkata',
    },
  },
];

// ───────────────────────────────────────────────────────────────────────
// Sample consultations
// ───────────────────────────────────────────────────────────────────────

export const MOCK_CONSULTATIONS: MockConsultation[] = [
  {
    id: 'cons-001',
    client_id: 'client-001',
    consulted_at: '2026-06-02T11:00:00Z',
    channel: 'video',
    duration_minutes: 45,
    pandit_private_notes:
      'Discussed upcoming Mercury-Ketu antardasha. She is anxious about her marketing director role. Counselled patience until October 2026 dasha transition. Mentioned to consider career pivot once Ketu AD begins. Suggested mantra: Buddha Beej for next 90 days.',
    client_visible_summary:
      'We reviewed the Saturn-Mercury major-minor period and its influence on your professional life. The next 4 months are favourable for completing existing work; new initiatives are better timed for after October when Ketu antardasha begins. Recommended remedies attached.',
    shared_with_client: true,
    next_followup_at: '2026-06-09T11:00:00Z',
  },
  {
    id: 'cons-002',
    client_id: 'client-001',
    consulted_at: '2026-04-15T11:00:00Z',
    channel: 'video',
    duration_minutes: 60,
    pandit_private_notes:
      'Annual reading for FY2026-27. Comprehensive review. She wanted dasha chart for her teenage daughter — provided basic chart. Long discussion about Saturn maha-dasha implications for next 13 years.',
    client_visible_summary:
      'Annual reading for FY 2026-27. Covered planetary periods, major transits, and prescriptions for the year ahead. Special focus on dasha sandhi in October.',
    shared_with_client: true,
  },
  {
    id: 'cons-003',
    client_id: 'client-003',
    consulted_at: '2026-06-04T09:30:00Z',
    channel: 'in_person',
    duration_minutes: 30,
    pandit_private_notes:
      'Quick matching session for upcoming marriage proposal. Pushed Ashta Kuta report and verdict to her dashboard.',
    client_visible_summary:
      'Compatibility analysis complete. Full Ashta Kuta report available in your dashboard.',
    shared_with_client: true,
  },
];

// ───────────────────────────────────────────────────────────────────────
// Alerts — 9 across critical/notable/info
// ───────────────────────────────────────────────────────────────────────

export const MOCK_ALERTS: MockAlert[] = [
  {
    id: 'alert-001',
    client_id: 'client-001',
    client_full_name: 'Mrs. Sunita Sharma',
    kind: 'antar_dasha_change',
    fires_at: '2026-06-08',
    severity: 'critical',
    title_en: 'Saturn-Mercury → Saturn-Ketu antardasha sandhi in 4 days',
    title_hi: 'शनि-बुध से शनि-केतु अंतर्दशा संधि — 4 दिन में',
    context:
      'Mercury AD has shaped her past 2 years (career growth, role change). Ketu AD begins 8 June 2026 — different colour entirely. Revisit her ongoing initiatives before she enters this 1-year period.',
    payload: { from: 'Mercury', to: 'Ketu', date: '2026-06-08' },
  },
  {
    id: 'alert-002',
    client_id: 'client-002',
    client_full_name: 'Mr. Rajesh Patel',
    kind: 'sade_sati_peak',
    fires_at: '2026-06-05',
    severity: 'critical',
    title_en: 'Sade Sati peak phase begins tomorrow',
    title_hi: 'साढ़े साती की मध्य अवस्था कल से प्रारम्भ',
    context:
      'Saturn ingress to Aquarius (his natal moon sign). The peak 2.5-year window is the most demanding part of Sade Sati. Family-business decisions should be deferred where possible.',
    payload: { phase: 'peak', natal_moon: 'Aquarius', ingress_date: '2026-06-05' },
  },
  {
    id: 'alert-003',
    client_id: 'client-003',
    client_full_name: 'Ananya Kumar',
    kind: 'eclipse_impact',
    fires_at: '2026-06-09',
    severity: 'critical',
    title_en: 'Solar eclipse impacts natal lagna (3° orb)',
    title_hi: 'सूर्य ग्रहण आपकी लग्न को प्रभावित कर रहा है (3° कक्षा)',
    context:
      'Annular solar eclipse at 18° Taurus, in tight 3° orb of her natal lagna at 14°22\' Libra (180° aspect). She should defer major decisions for 21 days before-and-after.',
    payload: { orb: 3, aspect: '180°' },
  },
  {
    id: 'alert-004',
    client_id: 'client-006',
    client_full_name: 'Mr. Sanjay Iyer',
    kind: 'jupiter_aspect_natal',
    fires_at: '2026-06-12',
    severity: 'critical',
    title_en: 'Jupiter aspects natal 5th house — auspicious window opens',
    title_hi: 'गुरु पंचम भाव पर दृष्टि — शुभ काल का प्रारम्भ',
    context:
      'Jupiter from Gemini casts 9th-house aspect to his natal Pisces 5th house. Excellent window for children-related blessings, education decisions, charity initiatives.',
    payload: { aspecting: 'natal_5th_house', from: 'Gemini' },
  },
  {
    id: 'alert-005',
    client_id: 'client-001',
    client_full_name: 'Mrs. Sunita Sharma',
    kind: 'jupiter_aspect_natal',
    fires_at: '2026-06-11',
    severity: 'notable',
    title_en: 'Jupiter 9th-house aspect to natal 9th lord',
    context: 'Mild but supportive aspect for the next 4 weeks. Good for new learning, philosophical pursuits.',
  },
  {
    id: 'alert-006',
    client_id: 'client-005',
    client_full_name: 'Priya Mehta',
    kind: 'saturn_ingress_natal_house',
    fires_at: '2026-06-15',
    severity: 'notable',
    title_en: 'Saturn ingress to natal 7th house (relationships, partnerships)',
    context:
      'Saturn enters Aquarius for the next 2.5 years; she is in startup-founder mode. Co-founder dynamics may require patience.',
  },
  {
    id: 'alert-007',
    client_id: 'client-009',
    client_full_name: 'Dr. Meera Krishnan',
    kind: 'antar_dasha_change',
    fires_at: '2026-08-25',
    severity: 'notable',
    title_en: 'Mercury-Ketu → Mercury-Venus AD in 12 weeks',
    context: 'Significant period transition. Begin to prepare her psychologically over next 2 months.',
  },
  {
    id: 'alert-008',
    client_id: 'client-001',
    client_full_name: 'Mrs. Sunita Sharma',
    kind: 'birthday',
    fires_at: '2026-06-19',
    severity: 'info',
    title_en: "Mrs. Sharma's birthday in 15 days",
    context: 'Solar return reading window opens 7 days before. Schedule birthday call.',
  },
  {
    id: 'alert-009',
    client_id: 'client-002',
    client_full_name: 'Mr. Rajesh Patel',
    kind: 'followup_due',
    fires_at: '2026-06-10',
    severity: 'info',
    title_en: 'Follow-up due (you noted "after Sade Sati onset")',
    context: 'You scheduled this follow-up during last session to discuss Sade Sati strategy.',
  },
];

// ───────────────────────────────────────────────────────────────────────
// Deliverables
// ───────────────────────────────────────────────────────────────────────

export const MOCK_DELIVERABLES: MockDeliverable[] = [
  {
    id: 'deliv-001',
    client_id: 'client-001',
    kind: 'tippanni',
    title: 'Annual Tippanni 2026-27',
    locale: 'hi',
    pushed_at: '2026-04-15T13:00:00Z',
    client_seen_at: '2026-04-15T18:32:00Z',
    client_acknowledged_at: '2026-04-16T10:00:00Z',
    visibility: 'client_pushed',
  },
  {
    id: 'deliv-002',
    client_id: 'client-001',
    kind: 'kundali_report',
    title: 'Full Kundali Report',
    locale: 'en',
    pushed_at: '2024-02-21T15:00:00Z',
    client_seen_at: '2024-02-22T09:00:00Z',
    visibility: 'client_pushed',
  },
  {
    id: 'deliv-003',
    client_id: 'client-003',
    kind: 'matching_report',
    title: 'Ashta Kuta Compatibility — with Mr. Raghav Singh',
    locale: 'en',
    pushed_at: '2026-06-04T10:15:00Z',
    client_seen_at: '2026-06-04T11:48:00Z',
    visibility: 'client_pushed',
  },
];

// ───────────────────────────────────────────────────────────────────────
// Sample tippanni body — for the editor preview
// ───────────────────────────────────────────────────────────────────────

export interface TippanniSection {
  id: string;
  title_en: string;
  title_hi: string;
  enabled: boolean;
  body_hi: string;
  body_en: string;
  citation?: string;
}

export const MOCK_TIPPANNI_SECTIONS: TippanniSection[] = [
  {
    id: 'sec-1',
    title_en: 'Lagna Analysis',
    title_hi: 'लग्न विश्लेषण',
    enabled: true,
    body_hi:
      'आपका जन्म तुला लग्न में हुआ है। तुला राशि शुक्र की राशि है, जो सुन्दरता, सामञ्जस्य, न्याय और सम्बन्धों की प्रतीक है। इस लग्न में जन्मे लोग प्राकृतिक रूप से कूटनीतिक, सौन्दर्य-प्रेमी और न्यायप्रिय होते हैं। आपके चन्द्रमा भी तुला में होने से यह स्वभाव और अधिक मुख्यता पाता है।',
    body_en:
      'You are born under Libra ascendant. Libra is ruled by Venus and symbolises beauty, harmony, justice, and relationships. People born under this ascendant are naturally diplomatic, aesthetic-loving and just. With your Moon also in Libra, these traits are doubly emphasised.',
    citation: 'Phaladeepika 1.4',
  },
  {
    id: 'sec-2',
    title_en: 'Current Dasha — Saturn / Mercury',
    title_hi: 'वर्तमान दशा — शनि / बुध',
    enabled: true,
    body_hi:
      'अप्रत्यक्ष व्यवस्थापन का चरण समाप्ति की ओर है। शनि महादशा में बुध की अन्तर्दशा (२०२४ फरवरी से २०२६ अक्टूबर) ने आपको परिश्रम का फल और व्यावसायिक स्थिरता दी है। यह काल अगले ४ माह तक उच्च-स्तरीय कार्यों और सम्बन्धों की पुष्टि का है।',
    body_en:
      "The current Saturn major / Mercury minor period (Feb 2024 to Oct 2026) has delivered rewards for sustained effort and professional stability. The next 4 months continue this trajectory — favourable for completing high-stake initiatives and consolidating relationships.",
    citation: 'BPHS 47.32',
  },
  {
    id: 'sec-3',
    title_en: 'Year Ahead — Major Transits',
    title_hi: 'आगामी वर्ष — प्रमुख गोचर',
    enabled: true,
    body_hi:
      'जून २०२६ से २०२७: गुरु धनु राशि में, आपकी तीसरी स्थिति पर — संकल्प और संचार के लिए अनुकूल। शनि कुम्भ में स्थिर — पञ्चम भाव पर दृष्टि से सन्तान और बुद्धि से सम्बन्धित विषयों पर परिणाम। ज्येष्ठ माह के सूर्य ग्रहण आपकी राशि पर सीधा प्रभाव नहीं डाल रहा।',
    body_en:
      'June 2026 to 2027: Jupiter in Sagittarius from your 3rd house — favourable for willpower and communication. Saturn stable in Aquarius — aspecting the 5th house, results in matters of progeny and intellect. The June solar eclipse does not directly impact your sign.',
  },
  {
    id: 'sec-4',
    title_en: 'Saturn Dasha Sandhi (8 Aug 2032)',
    title_hi: 'शनि दशा सन्धि (८ अगस्त २०३२)',
    enabled: true,
    body_hi:
      'महादशा संधि का परिणाम पूर्ण काल से ६ माह पूर्व अनुभव होता है। शनि महादशा का अन्त २०३२ अगस्त को होगा, जिसके साथ बुध महादशा (१७ वर्ष) प्रारम्भ होगी। यह संधि-काल — २०३२ की प्रथम छमाही — आपके लिए जीवन-दिशा परिवर्तन का अवसर रहेगा।',
    body_en:
      'Effects of major dasha transitions surface 6 months before the formal turn. Your Saturn dasha ends August 2032, with Mercury dasha (17 years) beginning. The transition window — first half of 2032 — will offer life-direction shift opportunities.',
  },
  {
    id: 'sec-5',
    title_en: 'Recommended Remedies',
    title_hi: 'अनुशंसित उपाय',
    enabled: true,
    body_hi:
      'दैनिक: सूर्योदय के समय बुध बीज मन्त्र "ॐ बुं बुधाय नमः" का १०८ बार जप। साप्ताहिक: बुधवार को हरा चना खिलाना, नीलम धारण (गुणानुकूल)। मासिक: शनि अमावस्या को सरसों का तेल दीप।',
    body_en:
      'Daily: chant Mercury bija mantra "Om Bum Budhaya Namah" 108 times at sunrise. Weekly: feed green gram on Wednesdays; consider wearing emerald (if dignity is favourable). Monthly: light a mustard oil lamp on Saturday amavasya.',
  },
  {
    id: 'sec-6',
    title_en: 'Suggested Muhurtas for the Year',
    title_hi: 'वर्ष के लिए सुझाए गए मुहूर्त',
    enabled: false,
    body_hi: '...',
    body_en: '...',
  },
];

// ───────────────────────────────────────────────────────────────────────
// Helpers used by prototype components
// ───────────────────────────────────────────────────────────────────────

export function getClientById(id: string): MockClient | undefined {
  return MOCK_CLIENTS.find((c) => c.id === id);
}

export function getFamilyMembersForClient(clientId: string): MockFamilyMember[] {
  return MOCK_FAMILY_MEMBERS.filter((m) => m.client_id === clientId);
}

export function getConsultationsForClient(clientId: string): MockConsultation[] {
  return MOCK_CONSULTATIONS.filter((c) => c.client_id === clientId).sort((a, b) =>
    a.consulted_at < b.consulted_at ? 1 : -1,
  );
}

export function getAlertsForClient(clientId: string): MockAlert[] {
  return MOCK_ALERTS.filter((a) => a.client_id === clientId);
}

export function getDeliverablesForClient(clientId: string): MockDeliverable[] {
  return MOCK_DELIVERABLES.filter((d) => d.client_id === clientId).sort((a, b) =>
    (a.pushed_at ?? '') < (b.pushed_at ?? '') ? 1 : -1,
  );
}

export function relativeTimeSince(iso: string | undefined): string {
  if (!iso) return '—';
  const then = new Date(iso).getTime();
  const now = new Date('2026-06-04T11:00:00Z').getTime();
  const diffMs = now - then;
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

export function relativeTimeUntil(iso: string | undefined): string {
  if (!iso) return '—';
  const then = new Date(iso).getTime();
  const now = new Date('2026-06-04T11:00:00Z').getTime();
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
