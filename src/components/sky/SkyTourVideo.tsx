'use client';

/**
 * Click-to-play YouTube embed for the Live Sky Map tour video.
 *
 * Locale routing:
 *   - hi → Hindi voice-over (cHTrDxqGKz0)
 *   - all other locales → English voice-over (9Iqii8WzeqQ)
 *
 * Performance: renders only a YouTube thumbnail + play button until the
 * user clicks. The 500KB+ YouTube iframe only loads on intent — no LCP /
 * INP cost for the 99% of visitors who don't watch. Mirrors the same
 * pattern used in PanchangClient.tsx for daily-forecast videos so the
 * site has one consistent video-tile UI.
 */

import { useState } from 'react';
import Image from 'next/image';
import { tl } from '@/lib/utils/trilingual';

const VIDEOS: Record<string, { id: string; title: string }> = {
  hi: {
    id: 'cHTrDxqGKz0',
    title: 'ग्रहों की सटीक स्थिति, अभी, लाइव | Live Sky Map | देखो पंचांग',
  },
  en: {
    // 2026-06-12: replaced the 90s cut (9Iqii8WzeqQ — deleted) with a 105s
    // cut so the VO sits at natural English-narrator pace instead of the
    // 1.17× compression the 90s container forced. YouTube doesn't allow
    // editing video content on an existing video ID, so the URL changed.
    id: 'zCx9v44PplM',
    title: 'Where Are The Planets Right Now? Live Sky Map | Dekho Panchang',
  },
};

const LABELS = {
  sectionTitle: {
    en: 'Watch the Tour',
    hi: 'टूर देखिए',
    ta: 'சுற்றுப்பயணத்தைப் பாருங்கள்',
    te: 'టూర్ చూడండి',
    bn: 'ট্যুর দেখুন',
    gu: 'ટૂર જુઓ',
    kn: 'ಪ್ರವಾಸವನ್ನು ನೋಡಿ',
    mr: 'दौरा पाहा',
    mai: 'टूर देखू',
  },
  badge: {
    en: '90 SEC TOUR',
    hi: '90 सेकंड टूर',
    ta: '90 விநாடி',
    te: '90 సెకన్ల పర్యటన',
    bn: '90 সেকেন্ড ট্যুর',
    gu: '90 સેકન્ડ ટૂર',
    kn: '90 ಸೆಕೆಂಡ್ ಪ್ರವಾಸ',
    mr: '90 सेकंद दौरा',
    mai: '90 सेकंड टूर',
  },
  description: {
    en: 'A quick walk-through of the Live Sky Map — the rings, the 3D celestial sphere, and how to read planetary positions.',
    hi: 'Live Sky Map का त्वरित परिचय — रिंग्स, 3D आकाशीय गोला, और ग्रहों की स्थिति कैसे पढ़ें।',
    ta: 'Live Sky Map இன் விரைவான அறிமுகம் — வளையங்கள், 3D கோளம் மற்றும் கிரக நிலைகள் எவ்வாறு படிக்க வேண்டும்.',
    te: 'Live Sky Map యొక్క త్వరిత పరిచయం — రింగులు, 3D గోళం, మరియు గ్రహ స్థానాలను ఎలా చదవాలి.',
    bn: 'Live Sky Map-এর দ্রুত পরিচয় — রিং, 3D গোলক, এবং গ্রহের অবস্থান কীভাবে পড়তে হয়।',
    gu: 'Live Sky Map નો ઝડપી પરિચય — રિંગ્સ, 3D ગોળ, અને ગ્રહોની સ્થિતિ કેવી રીતે વાંચવી.',
    kn: 'Live Sky Map ನ ತ್ವರಿತ ಪರಿಚಯ — ರಿಂಗ್‌ಗಳು, 3D ಗೋಳ, ಮತ್ತು ಗ್ರಹಗಳ ಸ್ಥಾನವನ್ನು ಹೇಗೆ ಓದಬೇಕು.',
    mr: 'Live Sky Map चा त्वरित परिचय — रिंग, 3D गोलक, आणि ग्रहांची स्थिती कशी वाचावी.',
    mai: 'Live Sky Map केर त्वरित परिचय — रिंग, 3D गोलक, आ ग्रहक स्थिति केना पढ़ी।',
  },
};

interface SkyTourVideoProps {
  locale: string;
}

export function SkyTourVideo({ locale }: SkyTourVideoProps) {
  const [playing, setPlaying] = useState(false);

  // Locale routing — Hindi gets the Hindi VO; everyone else gets English.
  // Multilingual audiences (ta/te/bn/gu/kn/mai/mr) default to English since
  // the visuals are universal and English is the most widely understood
  // second language across these audiences. Future iterations could ship
  // per-locale dubs.
  const video = locale === 'hi' ? VIDEOS.hi : VIDEOS.en;
  const thumbnail = `https://i.ytimg.com/vi/${video.id}/maxresdefault.jpg`;

  // tl() with a fallback ladder so missing translations land in English
  // gracefully. Same pattern as the rest of the sky page.
  const t = (key: keyof typeof LABELS) => tl(LABELS[key], locale);

  return (
    <section className="mb-8" aria-label="Sky Map tour video">
      <h2 className="text-xl font-semibold text-[#d4a853] mb-4">{t('sectionTitle')}</h2>
      <div className="rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-[#8a6d2b]/25 overflow-hidden">
        <div className="px-5 pt-4 pb-2 flex items-center justify-between">
          <div className="text-[#8a6d2b] text-xs uppercase tracking-widest font-bold">
            {t('badge')}
          </div>
          <a
            href="https://www.youtube.com/@DekhoPanchang?sub_confirmation=1"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-600 text-white text-[10px] font-semibold hover:bg-red-500 transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current" aria-hidden="true">
              <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0C.488 3.45.029 5.804 0 12c.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0C23.512 20.55 23.971 18.196 24 12c-.029-6.185-.484-8.549-4.385-8.816zM9 16V8l8 4-8 4z" />
            </svg>
            Subscribe
          </a>
        </div>
        {/* aspect-[9/16] matches the Shorts format and the 1080×1920 video.
            Vertical container keeps the visual hierarchy honest — this is a
            Shorts-format video, not a horizontal explainer. */}
        <div className="relative w-full aspect-[9/16] max-w-sm mx-auto">
          {playing ? (
            <iframe
              src={`https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0`}
              title={video.title}
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <button
              onClick={() => setPlaying(true)}
              className="absolute inset-0 w-full h-full group cursor-pointer"
              aria-label={`Play: ${video.title}`}
            >
              {/* unoptimized: i.ytimg.com URLs are already pre-sized by YouTube;
                  routing through the Next image pipeline would add transform
                  cost without shrinking bytes. */}
              <Image
                src={thumbnail}
                alt={video.title}
                width={720}
                height={1280}
                className="w-full h-full object-cover"
                unoptimized
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/20 transition-colors">
                <div className="w-20 h-20 rounded-full bg-red-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xl">
                  <svg viewBox="0 0 24 24" className="w-9 h-9 text-white fill-current ml-1" aria-hidden="true">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </button>
          )}
        </div>
        <p className="px-5 py-3 text-sm text-[#8a8478] leading-relaxed">{t('description')}</p>
      </div>
    </section>
  );
}
