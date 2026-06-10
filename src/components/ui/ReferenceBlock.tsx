import type { ReactNode } from 'react';
import CopyLinkButton from './CopyLinkButton';

export interface ReferenceRow {
  id: string;
  label: string;
  value: string | ReactNode;
  note?: string;
}

export interface ReferenceBlockProps {
  id: string;
  title: string;
  rows: ReferenceRow[];
  sourceCitation: string;
  intro?: string;
  copyLinkLabel?: string;
  copiedLabel?: string;
  copyLinkAriaTemplate?: (rowLabel: string) => string;
}

export default function ReferenceBlock({
  id,
  title,
  rows,
  sourceCitation,
  intro,
  copyLinkLabel = 'Copy link',
  copiedLabel = 'Copied',
  copyLinkAriaTemplate = (rowLabel) => `Copy link to ${rowLabel}`,
}: ReferenceBlockProps) {
  const blockAnchor = `ref-${id}`;
  return (
    <section
      id={blockAnchor}
      aria-labelledby={`${blockAnchor}-title`}
      className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/20 rounded-2xl p-6 md:p-8 my-8 shadow-[0_0_40px_-12px_rgba(212,168,83,0.15)]"
    >
      <header className="flex items-baseline justify-between gap-4 mb-4 pb-3 border-b border-gold-primary/15">
        <h3
          id={`${blockAnchor}-title`}
          className="font-heading text-xl md:text-2xl font-semibold text-gold-light"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {title}
        </h3>
        <a
          href={`#${blockAnchor}`}
          aria-label={`Anchor link to ${title}`}
          className="text-gold-primary/50 hover:text-gold-light text-sm font-mono"
        >
          #
        </a>
      </header>

      {intro && (
        <p className="text-sm text-text-secondary leading-relaxed mb-4">{intro}</p>
      )}

      <dl className="divide-y divide-gold-primary/10">
        {rows.map((row) => {
          const rowAnchor = `${blockAnchor}-${row.id}`;
          return (
            <div
              key={row.id}
              id={rowAnchor}
              className="grid grid-cols-[1fr_auto_auto] md:grid-cols-[max-content_1fr_auto] items-baseline gap-x-4 py-3 group"
            >
              <dt className="text-sm md:text-base font-medium text-gold-light">
                {row.label}
              </dt>
              <dd className="text-sm md:text-base text-text-primary font-mono tabular-nums break-words">
                {row.value}
              </dd>
              {/* On desktop, the Copy button reveals on hover (clean look).
                  On mobile/touch (md-and-below) the hover idiom doesn't
                  exist — keep it permanently visible so touch users can
                  actually copy the anchor link. Gemini #650 HIGH. */}
              <div className="md:opacity-0 md:group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                <CopyLinkButton
                  anchor={rowAnchor}
                  ariaLabel={copyLinkAriaTemplate(row.label)}
                  copyLabel={copyLinkLabel}
                  copiedLabel={copiedLabel}
                />
              </div>
              {row.note && (
                <p className="col-span-3 text-xs text-text-secondary mt-1 italic">
                  {row.note}
                </p>
              )}
            </div>
          );
        })}
      </dl>

      {/* Italic-after-divider is the universal citation idiom. No
          "Source:" prefix — it bleeds English into native-script pages
          and the visual context already signals citation. Each consumer's
          `sourceCitation` should start with the work title directly. */}
      <footer
        className="mt-5 pt-3 border-t border-gold-primary/10 text-xs text-text-secondary italic"
        aria-label="Citation"
      >
        {sourceCitation}
      </footer>
    </section>
  );
}
