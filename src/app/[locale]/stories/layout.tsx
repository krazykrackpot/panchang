import type { Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://dekhopanchang.com';

export const metadata: Metadata = {
  title: 'Web Stories — Indian Contributions to Mathematics',
  description: 'Swipeable full-screen stories about India\'s greatest mathematical discoveries: Sine, Zero, Calculus, Pythagoras Theorem, and the Speed of Light.',
  alternates: {
    canonical: `${BASE_URL}/en/stories`,
  },
};

export default function StoriesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
