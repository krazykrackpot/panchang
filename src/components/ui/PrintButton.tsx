'use client';
import { useCallback } from 'react';
import { Printer } from 'lucide-react';

interface PrintButtonProps {
  contentRef?: React.RefObject<HTMLElement | null>;
  contentHtml?: string;
  title?: string;
  label?: string;
  className?: string;
}

/**
 * Strips dark-theme Tailwind classes from HTML and applies inline light-theme equivalents.
 * Keeps table structure, grid layouts, and SVGs intact.
 */
function cleanHtmlForPrint(html: string): string {
  let cleaned = html;

  // Remove animation / transition / hover classes
  cleaned = cleaned.replace(/\bclass="([^"]*)"/g, (_match, classes: string) => {
    const filtered = classes
      .split(/\s+/)
      .filter((cls: string) => {
        // Remove animate-*, transition-*, hover:*, opacity-[0.x], group-hover:*, focus:*
        if (/^(animate-|transition-|hover:|group-hover:|focus:|opacity-\[0\.)/.test(cls)) return false;
        return true;
      })
      .join(' ');
    return `class="${filtered}"`;
  });

  // Replace dark background classes with light equivalents via inline styles
  // bg-bg-primary, bg-bg-secondary → white
  cleaned = cleaned.replace(/\bbg-bg-primary\b/g, '');
  cleaned = cleaned.replace(/\bbg-bg-secondary\b/g, '');

  // Replace text-gold-gradient with a visible class (handled by print CSS)
  // No structural changes needed — the print CSS handles color overrides

  return cleaned;
}

const PRINT_CSS = `
  /* Google Fonts — Inter for Latin, Noto Sans Devanagari for Hindi/Sanskrit */
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Inter:wght@400;500;600;700&family=Noto+Sans+Devanagari:wght@400;600;700&family=Tiro+Devanagari+Sanskrit&display=swap');

  /* ── Reset ── */
  * { margin: 0; padding: 0; box-sizing: border-box; }

  /* ── Base body — light theme ── */
  body {
    font-family: 'Inter', 'Noto Sans Devanagari', sans-serif;
    color: #1a1a1a;
    background: #fff;
    padding: 40px;
    font-size: 12px;
    line-height: 1.6;
  }

  /* ── Headings ── */
  h1, h2, h3 {
    font-family: 'Cinzel', 'Tiro Devanagari Sanskrit', serif;
    color: #8B6914;
    margin-bottom: 8px;
  }
  h1 { font-size: 24px; }
  h2 { font-size: 18px; margin-top: 16px; }
  h3 { font-size: 14px; }

  /* ── Tables ── */
  table { width: 100%; border-collapse: collapse; margin: 12px 0; }
  th, td { border: 1px solid #ddd; padding: 6px 10px; text-align: left; font-size: 11px; }
  th { background: #f5f0e0; font-weight: 600; color: #8B6914; }

  /* ── Utility classes ── */
  .gold { color: #8B6914; }
  .section { margin-bottom: 16px; padding: 12px; border: 1px solid #e5e5e5; border-radius: 4px; }
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  .badge { display: inline-block; padding: 2px 8px; border-radius: 12px; font-size: 10px; background: #f5f0e0; color: #8B6914; }
  .footer { text-align: center; margin-top: 24px; padding-top: 12px; border-top: 1px solid #ddd; font-size: 10px; color: #999; }
  .devanagari { font-family: 'Tiro Devanagari Sanskrit', 'Noto Sans Devanagari', serif; }

  /* ══════════════════════════════════════════════════════════
     Dark → Light theme conversion for Tailwind dark-theme HTML
     ══════════════════════════════════════════════════════════ */

  /* Gold text → dark brown on print */
  .text-gold-gradient, .text-gold-light, .text-gold-primary { color: #8B6914 !important; }
  [class*="text-gold"] { color: #8B6914 !important; }

  /* Dark backgrounds → white or very light cream */
  [class*="bg-bg-"], [class*="bg-gradient"], [class*="from-\\[#"] { background: #fff !important; }
  [class*="bg-\\[#0a0e27\\]"], [class*="bg-\\[#1a1040\\]"], [class*="bg-\\[#2d1b69\\]"] { background: #faf8f0 !important; }
  [class*="bg-bg-primary"], [class*="bg-bg-secondary"] { background: #fff !important; }

  /* Purple gradient cards → light cream with thin border */
  [class*="from-\\[#2d1b69\\]"] {
    background: #faf8f0 !important;
    border: 1px solid #e5dcc8 !important;
  }

  /* Borders: dark gold → warm brown */
  [class*="border-gold"] { border-color: #d4a853 !important; }
  [class*="border-white"] { border-color: #ddd !important; }

  /* Text colors for dark theme classes */
  .text-text-primary, [class*="text-text-primary"] { color: #1a1a1a !important; }
  .text-text-secondary, [class*="text-text-secondary"] { color: #555 !important; }
  [class*="text-text-"] { color: #555 !important; }
  [class*="text-white"] { color: #1a1a1a !important; }
  [class*="text-gray"] { color: #555 !important; }

  /* Colored text: keep but darken for readability on white */
  [class*="text-emerald"] { color: #047857 !important; }
  [class*="text-green"] { color: #047857 !important; }
  [class*="text-amber"] { color: #92400e !important; }
  [class*="text-yellow"] { color: #92400e !important; }
  [class*="text-red"] { color: #b91c1c !important; }
  [class*="text-blue"] { color: #1e40af !important; }
  [class*="text-indigo"] { color: #1e40af !important; }
  [class*="text-purple"] { color: #6b21a8 !important; }
  [class*="text-orange"] { color: #9a3412 !important; }
  [class*="text-cyan"] { color: #0e7490 !important; }
  [class*="text-teal"] { color: #0f766e !important; }

  /* Background color classes → transparent or very light */
  [class*="bg-emerald"] { background: #ecfdf5 !important; }
  [class*="bg-green"] { background: #ecfdf5 !important; }
  [class*="bg-amber"] { background: #fffbeb !important; }
  [class*="bg-yellow"] { background: #fffbeb !important; }
  [class*="bg-red"] { background: #fef2f2 !important; }
  [class*="bg-blue"] { background: #eff6ff !important; }
  [class*="bg-indigo"] { background: #eef2ff !important; }
  [class*="bg-purple"] { background: #faf5ff !important; }

  /* SVG charts: preserve dark background for readability */
  /* print-color-adjust: exact ensures SVG fills/strokes render faithfully */
  svg { print-color-adjust: exact; -webkit-print-color-adjust: exact; }

  /* Hide non-printable elements */
  button, .ad-container, nav, footer, [aria-hidden="true"] { display: none !important; }

  /* Clean up rounded corners for print */
  .rounded-xl, .rounded-2xl, .rounded-lg, .rounded-3xl { border-radius: 4px !important; }

  /* Remove shadows — they render as gray blobs on print */
  [class*="shadow"] { box-shadow: none !important; }

  /* Remove backdrop blur */
  [class*="backdrop-blur"] { backdrop-filter: none !important; }

  /* ── @page rules ── */
  @media print {
    body { padding: 20px; }
    @page { margin: 15mm; size: A4; }
    .section, table, tr { break-inside: avoid; }
    h2, h3 { break-after: avoid; }
  }
`;

