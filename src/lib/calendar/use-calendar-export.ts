'use client';

import { useCallback, useRef, useState } from 'react';
import { buildExportFilename, type ExportExt } from '@/lib/calendar/export-filename';

export type ExportFormat = 'pdf' | 'jpeg' | 'png';

export type ExportStatus =
  | { kind: 'idle' }
  | { kind: 'rendering'; format: ExportFormat }
  | { kind: 'success'; filename: string }
  | { kind: 'error'; message: string };

const EXT_FOR: Record<ExportFormat, ExportExt> = { pdf: 'pdf', jpeg: 'jpg', png: 'png' };

export interface UseCalendarExportInput {
  /** Return the off-screen DOM node to capture. */
  getNode: () => HTMLDivElement | null;
  /** Switch the off-screen layout to the requested format and resolve once it has settled. */
  prepare: (format: ExportFormat) => Promise<void>;
  /** Returns true if the user has not navigated away mid-render. */
  isFresh: () => boolean;
  /** Inputs for the filename. */
  filenameInputs: { masaName: string; year: number; month: number };
  /** Localised generic error message. */
  labels: { errorGeneric: string };
}

const isIOS = (): boolean =>
  typeof navigator !== 'undefined' && /iP(hone|ad|od)/.test(navigator.userAgent);

function pickPixelRatio(format: ExportFormat): number {
  // iOS Safari OOMs on huge canvases — keep ratio low. Desktop can afford
  // more for print quality. JPEG is a fixed-size social card so 2x is plenty.
  if (isIOS()) return format === 'jpeg' ? 1.5 : 2;
  if (format === 'jpeg') return 2;
  return 2.5;
}

export function useCalendarExport({
  getNode, prepare, isFresh, filenameInputs, labels,
}: UseCalendarExportInput) {
  const inFlight = useRef(false);
  const [status, setStatus] = useState<ExportStatus>({ kind: 'idle' });

  const run = useCallback(async (format: ExportFormat) => {
    if (inFlight.current) return;
    inFlight.current = true;
    setStatus({ kind: 'rendering', format });

    try {
      // 1. Tell the parent to mount the export layout with the right dimensions.
      await prepare(format);

      // 2. Wait for fonts (Devanagari/Tamil/etc.) and a couple of frames so
      //    layout has settled. document.fonts.ready is the documented readiness
      //    event — not a setTimeout substitute.
      if (typeof document !== 'undefined' && document.fonts && document.fonts.ready) {
        await document.fonts.ready;
      }
      await new Promise<void>((r) => requestAnimationFrame(() => r()));
      await new Promise<void>((r) => requestAnimationFrame(() => r()));

      // 3. Stale check — user may have switched month/format mid-render.
      if (!isFresh()) {
        setStatus({ kind: 'idle' });
        return;
      }

      const node = getNode();
      if (!node) throw new Error('export node not mounted');

      // 4. Snapshot.
      const { toCanvas } = await import('html-to-image');
      const pixelRatio = pickPixelRatio(format);
      let canvas = await toCanvas(node, {
        pixelRatio,
        cacheBust: true,
        backgroundColor: '#0a0e27',
      });

      // 4a. Blank-canvas retry (iOS Safari quirk).
      if (canvas.toDataURL('image/png').length < 1000) {
        await new Promise<void>((r) => requestAnimationFrame(() => r()));
        canvas = await toCanvas(node, {
          pixelRatio,
          cacheBust: true,
          backgroundColor: '#0a0e27',
        });
      }

      const filename = buildExportFilename({
        masaName: filenameInputs.masaName,
        year: filenameInputs.year,
        month: filenameInputs.month,
        ext: EXT_FOR[format],
      });

      // 5. Encode + download / share.
      if (format === 'pdf') {
        const { default: JsPdfCtor } = await import('jspdf');
        const pdf = new JsPdfCtor({ orientation: 'landscape', unit: 'mm', format: 'a4' });
        pdf.setProperties({
          title: filename.replace(/\.[^.]+$/, ''),
          author: 'Dekho Panchang',
          subject: 'Vedic monthly calendar',
          creator: 'dekhopanchang.com',
        });
        // A4 landscape = 297 × 210 mm. The captured PNG fills the page.
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 297, 210);
        pdf.save(filename);
      } else {
        const mime = format === 'jpeg' ? 'image/jpeg' : 'image/png';
        const quality = format === 'jpeg' ? 0.95 : undefined;
        await new Promise<void>((resolve, reject) => {
          canvas.toBlob(async (blob) => {
            if (!blob) {
              reject(new Error('canvas.toBlob returned null'));
              return;
            }
            try {
              const canShare =
                typeof navigator !== 'undefined' &&
                typeof navigator.share === 'function' &&
                typeof navigator.canShare === 'function';
              if (canShare) {
                const file = new File([blob], filename, { type: mime });
                if (navigator.canShare!({ files: [file] })) {
                  await navigator.share({ title: filename, files: [file] });
                  resolve();
                  return;
                }
              }
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = filename;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
              resolve();
            } catch (err) {
              // User cancelling the share sheet is not a failure.
              if ((err as Error).name === 'AbortError') {
                resolve();
              } else {
                reject(err);
              }
            }
          }, mime, quality);
        });
      }

      setStatus({ kind: 'success', filename });
    } catch (err) {
      console.error('[calendar-export] failed:', err);
      setStatus({ kind: 'error', message: labels.errorGeneric });
    } finally {
      inFlight.current = false;
    }
  }, [getNode, prepare, isFresh, filenameInputs, labels]);

  const reset = useCallback(() => setStatus({ kind: 'idle' }), []);

  return { run, reset, status };
}
