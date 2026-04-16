/**
 * XSS-safe JSON-LD serialization.
 *
 * `JSON.stringify(x)` on its own is not safe to embed inside a `<script>` tag
 * because if any value ever contains the substring `</script>`, the HTML
 * parser will close the script tag early and treat the remaining JSON as
 * markup — trivially exploitable if user-controlled content reaches a
 * JSON-LD payload.
 *
 * Two additional sequences also need escaping:
 *   - `<!--` (HTML comment opener) can smuggle tags past the parser
 *   - U+2028 / U+2029 (line/paragraph separators) are valid JS but terminate
 *     string literals, which can corrupt parsing in older browsers
 *
 * This helper applies the minimal escapes that keep the output syntactically
 * valid JSON (all escapes use `\uXXXX` form, which JSON.parse accepts
 * unchanged) while preventing every known HTML-smuggling vector.
 */
export function safeJsonLd(value: unknown): string {
  return JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}
