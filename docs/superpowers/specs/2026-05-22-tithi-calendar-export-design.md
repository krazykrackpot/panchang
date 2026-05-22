# Tithi Calendar Export — PDF / JPEG / PNG

**Date:** 2026-05-22
**Status:** Approved for implementation
**Page affected:** `/[locale]/calendars/tithi`

---

## Problem

The monthly tithi calendar at `dekhopanchang.com/en/calendars/tithi` is visually rich — gradient cell backgrounds, custom SVG moon phases with glow filters, gold-on-navy aesthetic, festival icons, multilingual scripts (10 locales). Browser **Print → Save as PDF** strips all of this: backgrounds gone, glow filters flattened, A4 layout broken. Users have asked for a one-click in-app export that preserves the aesthetic so the month can be used as a real wall-calendar page or shared digitally.

## Goal

Add three download formats reachable from the tithi calendar page, each optimised for its end use:

| Format | Dimensions          | Use case                              |
|--------|---------------------|---------------------------------------|
| PDF    | A4 landscape        | Print on paper, pin on wall           |
| JPEG   | 1080 × 1350         | Share on WhatsApp / social / mobile   |
| PNG    | 3508 × 2480 @ 300dpi| Hi-res archive, edit in image tools   |

All three are generated **client-side** from a hidden purpose-built layout — zero Vercel function cost, instant download, works offline.

## Non-goals (v1)

- US Letter / A3 paper sizes
- Annual 12-page export
- Custom logo upload / user branding
- Reordering or hiding the festival rail
- Server-side rendering (rejected — see Alternatives)

---

## UX

### Trigger

A ghost pill button on its own row below the masa-convention toggle, centred desktop / full-width mobile:

```
↓ Save this month  ▾
```

Click opens a dropdown:

```
┌─────────────────────────────────────────┐
│  PDF · wall calendar  (A4 landscape)    │
│  JPEG · share card    (1080×1350)       │
│  PNG · hi-res         (3508×2480)       │
└─────────────────────────────────────────┘
```

While a render is in flight: all three options disabled, button label becomes "Building PDF…" (or JPEG/PNG), spinner replaces icon. On completion: toast confirms `Saved tithi-calendar-vaisakha-2026.pdf`. On error: toast surfaces the failure (per CLAUDE.md rule 1).

Mobile JPEG / PNG choices use `navigator.share({ files })` when available; otherwise download. PDF always downloads (iOS share-sheet support for PDF blobs is unreliable).

### Export layout

Fixed-size React node, mounted off-screen via portal, identical regardless of viewport:

```
┌─────────────────────────────────────────────────────────────────┐
│  ☉ DEKHO PANCHANG                            dekhopanchang.com  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  MAY 2026                              📍 Corseaux, Switzerland  │
│  Vaisakha · Vasanta Ritu · Lahiri Ayanamsha                      │
│                                                                  │
│  ┌──────────────────────────────────────┐  ┌──────────────────┐  │
│  │   <TithiMonthGrid ... />             │  │ THIS MONTH       │  │
│  │   (full 7-col grid, untouched)       │  │                  │  │
│  │                                      │  │ 3  Akshaya Trit. │  │
│  │   • Moon phase SVGs preserved        │  │ 10 Mohini Ekad.  │  │
│  │   • Gradients preserved              │  │ 12 Buddha Purnima│  │
│  │   • Festival icons preserved         │  │ …                │  │
│  │   • Devanagari / regional preserved  │  │ (auto 2-col if   │  │
│  │                                      │  │  count > 8)      │  │
│  │                                      │  │                  │  │
│  └──────────────────────────────────────┘  └──────────────────┘  │
│                                                                  │
│  ● Purnima  ◯ Amavasya  ▢ Ekadashi  ▢ Festival  ▢ Vrat           │
├─────────────────────────────────────────────────────────────────┤
│  Generated 2026-05-22 · Corseaux, Switzerland · Lahiri Ayanamsha │
└─────────────────────────────────────────────────────────────────┘
```

Key facts about the layout:
- Reuses **`<TithiMonthGrid>` directly** so cell rendering can't drift (CLAUDE.md rule B / ZA — single source of truth).
- Always passes `natal={kind:'none'}` — personalisation makes no sense on a wall calendar.
- Sets `isToday: false` on every day — wall calendars don't show "today."
- Festival list: auto 2-column when > 8 festivals; truncates to "+N more — dekhopanchang.com/calendar" when > 16.
- Localised: month name via `Intl.DateTimeFormat(locale)`; section labels via new `tithi.export.*` i18n keys in all 10 locales. Brand mark stays Latin.

