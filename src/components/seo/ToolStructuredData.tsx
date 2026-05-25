import { generateToolLD, generateBreadcrumbLD } from '@/lib/seo/structured-data';
import { safeJsonLd } from '@/lib/seo/safe-jsonld';

/**
 * Bundle of ToolLD + BreadcrumbLD JSON-LD blocks. Shared by every
 * individual tool-page layout so the eligibility surface (Tool / Breadcrumb
 * rich results) is consistent. Audit 2026-05-25 §C1.
 */
interface ToolStructuredDataProps {
  /** Display name for the WebApplication LD, e.g. "Choghadiya Calculator". */
  name: string;
  /** Short description (≤ 160 chars) — shown in the Tool LD payload. */
  description: string;
  /** Route path WITHOUT locale prefix, e.g. "/choghadiya". */
  path: string;
  /** Active locale — drives the BreadcrumbList locale-prefixed URL. */
  locale: string;
}

export function ToolStructuredData({ name, description, path, locale }: ToolStructuredDataProps) {
  const toolLD = generateToolLD(name, description, path);
  const breadcrumbLD = generateBreadcrumbLD(`/${locale}${path}`, locale);
  return (
    <>
      {toolLD ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(toolLD) }} />
      ) : null}
      {breadcrumbLD ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbLD) }} />
      ) : null}
    </>
  );
}
