import type { Metadata } from 'next';
import { getDevotionalItem, TYPE_LABELS } from '@/lib/content/devotional-content';
import type { DevotionalType } from '@/lib/content/devotional-content';

interface Props {
  params: Promise<{ locale: string; type: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, type, slug } = await params;
  const item = getDevotionalItem(type as DevotionalType, slug);

  if (!item) {
    return { title: 'Not Found — Dekho Panchang' };
  }

  const typeLabel = TYPE_LABELS[type as DevotionalType];
  const titleEn = `${item.title.en} — Full Text in Hindi with Meaning | Dekho Panchang`;
  const titleHi = `${item.title.hi} — हिंदी पाठ अर्थ सहित | देखो पंचांग`;
  const title = locale === 'hi' ? titleHi : titleEn;

  const descEn = `Read ${item.title.en} (${typeLabel?.en ?? type}) — complete Devanagari text, English transliteration, meaning, and significance. Dedicated to ${item.deity}.`;
  const descHi = `${item.title.hi} (${typeLabel?.hi ?? type}) — पूर्ण देवनागरी पाठ, अंग्रेजी लिप्यन्तरण, अर्थ और महत्व। ${item.deity} को समर्पित।`;
  const description = locale === 'hi' ? descHi : descEn;

  return {
    title,
    description,
    keywords: [
      item.title.en.toLowerCase(),
      item.title.hi,
      `${type} lyrics`,
      `${item.deity} ${type}`,
      `${item.title.en} in hindi`,
      `${item.title.en} meaning`,
      `${item.title.en} lyrics`,
      'hindu devotional',
      'vedic prayer',
    ],
    openGraph: {
      title,
      description,
      type: 'article',
    },
    alternates: {
      canonical: `https://dekhopanchang.com/en/devotional/${type}/${slug}`,
      languages: {
        en: `https://dekhopanchang.com/en/devotional/${type}/${slug}`,
        hi: `https://dekhopanchang.com/hi/devotional/${type}/${slug}`,
      },
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