---

## Architecture

### New files

```
src/components/calendar/
  TithiCalendarExport.tsx     # fixed-size print layout; props: year, month, days, meta, location, masaConvention, locale
  ExportCalendarButton.tsx    # the trigger + dropdown + spinner + download/share wiring; sits below masa toggle on tithi page
src/lib/calendar/
  export-filename.ts          # masa-aware filename slug (tithi-calendar-{masaSlug}-{year}.{ext})
  use-calendar-export.ts      # the orchestration hook (mounts portal → snapshot → encode → download/share)
src/lib/__tests__/
  calendar-export.test.ts     # filename rules; format→encoder mapping; festival overflow split (8/16 thresholds)
```

### Modified files

```
src/app/[locale]/calendars/tithi/page.tsx
  - import ExportCalendarButton
  - render below the masa-convention toggle row
  - pass year, month, tithiData, meta, location, masaConvention, locale, festivals

src/messages/{en,hi,sa,ta,te,bn,kn,mr,gu,mai}/pages.json
  - add tithi.export.* keys: trigger, formats (pdf/jpeg/png labels + descriptions),
    rendering states, success/error toasts, layout labels (thisMonth, legend, footer)
```

### Render pipeline (in `use-calendar-export.ts`)

```ts
async function exportCalendar(format: 'pdf' | 'jpeg' | 'png') {
  if (inFlight.current) return;
  inFlight.current = true;
  const requestedMonth = `${year}-${month}`; // stale-check key

  try {
    setStatus({ kind: 'rendering', format });

    // 1. Mount export node off-screen
    const node = await mountExportPortal(props);

    // 2. Wait for fonts (Devanagari, etc.) and layout to settle
    await document.fonts.ready;
    await new Promise(r => requestAnimationFrame(r));

    // 3. Stale check — user may have switched month
    if (requestedMonth !== `${year}-${month}`) {
      unmountExportPortal(node);
      return;
    }

    // 4. Snapshot — html-to-image at appropriate pixel ratio
    const isIOS = /iP(hone|ad|od)/.test(navigator.userAgent);
    const pixelRatio = isIOS ? 2 : 2.5;
    const canvas = await htmlToImage.toCanvas(node, {
      pixelRatio,
      cacheBust: true,
      backgroundColor: '#0a0e27',
    });

    // 4a. Blank-canvas retry (iOS Safari quirk)
    if (canvas.toDataURL('image/png').length < 1000) {
      await new Promise(r => requestAnimationFrame(r));
      canvas = await htmlToImage.toCanvas(node, { pixelRatio, cacheBust: true });
    }

    // 5. Encode
    const filename = buildExportFilename({ masaConvention, masaName, year, month, ext: format });
    if (format === 'png') {
      await downloadOrShare(canvas, 'image/png', filename);
    } else if (format === 'jpeg') {
      await downloadOrShare(canvas, 'image/jpeg', filename, 0.95);
    } else {
      // PDF: jsPDF v4, A4 landscape, embed PNG (sidesteps Latin-1 font quirk)
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
      pdf.setProperties({
        title: `Tithi Calendar ${monthName} ${year}`,
        author: 'Dekho Panchang',
        subject: 'Vedic monthly calendar',
        creator: 'dekhopanchang.com',
      });
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 297, 210);
      pdf.save(filename);
    }

    // 6. Cleanup
    unmountExportPortal(node);
    setStatus({ kind: 'success', filename });
  } catch (err) {
    console.error('[calendar-export] failed:', err);
    setStatus({ kind: 'error', message: localisedError(err) });
  } finally {
    inFlight.current = false;
  }
}
```

### Dependency strategy

Both deps are already in `package.json`:
- `html-to-image: ^1.11.13`
- `jspdf: ^4.2.1`

Loaded via dynamic import in `use-calendar-export.ts` so the tithi calendar page doesn't pay for the bytes until the user clicks Save.

---

## Error handling

| Failure mode                          | Handling                                                          |
|---------------------------------------|-------------------------------------------------------------------|
| html-to-image returns blank canvas    | One auto-retry after `requestAnimationFrame`                      |
| Snapshot throws                       | `console.error` with `[calendar-export]` tag + error toast        |
| User changes month mid-render         | Stale-month check before save; silently abort                     |
| User clicks again mid-render          | `inFlight` ref blocks; all three options disabled in UI           |
| Font not loaded (Devanagari)          | `document.fonts.ready` await before snapshot                      |
| Cross-origin image                    | All export-layout images use inline SVG or same-origin assets     |
| `loading` stuck                       | `finally { inFlight.current = false }` always runs (CLAUDE.md F)  |

