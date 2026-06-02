/**
 * CSS-string builder for /embed/* widgets. Produces the entire stylesheet
 * inline (no external CSS file load, no Tailwind, no global app CSS) so the
 * embedded iframe stays tiny and loads fast on slow temple-site connections.
 *
 * Tokenised by theme + size so the same layout works at narrow / default
 * / wide widths and on light / dark backgrounds. The `auto` theme emits
 * both light + dark with a `prefers-color-scheme: dark` media query so
 * the embed honours the parent page's color scheme.
 */

import {
  type EmbedTheme,
  type EmbedSize,
  type ThemeTokens,
  resolveTokens,
  resolveSize,
  LIGHT,
  DARK,
} from './embed-theme';

interface BuildArgs {
  theme: EmbedTheme;
  size: EmbedSize;
}

function tokenRules(tokens: ThemeTokens): string {
  return `
    body { background: ${tokens.background}; color: ${tokens.text}; }
    .widget-header { background: ${tokens.surfaceMuted}; border-bottom-color: ${tokens.accentSoft}; }
    .widget-location { color: ${tokens.accent}; }
    .widget-date { color: ${tokens.text}; }
    .festival-badge { background: ${tokens.badge}; color: ${tokens.badgeText}; }
    .widget-festivals { border-bottom-color: ${tokens.border}; }
    .grid-row { border-bottom-color: ${tokens.border}; }
    .grid-label { color: ${tokens.textMuted}; }
    .grid-value { color: ${tokens.text}; }
    .grid-time { color: ${tokens.textMuted}; }
    .widget-sun { background: ${tokens.surface}; border-color: ${tokens.border}; }
    .sun-label { color: ${tokens.textMuted}; }
    .sun-time { color: ${tokens.text}; }
    .widget-footer { color: ${tokens.textMuted}; }
    .widget-footer a { color: ${tokens.accent}; }
    .widget-footer strong { color: ${tokens.accentSoft}; }
    .widget-error { color: ${tokens.accent}; }
  `.trim();
}

export function buildWidgetCss({ theme, size }: BuildArgs): string {
  const s = resolveSize(size);

  // Base layout — theme-agnostic structural rules.
  const base = `
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
      font-size: ${s.fontBase}px;
    }
    .widget { max-width: ${s.maxWidth}px; min-width: ${s.minWidth}px; margin: 0 auto; }
    .widget-header { padding: ${s.padding}px; border-bottom: 2px solid; }
    .widget-location { font-size: 0.78em; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 700; }
    .widget-date { font-size: 1.07em; font-weight: 600; margin-top: 4px; }
    .widget-festivals { padding: 10px ${s.padding}px; display: flex; flex-wrap: wrap; gap: 6px; border-bottom: 1px solid; }
    .festival-badge { display: inline-block; font-size: 0.78em; font-weight: 700; padding: 3px 10px; border-radius: 12px; letter-spacing: 0.3px; }
    .widget-grid { padding: 12px ${s.padding}px; }
    .grid-row { display: flex; justify-content: space-between; align-items: baseline; padding: 7px 0; border-bottom: 1px solid; }
    .grid-row:last-child { border-bottom: none; }
    .grid-label { font-size: 0.85em; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; }
    .grid-value { font-size: 1em; font-weight: 600; text-align: right; }
    .grid-time { display: block; font-size: 0.72em; font-weight: 400; margin-top: 1px; }
    .widget-sun { display: flex; justify-content: space-around; padding: 12px ${s.padding}px; border-top: 1px solid; border-bottom: 1px solid; }
    .sun-item { display: flex; flex-direction: column; align-items: center; gap: 2px; }
    .sun-icon { font-size: 1.4em; }
    .sun-label { font-size: 0.72em; text-transform: uppercase; letter-spacing: 0.5px; }
    .sun-time { font-size: 1.07em; font-weight: 700; }
    .widget-footer { padding: 10px ${s.padding}px; text-align: center; font-size: 0.72em; }
    .widget-footer a { text-decoration: none; }
    .widget-footer a:hover { text-decoration: underline; }
    .widget-error { padding: ${s.padding}px; font-size: 0.93em; line-height: 1.5; }
    /* /embed/festivals row layout */
    .fest-row { display: flex; align-items: baseline; gap: 8px; padding: 6px 0; border-bottom: 1px solid; }
    .fest-row:last-child { border-bottom: none; }
    .fest-date { font-size: 0.78em; font-weight: 700; letter-spacing: 0.5px; min-width: 56px; flex-shrink: 0; text-transform: uppercase; }
    .fest-name { font-size: 0.93em; font-weight: 600; flex: 1; }
    .fest-empty { padding: ${s.padding}px; text-align: center; font-size: 0.86em; }
  `.trim();

  if (theme === 'auto') {
    // Emit light by default + override the same rules under dark media query.
    return `${base}\n${tokenRules(LIGHT)}\n@media (prefers-color-scheme: dark) {\n${tokenRules(DARK)}\n}`;
  }

  return `${base}\n${tokenRules(resolveTokens(theme))}`;
}
