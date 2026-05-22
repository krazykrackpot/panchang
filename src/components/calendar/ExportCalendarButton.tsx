'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Download, Loader2, ChevronDown, FileText, Image as ImageIcon, FileImage } from 'lucide-react';
import TithiCalendarExport, { type TithiCalendarExportProps } from './TithiCalendarExport';
import { useCalendarExport, type ExportFormat } from '@/lib/calendar/use-calendar-export';
import { tl } from '@/lib/utils/trilingual';
import MSG from '@/messages/pages/tithi.json';

interface Props extends Omit<TithiCalendarExportProps, 'format'> {
  /** Used by the hook to know whether the user navigated away mid-render. */
  freshKey: string;
  /** Optional override for the lunar-masa filename slug. Falls back to
   *  whichever masa name we can pull from days[14]. */
  filenameMasa?: string;
}

interface FormatOption {
  id: ExportFormat;
  Icon: typeof FileText;
  labelKey: 'exportPdfLabel' | 'exportJpegLabel' | 'exportPngLabel';
  hintKey: 'exportPdfHint' | 'exportJpegHint' | 'exportPngHint';
}

const FORMATS: FormatOption[] = [
  { id: 'pdf',  Icon: FileText,  labelKey: 'exportPdfLabel',  hintKey: 'exportPdfHint'  },
  { id: 'jpeg', Icon: ImageIcon, labelKey: 'exportJpegLabel', hintKey: 'exportJpegHint' },
  { id: 'png',  Icon: FileImage, labelKey: 'exportPngLabel',  hintKey: 'exportPngHint'  },
];

export default function ExportCalendarButton(props: Props) {
  const { freshKey, locale, filenameMasa, ...layoutBase } = props;
  const [open, setOpen] = useState(false);
  const [activeFormat, setActiveFormat] = useState<ExportFormat>('pdf');
  const exportRef = useRef<HTMLDivElement>(null);
  const freshKeyRef = useRef(freshKey);
  freshKeyRef.current = freshKey;
  const startedKeyRef = useRef<string>('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Pick the lunar masa name from mid-month for the filename slug (matches
  // the bulk of visible cells regardless of where the month boundary falls).
  const masaName =
    filenameMasa
    ?? layoutBase.days[14]?.masa?.[layoutBase.masaConvention]
    ?? layoutBase.days[0]?.masa?.[layoutBase.masaConvention]
    ?? '';

  const { run, reset, status } = useCalendarExport({
    getNode: () => exportRef.current,
    prepare: (format) =>
      new Promise<void>((resolve) => {
        startedKeyRef.current = freshKeyRef.current;
        setActiveFormat(format);
        // Two frames let React commit, then the off-screen layout lay out.
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
      }),
    isFresh: () => startedKeyRef.current === freshKeyRef.current,
    filenameInputs: { masaName, year: layoutBase.year, month: layoutBase.month },
    labels: { errorGeneric: tl(MSG.exportError, locale) },
  });

  // Auto-dismiss success/error toast after a few seconds.
  useEffect(() => {
    if (status.kind === 'success' || status.kind === 'error') {
      const id = setTimeout(reset, 4000);
      return () => clearTimeout(id);
    }
  }, [status, reset]);

  // Close the dropdown when clicking outside.
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  const handlePick = useCallback((format: ExportFormat) => {
    setOpen(false);
    run(format);
  }, [run]);

  const busy = status.kind === 'rendering';

  return (
    <>
      <div ref={dropdownRef} className="relative inline-block">
        <button
          type="button"
          disabled={busy}
          onClick={() => setOpen((o) => !o)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gold-primary/30 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] hover:border-gold-primary/60 hover:bg-gold-primary/10 transition-colors text-sm text-gold-light font-medium disabled:opacity-60 disabled:cursor-not-allowed"
          aria-label={tl(MSG.exportTrigger, locale)}
        >
          {busy ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          <span>{busy ? tl(MSG.exportRendering, locale) : tl(MSG.exportTrigger, locale)}</span>
          {!busy && <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />}
        </button>

        {open && !busy && (
          <div
            role="menu"
            className="absolute left-1/2 -translate-x-1/2 mt-2 w-72 rounded-xl border border-gold-primary/30 bg-bg-secondary/95 backdrop-blur-sm shadow-2xl z-30 overflow-hidden"
          >
            {FORMATS.map(({ id, Icon, labelKey, hintKey }) => (
              <button
                key={id}
                role="menuitem"
                type="button"
                onClick={() => handlePick(id)}
                className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-gold-primary/10 transition-colors border-b border-gold-primary/10 last:border-b-0"
              >
                <Icon className="w-5 h-5 mt-0.5 text-gold-primary shrink-0" />
                <div className="min-w-0">
                  <div className="text-sm text-gold-light font-medium">{tl(MSG[labelKey], locale)}</div>
                  <div className="text-xs text-text-secondary mt-0.5">{tl(MSG[hintKey], locale)}</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Status toast */}
      {(status.kind === 'success' || status.kind === 'error') && (
        <div
          role="status"
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl shadow-2xl text-sm font-medium ${
            status.kind === 'success'
              ? 'bg-emerald-600/95 text-white border border-emerald-400/60'
              : 'bg-red-600/95 text-white border border-red-400/60'
          }`}
        >
          {status.kind === 'success'
            ? tl(MSG.exportSaved, locale).replace('{filename}', status.filename)
            : status.message}
        </div>
      )}

      {/* Off-screen export layout — mounted permanently but off-screen.
          Toggling `activeFormat` re-renders at the right dimensions. */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          left: -99999,
          top: 0,
          pointerEvents: 'none',
          opacity: 0,
        }}
      >
        <TithiCalendarExport
          ref={exportRef}
          format={activeFormat}
          locale={locale}
          {...layoutBase}
        />
      </div>
    </>
  );
}