---

## Internationalisation

New keys to add to `src/messages/{locale}/pages.json` for each of the 10 locales:

```json
{
  "tithi": {
    "export": {
      "trigger": "Save this month",
      "formats": {
        "pdfLabel": "PDF · wall calendar",
        "pdfDescription": "A4 landscape",
        "jpegLabel": "JPEG · share card",
        "jpegDescription": "1080×1350",
        "pngLabel": "PNG · hi-res",
        "pngDescription": "3508×2480"
      },
      "rendering": "Building {format}…",
      "savedToast": "Saved {filename}",
      "errorToast": "Couldn't save the calendar — please retry",
      "layout": {
        "thisMonth": "This Month",
        "legendPurnima": "Purnima",
        "legendAmavasya": "Amavasya",
        "legendEkadashi": "Ekadashi",
        "legendFestival": "Festival",
        "legendVrat": "Vrat",
        "footer": "Generated {date} · {location} · {ayanamsha}"
      }
    }
  }
}
```

Brand mark "DEKHO PANCHANG" stays Latin in all locales.

---

## Testing

### Unit tests (`src/lib/__tests__/calendar-export.test.ts`)
- `buildExportFilename` — slug per masa (Vaisakha → `vaisakha`, Adhika Ashadha → `adhika-ashadha`); year + ext appended.
- Format → encoder mapping — PDF / JPEG / PNG dispatch to correct branch.
- Festival overflow split — 8 entries: 1-col; 12 entries: 2-col; 18 entries: 16 shown + "+2 more".

### Browser verification (CLAUDE.md DoD #4) — non-negotiable
- Click each format button → file downloads → open the file → visually compare to on-screen.
- Repeat in **EN, HI, TA** locales (covers Latin, Devanagari, Tamil-script).
- Print the PDF on actual paper or "Save as PDF" preview at A4 — CLAUDE.md rule 6 ("test at the real boundary").
- Test on mobile (iOS Safari) — native share sheet appears for JPEG/PNG; PDF downloads.
- Test stale-month abort — click PDF, then immediately change month; verify no leftover file.
- Test concurrent-click block — click PDF then click JPEG mid-render; verify second click is no-op.

### Spot-check
- Festival rail in the export matches festivals shown on the grid for the same month (single source of truth from page `festivals` state — no second fetcher).

### No astronomy verification needed
This feature does not touch the computation pipeline. Skipped CLAUDE.md DoD #5.

---

## Alternatives considered

### Server-side via Puppeteer / Playwright
Rejected. Adds ~150MB function bundle, 3-5s render latency, ongoing Vercel function-time cost. Cuts against the in-progress Hetzner migration plan.

### Server-side via `next/og` (Satori)
Rejected. Satori doesn't support SVG `<filter>` elements (used for Purnima glow), has limited gradient and `backdrop-filter` support. The calendar's aesthetic would be flattened — same problem as browser print, just on the server.

### `@media print` CSS only
Rejected as primary path. User already tried browser print and reported aesthetics loss. Browser print also can't deliver JPEG / PNG. May still be added later as a graceful fallback for the "print directly from page" workflow.

### Custom SVG → PDF via jsPDF text/vector calls
Rejected. Would require rebuilding the grid entirely in jsPDF primitives — duplicate of `TithiMonthGrid`, guaranteed to drift (CLAUDE.md rules B, ZA). jsPDF's Latin-1 font limitation (CLAUDE.md global rule 3) would also need workarounds for Devanagari, Tamil, Bengali.

---

## Definition of Done

1. `npx tsc --noEmit -p tsconfig.build-check.json` passes.
2. `npx vitest run` passes; new calendar-export tests added and green.
3. `npx next build` succeeds with zero errors.
4. Browser-verified in EN, HI, TA on desktop **and** iOS Safari. All three formats download cleanly. PDF prints at A4 with aesthetics intact.
5. Static page budget unchanged — no new routes added.
6. Service worker cache not affected — dynamic-imported chunks aren't precached.

---

## Open questions

None. All decisions baked in. The implementation plan will sequence: filename util + tests → export layout → orchestration hook → trigger button → page integration → i18n key propagation → browser verification.
