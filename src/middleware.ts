import createMiddleware from 'next-intl/middleware';
import { routing } from '@/lib/i18n/navigation';

export default createMiddleware(routing);

export const config = {
  matcher: [
    '/',
    '/(en|hi|sa|ta)/:path*',
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
};
