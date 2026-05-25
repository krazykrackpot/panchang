import { permanentRedirect } from 'next/navigation';

// /embed-demo was the original iframe-snippet picker. Replaced by /widget
// (same content under the canonical public-marketing route). Footer comment
// already noted this; the actual redirect was never wired. 308 permanent
// so search engines update their index. Audit 2026-05-25 §A3.
export default async function EmbedDemoPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  permanentRedirect(`/${locale}/widget`);
}
