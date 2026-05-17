import type { Metadata } from 'next';
import { getPageMetadata } from '@/lib/seo/metadata';
import { todayPanchangForSEO } from '@/lib/seo/ctr-config';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const base = getPageMetadata('/transits', locale);
  const seo = todayPanchangForSEO(locale);
  if (!seo) return base;

  const { dateStr, isHi } = seo;

  const title = isHi
    ? `ग्रह गोचर आज ${dateStr} – नवग्रह की वर्तमान स्थिति`
    : `Planet Transits Today ${dateStr} – Live Navagraha Positions`;

  const desc = isHi
    ? `${dateStr} गोचर: सभी 9 ग्रहों की वर्तमान राशि, नक्षत्र, वक्री स्थिति। गोचर फल व प्रभाव। निःशुल्क, प्रतिदिन अपडेट।`
    : `${dateStr} transits: all 9 planets' current signs, nakshatras & retrograde status. Transit effects & predictions. Free, updated daily.`;

  return { ...base, title, description: desc };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
