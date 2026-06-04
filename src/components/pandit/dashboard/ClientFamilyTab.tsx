'use client';

/**
 * Client Family tab — Pandit's working family for a client.
 * Spec §6 + §18.3 + §24.
 *
 * Pandit CRM P4.
 *
 * Lists the Pandit-owned pandit_client_family_members rows for the
 * client (separate from any saved_charts the client may have in their
 * own account). Pandit can add, edit, or delete members. When at least
 * one member has birth_data, runs the existing family-synthesis library
 * to render Marriage Dynamics + Children Dynamics + Family Summary
 * cards.
 *
 * The synthesis library expects a KundaliData "anchor" + FamilyContext
 * (spouse + children). Adapter: client's birth_data → /api/kundali →
 * anchor; each family member's birth_data → /api/kundali → wrapped as
 * FamilyMember per relationship.
 */

import { useEffect, useState, useCallback } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { getSupabase } from '@/lib/supabase/client';
import type {
  PanditClient,
  PanditClientFamilyMember,
  FamilyRelationship,
  BirthData,
} from '@/lib/pandit/types';
import type { KundaliData, PlanetPosition, BirthData as EngineBirthData } from '@/types/kundali';
import { computeFamilyReading } from '@/lib/kundali/family-synthesis';
import type { FamilyReading } from '@/lib/kundali/family-synthesis/types';
import LocationSearch from '@/components/ui/LocationSearch';

interface Props {
  client: PanditClient;
}

const RELATIONSHIP_LABELS: Record<FamilyRelationship, { en: string; hi: string }> = {
  spouse: { en: 'Spouse', hi: 'पति/पत्नी' },
  son: { en: 'Son', hi: 'पुत्र' },
  daughter: { en: 'Daughter', hi: 'पुत्री' },
  father: { en: 'Father', hi: 'पिता' },
  mother: { en: 'Mother', hi: 'माता' },
  sibling: { en: 'Sibling', hi: 'भाई/बहन' },
  other: { en: 'Other', hi: 'अन्य' },
};

function toEngineBirthData(name: string, bd: BirthData): EngineBirthData {
  return {
    name,
    date: bd.date,
    time: bd.time || '12:00',
    place: bd.place,
    lat: bd.lat,
    lng: bd.lng,
    timezone: bd.tz,
    ayanamsha: 'lahiri',
    relationship: 'other',
    node_type: 'mean',
  };
}

