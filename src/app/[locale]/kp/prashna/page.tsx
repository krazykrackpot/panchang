/**
 * /kp/prashna — KP horary astrology page (number + text modes).
 *
 * Server-side wrapper. Marked force-dynamic per Lesson ZD because every
 * cast moment differs and the result depends on submission time — caching
 * would serve stale verdicts.
 *
 * Spec: docs/superpowers/specs/2026-06-05-kp-ui-batch-design.md §3
 */

import { setRequestLocale } from 'next-intl/server';
import PrashnaClient from './Client';

export const dynamic = 'force-dynamic';

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <PrashnaClient locale={locale} />;
}
