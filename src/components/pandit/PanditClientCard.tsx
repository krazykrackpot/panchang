'use client';

/**
 * Roster tile — production version backed by PanditClient (real schema).
 * Visual design mirrors src/components/pandit/PanditCard.tsx (the
 * prototype variant) but consumes the canonical types.
 *
 * Spec §18.2.
 */

import Link from 'next/link';
import {
  type PanditClient,
  clientInitials,
  ageFromBirthDate,
  relativeTimeSince,
} from '@/lib/pandit/types';
import LifecycleBadgePair from './LifecycleBadgePair';

interface Props {
  client: PanditClient;
}

// Deterministic colour from id so card avatar colour stays stable.
function avatarColorForId(id: string): string {
  const palette = [
    '#5a3aa3', // pandit-violet
    '#3aa370', // active green
    '#d4a853', // gold
    '#c97a4a', // paused amber
    '#5a8ad9', // info blue
    '#8c66d9', // violet light
    '#c79a4a', // past gold
    '#3a4566', // client slate
  ];
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return palette[Math.abs(h) % palette.length];
}

export default function PanditClientCard({ client }: Props) {
  const initials = clientInitials(client.full_name);
  const age = ageFromBirthDate(client.birth_data.date);
  const color = client.color || avatarColorForId(client.id);

  return (
    <Link
      href={`/dashboard/clients/${client.id}` as never}
      className="group relative block"
      aria-label={`Open ${client.full_name}`}
    >
      <div
        className="
          relative h-full rounded-2xl border transition-all duration-200
          bg-gradient-to-br from-[#1a1f4e]/60 via-[#111638]/70 to-[#0a0e27]
          border-gold-primary/12
          hover:border-gold-primary/40 hover:-translate-y-1 hover:shadow-xl
          hover:shadow-gold-primary/5
        "
      >
        <div className="p-5 flex flex-col gap-3 h-full">
          {/* Avatar + name */}
          <div className="flex items-start gap-3">
            <div
              className="flex-none w-12 h-12 rounded-full flex items-center justify-center font-semibold text-white text-sm"
              style={{ backgroundColor: color }}
              aria-hidden
            >
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <h3
                className="font-semibold text-text-primary leading-tight truncate"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {client.display_label ?? client.full_name}
              </h3>
              <p className="text-[11px] text-text-secondary tabular-nums mt-0.5">
                Born {client.birth_data.date}
                {age !== null && ` · age ${age}`}
              </p>
            </div>
          </div>

          {/* Tags */}
          {client.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {client.tags.slice(0, 3).map((t) => (
                <span
                  key={t}
                  className="text-[10px] px-2 py-0.5 rounded-full bg-bg-secondary/40 text-text-secondary border border-gold-primary/10"
                >
                  {t}
                </span>
              ))}
              {client.tags.length > 3 && (
                <span className="text-[10px] text-text-tertiary self-center">
                  +{client.tags.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Last consult */}
          <div className="mt-auto pt-2 space-y-2.5">
            <div className="text-[11px] text-text-secondary">
              Last consult:{' '}
              <span className="text-text-primary">
                {relativeTimeSince(client.last_consult_at)}
              </span>
            </div>
            <LifecycleBadgePair
              engagement={client.engagement_state}
              link={client.link_state}
              size="sm"
            />
          </div>
        </div>
      </div>
    </Link>
  );
}