export default function ClientFamilyTab({ client }: Props) {
  const { user } = useAuthStore();
  const [members, setMembers] = useState<PanditClientFamilyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Family-synthesis state (computed lazily once the user clicks "Run synthesis")
  const [reading, setReading] = useState<FamilyReading | null>(null);
  const [synthesisLoading, setSynthesisLoading] = useState(false);
  const [synthesisError, setSynthesisError] = useState<string | null>(null);

  const loadMembers = useCallback(async () => {
    if (!user) return;
    try {
      const supabase = getSupabase();
      if (!supabase) {
        setError('Auth not configured');
        setLoading(false);
        return;
      }
      const { data: session } = await supabase.auth.getSession();
      const token = session.session?.access_token;
      if (!token) {
        setError('No session');
        setLoading(false);
        return;
      }
      const res = await fetch(`/api/pandit/clients/${client.id}/family`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        console.error('[ClientFamilyTab] load failed:', body?.error || res.status);
        setError(body?.error || `Failed to load (${res.status})`);
        setLoading(false);
        return;
      }
      const body = (await res.json()) as { family_members: PanditClientFamilyMember[] };
      setMembers(body.family_members);
      setLoading(false);
    } catch (e) {
      console.error('[ClientFamilyTab] uncaught:', e);
      setError('Could not reach the server.');
      setLoading(false);
    }
  }, [user, client.id]);

  useEffect(() => {
    setLoading(true);
    loadMembers();
  }, [loadMembers]);

  const handleAddMember = async (input: {
    full_name: string;
    relationship: FamilyRelationship;
    birth_data: BirthData | null;
    notes: string;
  }) => {
    const supabase = getSupabase();
    if (!supabase) return;
    const { data: session } = await supabase.auth.getSession();
    const token = session.session?.access_token;
    if (!token) return;
    const res = await fetch(`/api/pandit/clients/${client.id}/family`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        full_name: input.full_name,
        relationship: input.relationship,
        birth_data: input.birth_data,
        notes: input.notes || undefined,
      }),
    });
    if (!res.ok) {
      const body = (await res.json().catch(() => ({}))) as { error?: string; message?: string };
      throw new Error(body.message || body.error || `HTTP ${res.status}`);
    }
    await loadMembers();
    setShowAdd(false);
  };

  const handleDeleteMember = async (memberId: string) => {
    if (!confirm('Remove this family member from the record?')) return;
    const supabase = getSupabase();
    if (!supabase) return;
    const { data: session } = await supabase.auth.getSession();
    const token = session.session?.access_token;
    if (!token) return;
    const res = await fetch(`/api/pandit/family-members/${memberId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      alert(body.error || 'Could not delete');
      return;
    }
    await loadMembers();
  };

  const runFamilySynthesis = async () => {
    setSynthesisLoading(true);
    setSynthesisError(null);
    try {
      const supabase = getSupabase();
      if (!supabase) throw new Error('Auth not configured');
      const { data: session } = await supabase.auth.getSession();
      const token = session.session?.access_token;
      if (!token) throw new Error('No session');

      // Compute the anchor (client's kundali)
      const anchorRes = await fetch('/api/kundali', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(toEngineBirthData(client.full_name, client.birth_data)),
      });
      if (!anchorRes.ok) throw new Error(`Anchor kundali failed (${anchorRes.status})`);
      const anchor = (await anchorRes.json()) as KundaliData;

      // Compute each family member with birth_data
      const membersWithBirth = members.filter((m): m is PanditClientFamilyMember & { birth_data: BirthData } => !!m.birth_data);
      const memberKundalis = await Promise.all(
        membersWithBirth.map(async (m) => {
          const res = await fetch('/api/kundali', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify(toEngineBirthData(m.full_name, m.birth_data)),
          });
          if (!res.ok) return null;
          return { member: m, kundali: (await res.json()) as KundaliData };
        }),
      );

      const spouseEntry = memberKundalis.find(
        (m): m is NonNullable<typeof m> => !!m && m.member.relationship === 'spouse',
      );
      const childrenEntries = memberKundalis.filter(
        (m): m is NonNullable<typeof m> =>
          !!m && (m.member.relationship === 'son' || m.member.relationship === 'daughter'),
      );

      const transitPlanets: PlanetPosition[] = anchor.planets;

      const result = computeFamilyReading(
        anchor,
        {
          spouse: spouseEntry
            ? {
                chartId: spouseEntry.member.id,
                kundali: spouseEntry.kundali,
                name: spouseEntry.member.full_name,
              }
            : undefined,
          children: childrenEntries.map((c, i) => ({
            chartId: c.member.id,
            kundali: c.kundali,
            name: c.member.full_name,
            birthOrder: i + 1,
          })),
        },
        transitPlanets,
      );
      setReading(result);
    } catch (e) {
      console.error('[ClientFamilyTab] synthesis failed:', e);
      setSynthesisError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setSynthesisLoading(false);
    }
  };

  const membersWithBirthCount = members.filter((m) => m.birth_data).length;

  if (loading) {
    return (
      <div className="space-y-3">
        <div className="h-24 rounded-2xl bg-bg-secondary/30 animate-pulse" />
        <div className="h-24 rounded-2xl bg-bg-secondary/30 animate-pulse" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-[color:var(--color-alert-critical)]/30 bg-[color:var(--color-alert-critical)]/10 p-6 text-center">
        <p className="text-[color:var(--color-alert-critical)] font-medium mb-2">
          Couldn't load family members
        </p>
        <p className="text-text-secondary text-[13px] mb-4">{error}</p>
        <button
          onClick={loadMembers}
          className="px-4 py-2 rounded-lg bg-gold-primary/15 text-gold-light border border-gold-primary/30 hover:bg-gold-primary/25 text-[13px] transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header + Add */}
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <h2
            className="text-xl font-bold text-gold-light"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {client.full_name}'s family
          </h2>
          <p className="text-[12px] text-text-secondary mt-0.5">
            {members.length} member{members.length === 1 ? '' : 's'} ·{' '}
            {membersWithBirthCount} with birth data
          </p>
        </div>
        <button
          onClick={() => {
            setEditingId(null);
            setShowAdd(true);
          }}
          className="
            inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold
            bg-gradient-to-br from-gold-primary to-gold-dark text-bg-primary
            shadow-md shadow-gold-primary/30
            hover:from-gold-light hover:shadow-lg hover:shadow-gold-primary/40
            transition-all
          "
        >
          + Add family member
        </button>
      </div>

      {/* Members list */}
      {members.length === 0 && !showAdd ? (
        <div className="rounded-2xl border border-dashed border-gold-primary/20 bg-bg-secondary/20 p-8 text-center">
          <h3
            className="text-lg font-bold text-gold-light mb-2"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            No family members recorded yet
          </h3>
          <p className="text-text-secondary text-[13px] mb-4">
            Add {client.full_name}'s spouse, parents, children, or siblings to take a holistic
            view of the family chart.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {members.map((m) => (
            <FamilyMemberRow
              key={m.id}
              member={m}
              onDelete={() => handleDeleteMember(m.id)}
            />
          ))}
        </div>
      )}

      {/* Add form modal-ish (inline expandable card) */}
      {showAdd && (
        <AddFamilyMemberCard
          onAdd={handleAddMember}
          onCancel={() => setShowAdd(false)}
          editingMember={editingId ? members.find((m) => m.id === editingId) ?? null : null}
        />
      )}

      {/* Family synthesis trigger + output */}
      {membersWithBirthCount >= 1 && (
        <div className="border-t border-gold-primary/12 pt-6 mt-6">
          <div className="flex flex-wrap items-baseline justify-between gap-3 mb-4">
            <div>
              <h2
                className="text-xl font-bold text-gold-light"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Family synthesis
              </h2>
              <p className="text-[12px] text-text-secondary mt-0.5">
                Marriage dynamics, child synthesis, dasha sync, varga cross-read
              </p>
            </div>
            <button
              onClick={runFamilySynthesis}
              disabled={synthesisLoading}
              className={`
                inline-flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-semibold transition
                ${synthesisLoading
                  ? 'bg-bg-secondary text-text-tertiary cursor-not-allowed'
                  : 'bg-[color:var(--color-pandit-violet)]/25 text-white border border-[color:var(--color-pandit-violet-light)]/40 hover:bg-[color:var(--color-pandit-violet)]/35'}
              `}
            >
              {synthesisLoading ? 'Computing…' : reading ? 'Recompute' : 'Run synthesis'}
            </button>
          </div>

          {synthesisError && (
            <div className="rounded-xl border border-[color:var(--color-alert-critical)]/30 bg-[color:var(--color-alert-critical)]/10 p-4 mb-4 text-[13px] text-[color:var(--color-alert-critical)]">
              {synthesisError}
            </div>
          )}

          {reading && <FamilySynthesisOutput reading={reading} />}
        </div>
      )}
    </div>
  );
}

function FamilyMemberRow({
  member,
  onDelete,
}: {
  member: PanditClientFamilyMember;
  onDelete: () => void;
}) {
  const label = RELATIONSHIP_LABELS[member.relationship];
  const hasBirth = !!member.birth_data;
  return (
    <div className="rounded-xl border border-gold-primary/12 bg-bg-secondary/30 p-4 hover:border-gold-primary/30 transition">
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span
              className="font-semibold text-text-primary"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {member.full_name}
            </span>
            <span className="text-[11px] uppercase tracking-wider text-text-tertiary">
              {label.en}
            </span>
            <span
              className="text-[12px] text-[color:var(--color-text-devanagari)]"
              style={{ fontFamily: 'var(--font-devanagari-body)' }}
            >
              {label.hi}
            </span>
          </div>
          {hasBirth && member.birth_data && (
            <p className="text-[12px] text-text-secondary mt-1 tabular-nums">
              Born {member.birth_data.date}
              {member.birth_data.time && `, ${member.birth_data.time}`}
              {member.birth_data.time_estimated && (
                <span className="ml-1 text-[10px] text-[color:var(--color-link-paused)] uppercase">
                  ~est
                </span>
              )}{' '}
              · {member.birth_data.place}
            </p>
          )}
          {!hasBirth && (
            <p className="text-[12px] text-text-tertiary italic mt-1">
              Birth details not recorded
            </p>
          )}
          {member.notes && (
            <p className="text-[12px] text-text-secondary mt-2 leading-snug">
              {member.notes}
            </p>
          )}
        </div>
        <button
          onClick={onDelete}
          className="
            text-[11px] px-2 py-1 rounded text-text-tertiary hover:text-[color:var(--color-alert-critical)]
            hover:bg-[color:var(--color-alert-critical)]/10 transition
          "
          aria-label="Delete family member"
        >
          Remove
        </button>
      </div>
    </div>
  );
}

function AddFamilyMemberCard({
  onAdd,
  onCancel,
  editingMember,
}: {
  onAdd: (input: {
    full_name: string;
    relationship: FamilyRelationship;
    birth_data: BirthData | null;
    notes: string;
  }) => Promise<void>;
  onCancel: () => void;
  editingMember: PanditClientFamilyMember | null;
}) {
  const [fullName, setFullName] = useState(editingMember?.full_name ?? '');
  const [relationship, setRelationship] = useState<FamilyRelationship>(
    editingMember?.relationship ?? 'spouse',
  );
  const [date, setDate] = useState(editingMember?.birth_data?.date ?? '');
  const [time, setTime] = useState(editingMember?.birth_data?.time ?? '');
  const [timeEstimated, setTimeEstimated] = useState(
    editingMember?.birth_data?.time_estimated ?? false,
  );
  const [place, setPlace] = useState(editingMember?.birth_data?.place ?? '');
  const [location, setLocation] = useState<{
    lat: number;
    lng: number;
    name: string;
    timezone: string;
  } | null>(
    editingMember?.birth_data
      ? {
          lat: editingMember.birth_data.lat,
          lng: editingMember.birth_data.lng,
          name: editingMember.birth_data.place,
          timezone: editingMember.birth_data.tz,
        }
      : null,
  );
  const [notes, setNotes] = useState(editingMember?.notes ?? '');
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Birth data is optional, but if any of date/place is partially set,
  // ALL three need to be set together. Otherwise we omit birth_data entirely.
  const hasAnyBirthField = !!date || !!place;
  const hasCompleteBirth = !!date && /^\d{4}-\d{2}-\d{2}$/.test(date) && !!location;
  const canSubmit = fullName.trim() && (!hasAnyBirthField || hasCompleteBirth) && !saving;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setSaving(true);
    setSubmitError(null);
    try {
      const birthData: BirthData | null = hasCompleteBirth && location
        ? {
            date,
            time: time || '12:00',
            place: location.name,
            lat: location.lat,
            lng: location.lng,
            tz: location.timezone,
            time_estimated: !time || timeEstimated,
          }
        : null;
      await onAdd({
        full_name: fullName.trim(),
        relationship,
        birth_data: birthData,
        notes: notes.trim(),
      });
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Could not save');
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-gold-primary/20 bg-gradient-to-br from-[#1a1f4e]/40 via-[#111638]/60 to-[#0a0e27] p-5 space-y-4"
    >
      <h3
        className="text-base font-bold text-gold-light"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        {editingMember ? 'Edit family member' : 'Add a family member'}
      </h3>

      {submitError && (
        <div className="rounded-lg border border-[color:var(--color-alert-critical)]/30 bg-[color:var(--color-alert-critical)]/10 p-3 text-[13px] text-[color:var(--color-alert-critical)]">
          {submitError}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Full name" required>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="e.g., Mr. Rakesh Sharma"
            className="
              w-full px-3 py-2 rounded-lg
              bg-bg-secondary/40 border border-gold-primary/15
              text-text-primary placeholder:text-text-tertiary
              focus:outline-none focus:border-gold-primary/40 transition text-sm
            "
          />
        </Field>

        <Field label="Relationship" required>
          <select
            value={relationship}
            onChange={(e) => setRelationship(e.target.value as FamilyRelationship)}
            className="
              w-full px-3 py-2 rounded-lg cursor-pointer
              bg-bg-secondary/40 border border-gold-primary/15
              text-text-primary
              focus:outline-none focus:border-gold-primary/40 transition text-sm
            "
          >
            {(Object.entries(RELATIONSHIP_LABELS) as [FamilyRelationship, { en: string; hi: string }][]).map(
              ([key, lbl]) => (
                <option key={key} value={key}>
                  {lbl.en} · {lbl.hi}
                </option>
              ),
            )}
          </select>
        </Field>
      </div>

      <div className="pt-2 border-t border-gold-primary/10">
        <p className="text-[11px] uppercase tracking-wider text-text-tertiary font-semibold mb-3">
          Birth details (optional — required for family synthesis)
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Date of birth">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="
                w-full px-3 py-2 rounded-lg
                bg-bg-secondary/40 border border-gold-primary/15
                text-text-primary
                focus:outline-none focus:border-gold-primary/40 transition text-sm
              "
            />
          </Field>

          <Field label="Time of birth">
            <div className="space-y-1.5">
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="
                  w-full px-3 py-2 rounded-lg
                  bg-bg-secondary/40 border border-gold-primary/15
                  text-text-primary
                  focus:outline-none focus:border-gold-primary/40 transition text-sm
                "
              />
              <label className="flex items-center gap-2 text-[11px] text-text-secondary cursor-pointer">
                <input
                  type="checkbox"
                  checked={timeEstimated}
                  onChange={(e) => setTimeEstimated(e.target.checked)}
                  className="w-3 h-3 accent-gold-primary"
                />
                Birth time is approximate
              </label>
            </div>
          </Field>
        </div>

        <Field label="Place of birth">
          <LocationSearch
            value={place}
            onSelect={(loc) => {
              setLocation({
                lat: loc.lat,
                lng: loc.lng,
                name: loc.name,
                timezone: loc.timezone || 'Asia/Kolkata',
              });
              setPlace(loc.name);
            }}
            placeholder="Type city, e.g. Mumbai…"
          />
          {location && (
            <p className="mt-1.5 text-[11px] text-[color:var(--color-state-active)]">
              ✓ {location.name} · {location.timezone}
            </p>
          )}
        </Field>
      </div>

      <Field label="Notes">
        <textarea
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Anything to remember about this family member…"
          className="
            w-full px-3 py-2 rounded-lg
            bg-bg-secondary/40 border border-gold-primary/15
            text-text-primary placeholder:text-text-tertiary
            focus:outline-none focus:border-gold-primary/40 transition resize-none text-sm
          "
        />
      </Field>

      <div className="flex flex-wrap justify-between items-center gap-3 pt-2">
        <p className="text-[11px] text-text-tertiary">
          {hasAnyBirthField && !hasCompleteBirth
            ? 'Provide date AND place together, or leave birth details blank.'
            : 'Birth details optional — name + relationship are enough.'}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-2 rounded-lg text-[12px] text-text-secondary hover:text-text-primary transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!canSubmit}
            className={`
              px-4 py-2 rounded-lg text-[13px] font-semibold transition
              ${canSubmit
                ? 'bg-gradient-to-br from-gold-primary to-gold-dark text-bg-primary hover:from-gold-light'
                : 'bg-bg-secondary text-text-tertiary cursor-not-allowed'}
            `}
          >
            {saving ? 'Saving…' : editingMember ? 'Save changes' : 'Add member'}
          </button>
        </div>
      </div>
    </form>
  );
}

function Field({
  label,
  children,
  required,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-[12px] text-text-secondary mb-1.5">
        {label}
        {required && <span className="text-[color:var(--color-alert-critical)] ml-1">*</span>}
      </label>
      {children}
    </div>
  );
}

function FamilySynthesisOutput({ reading }: { reading: FamilyReading }) {
  return (
    <div className="space-y-4">
      {/* Family summary — single LocaleText narrative */}
      {reading.familySummary?.en && (
        <div className="rounded-2xl border border-gold-primary/15 bg-gradient-to-br from-[#1a1f4e]/40 via-[#111638]/60 to-[#0a0e27] p-5">
          <h3
            className="text-base font-bold text-gold-light mb-2"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Family overview
          </h3>
          <p className="text-[14px] text-[color:var(--color-text-pandit-author)] leading-relaxed whitespace-pre-wrap">
            {reading.familySummary.en}
          </p>
        </div>
      )}

      {/* Marriage dynamics */}
      {reading.marriageDynamics && (
        <div className="rounded-2xl border border-[color:var(--color-pandit-violet)]/25 bg-[color:var(--color-pandit-violet)]/8 p-5">
          <h3
            className="text-base font-bold text-[color:var(--color-pandit-violet-light)] mb-3"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Marriage dynamics
          </h3>
          <div className="space-y-3 text-[13px]">
            {typeof reading.marriageDynamics.gunaScore === 'number' && (
              <div>
                <p className="text-text-tertiary text-[11px] uppercase tracking-wider mb-1">
                  Ashta Kuta guna match
                </p>
                <p className="text-text-primary">
                  Score:{' '}
                  <span className="text-gold-light font-semibold tabular-nums">
                    {reading.marriageDynamics.gunaScore.toFixed(1)}/36
                  </span>
                </p>
              </div>
            )}
            {reading.marriageDynamics.vargaCrossRead && (
              <div>
                <p className="text-text-tertiary text-[11px] uppercase tracking-wider mb-1">
                  Navāṁśa (D9) cross-read
                </p>
                <p className="text-text-primary">
                  Compatibility:{' '}
                  <span className="text-gold-light font-semibold tabular-nums">
                    {reading.marriageDynamics.vargaCrossRead.compatibility.toFixed(1)}
                  </span>
                </p>
              </div>
            )}
            {reading.marriageDynamics.transitImpact?.overallTone && (
              <p className="text-text-secondary leading-relaxed">
                Current transit tone:{' '}
                <span className="text-text-primary capitalize">
                  {reading.marriageDynamics.transitImpact.overallTone}
                </span>
              </p>
            )}
            <p className="text-text-secondary leading-relaxed">
              {reading.marriageDynamics.dashaSynchronicity.inSync
                ? '✓ Dasha periods are currently in sync — supportive moment for joint decisions.'
                : 'Dasha periods are not currently in sync — individual cycles dominate.'}
            </p>
            {reading.marriageDynamics.currentDynamic?.en && (
              <p className="text-text-secondary leading-relaxed">
                {reading.marriageDynamics.currentDynamic.en}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Children dynamics */}
      {reading.childrenDynamics.length > 0 && (
        <div className="rounded-2xl border border-gold-primary/15 bg-bg-secondary/30 p-5">
          <h3
            className="text-base font-bold text-gold-light mb-3"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Children dynamics
          </h3>
          <div className="space-y-3">
            {reading.childrenDynamics.map((c) => (
              <div key={c.chartId} className="border-l-2 border-gold-primary/30 pl-3 py-1">
                <p
                  className="font-medium text-text-primary mb-0.5"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {c.childName}
                </p>
                {c.dynamics.dashaSynchronicity.inSync && (
                  <p className="text-[12px] text-[color:var(--color-state-active)]">
                    ✓ Dasha sync with parent
                  </p>
                )}
                {c.dynamics.transitImpact?.overallTone && (
                  <p className="text-[12px] text-text-secondary capitalize">
                    Transit tone: {c.dynamics.transitImpact.overallTone}
                  </p>
                )}
                {c.dynamics.currentDynamic?.en && (
                  <p className="text-[12px] text-text-secondary leading-snug mt-1">
                    {c.dynamics.currentDynamic.en}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
