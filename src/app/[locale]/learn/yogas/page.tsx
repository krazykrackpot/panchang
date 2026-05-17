import { setRequestLocale } from 'next-intl/server';
import { redirect } from 'next/navigation';

/** Redirect old /learn/yogas → /learn/yoga (merged page) */
export default async function LearnYogasRedirect({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  redirect(`/${locale}/learn/yoga`);
}
