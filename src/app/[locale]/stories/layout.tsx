import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';

import { BASE_URL } from '@/lib/seo/base-url';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  return {
    title: 'Web Stories  –  Indian Contributions to Mathematics',
    description: 'Swipeable full-screen stories about India\'s greatest mathematical discoveries: Sine, Zero, Calculus, Pythagoras Theorem, and the Speed of Light.',
    alternates: {
      canonical: `${BASE_URL}/${locale}/stories`,
    },
  };
}

export default function StoriesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