export default function PrintButton({ contentRef, contentHtml, title = 'Dekho Panchang', label = 'Print / PDF', className }: PrintButtonProps) {
  const handlePrint = useCallback(() => {
    const rawHtml = contentHtml || contentRef?.current?.innerHTML || '';
    if (!rawHtml) return;

    const cleanedHtml = cleanHtmlForPrint(rawHtml);
    const generatedDate = new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      // Guard: popup blocker may prevent window.open — jsPDF/print quirk (Lesson E)
      console.error('[PrintButton] Failed to open print window — popup may be blocked');
      return;
    }

    printWindow.document.write(`<!DOCTYPE html>
<html>
<head>
  <title>${title}</title>
  <meta charset="utf-8" />
  <style>${PRINT_CSS}</style>
</head>
<body>
  <div style="text-align:center; border-bottom: 2px solid #d4a853; padding-bottom: 12px; margin-bottom: 20px;">
    <h1 style="font-family: 'Cinzel', serif; color: #8B6914; font-size: 22px; margin: 0;">
      Dekho Panchang &mdash; ${title}
    </h1>
    <p style="color: #888; font-size: 10px; margin-top: 4px;">
      Generated on ${generatedDate} &bull; dekhopanchang.com
    </p>
  </div>
  ${cleanedHtml}
  <div class="footer">Generated by Dekho Panchang &mdash; dekhopanchang.com</div>
</body>
</html>`);
    printWindow.document.close();

    // Wait for fonts to load before printing (Lesson E: never use setTimeout as readiness signal)
    // document.fonts.ready resolves when all @import fonts finish loading in the print window
    if (printWindow.document.fonts) {
      printWindow.document.fonts.ready
        .then(() => {
          printWindow.print();
        })
        .catch((err: unknown) => {
          console.error('[PrintButton] Font loading failed, printing anyway:', err);
          printWindow.print();
        });
    } else {
      // Fallback for browsers that don't support document.fonts (very old browsers)
      // This is the only acceptable setTimeout — guarded by a capability check and documented (Lesson E)
      printWindow.print();
    }
  }, [contentRef, contentHtml, title]);

  return (
    <button
      onClick={handlePrint}
      className={className || 'inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gold-primary/20 text-text-secondary text-sm hover:text-gold-light hover:bg-gold-primary/5 transition-colors'}
    >
      <Printer className="w-4 h-4" />
      {label}
    </button>
  );
}
