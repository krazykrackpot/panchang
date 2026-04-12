'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useLocale } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from '@/lib/i18n/navigation';
import { getStoryBySlug, type StorySlide } from '@/lib/stories/story-data';
import { ChevronLeft, ChevronRight, X, Share2, Play, Pause } from 'lucide-react';
import type { Locale } from '@/types/panchang';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

const AUTO_ADVANCE_MS = 5000;

export default function StoryViewer() {
  const params = useParams();
  const router = useRouter();
  const locale = useLocale() as Locale;
  const slug = params.slug as string;
  const story = getStoryBySlug(slug);

  const [current, setCurrent] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [direction, setDirection] = useState(1);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const total = story?.slides.length ?? 0;

  // Auto-advance
  useEffect(() => {
    if (!autoPlay || !story) return;
    timerRef.current = setTimeout(() => {
      if (current < total - 1) {
        setDirection(1);
        setCurrent(c => c + 1);
      } else {
        setAutoPlay(false);
      }
    }, AUTO_ADVANCE_MS);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [current, autoPlay, total, story]);

  const goNext = useCallback(() => {
    if (current < total - 1) {
      setDirection(1);
      setCurrent(c => c + 1);
    }
  }, [current, total]);

  const goPrev = useCallback(() => {
    if (current > 0) {
      setDirection(-1);
      setCurrent(c => c - 1);
    }
  }, [current]);

  // Keyboard nav
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); goNext(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); goPrev(); }
      if (e.key === 'Escape') router.back();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [goNext, goPrev, router]);

  // Touch / swipe
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const dx = e.changedTouches[0].clientX - touchStartRef.current.x;
    const dy = e.changedTouches[0].clientY - touchStartRef.current.y;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
      dx < 0 ? goNext() : goPrev();
    }
    touchStartRef.current = null;
  };

  // Tap left/right thirds
  const onTap = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    if (x < rect.width / 3) goPrev();
    else if (x > rect.width * 2 / 3) goNext();
  };

  const handleShare = async () => {
    if (!story) return;
    const url = window.location.href;
    const text = story.title[isDevanagariLocale(locale) ? 'hi' : 'en'];
    if (navigator.share) {
      try { await navigator.share({ title: text, url }); } catch { /* user cancelled */ }
    } else {
      await navigator.clipboard.writeText(url);
    }
  };

  if (!story) {
    return (
      <div className="fixed inset-0 bg-bg-primary flex items-center justify-center">
        <div className="text-center">
          <p className="text-text-secondary text-lg mb-4">Story not found</p>
          <Link href="/stories" className="text-gold-primary underline">Back to stories</Link>
        </div>
      </div>
    );
  }

  const slide = story.slides[current];
  const isDevanagari = isDevanagariLocale(locale);
  const hf = isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const bf = isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : {};

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 bg-black select-none overflow-hidden"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onClick={onTap}
      style={{ touchAction: 'pan-y' }}
    >
      {/* ── Progress bar ── */}
      <div className="absolute top-0 left-0 right-0 z-50 flex gap-1 px-3 pt-3">
        {story.slides.map((_, i) => (
          <div key={i} className="flex-1 h-[3px] rounded-full bg-white/20 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: i < current ? '100%' : i === current ? '100%' : '0%',
                backgroundColor: i <= current ? '#d4a853' : 'transparent',
                ...(i === current && autoPlay ? {
                  animation: `progressFill ${AUTO_ADVANCE_MS}ms linear`,
                } : {}),
              }}
            />
          </div>
        ))}
      </div>

      {/* ── Top controls ── */}
      <div className="absolute top-6 left-0 right-0 z-50 flex items-center justify-between px-4">
        <button
          onClick={(e) => { e.stopPropagation(); router.back(); }}
          className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white/80 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); setAutoPlay(p => !p); }}
            className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white/80 hover:text-white transition-colors"
            aria-label={autoPlay ? 'Pause' : 'Play'}
          >
            {autoPlay ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          {current === total - 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); handleShare(); }}
              className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white/80 hover:text-white transition-colors"
              aria-label="Share"
            >
              <Share2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* ── Slide content ── */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={current}
          custom={direction}
          initial={{ opacity: 0, x: direction * 80 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction * -80 }}
          transition={{ duration: 0.3, ease: 'easeOut' as const }}
          className="absolute inset-0 flex flex-col items-center justify-center px-6 sm:px-10"
          style={{ background: `radial-gradient(ellipse at center, ${slide.bgColor || '#0a0e27'}dd 0%, #000000 100%)` }}
        >
          <SlideContent slide={slide} locale={locale} hf={hf} bf={bf} ctaUrl={story.ctaUrl} />
        </motion.div>
      </AnimatePresence>

      {/* ── Nav arrows (desktop) ── */}
      {current > 0 && (
        <button
          onClick={(e) => { e.stopPropagation(); goPrev(); }}
          className="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 z-50 w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm items-center justify-center text-white/60 hover:text-white transition-colors"
          aria-label="Previous"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}
      {current < total - 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); goNext(); }}
          className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 z-50 w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm items-center justify-center text-white/60 hover:text-white transition-colors"
          aria-label="Next"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* ── Slide counter ── */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 text-white/40 text-xs font-mono">
        {current + 1} / {total}
      </div>

      {/* ── Progress bar animation keyframes ── */}
      <style>{`
        @keyframes progressFill {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   Slide renderers by type
   ════════════════════════════════════════════════════════════════ */

function SlideContent({
  slide,
  locale,
  hf,
  bf,
  ctaUrl,
}: {
  slide: StorySlide;
  locale: Locale;
  hf: React.CSSProperties;
  bf: React.CSSProperties;
  ctaUrl: string;
}) {
  const l = (v: { en: string; hi: string }) => isDevanagariLocale(locale) ? v.hi : v.en;

  switch (slide.type) {
    case 'title':
      return (
        <div className="text-center max-w-lg">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.5 }}
          >
            <div className="w-16 h-16 mx-auto mb-8 rounded-full bg-gold-primary/15 border border-gold-primary/30 flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="12" stroke="#d4a853" strokeWidth="1.5" opacity={0.6} />
                <circle cx="16" cy="16" r="6" stroke="#f0d48a" strokeWidth="1" opacity={0.4} />
                <circle cx="16" cy="6" r="2" fill="#d4a853" />
                <circle cx="24" cy="20" r="1.5" fill="#f0d48a" opacity={0.7} />
              </svg>
            </div>
            <h1
              className="text-3xl sm:text-4xl md:text-5xl font-black text-gold-light leading-tight whitespace-pre-line"
              style={hf}
            >
              {l(slide.heading)}
            </h1>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-6"
          >
            <span className="text-xs uppercase tracking-[0.3em] text-gold-dark font-bold">
              Dekho Panchang
            </span>
          </motion.div>
        </div>
      );

    case 'fact':
      return (
        <div className="max-w-lg text-center">
          {slide.stat && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
              className="mb-6"
            >
              <span className="text-5xl sm:text-6xl md:text-7xl font-black text-gold-primary font-mono tracking-tight">
                {slide.stat}
              </span>
            </motion.div>
          )}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl sm:text-2xl md:text-3xl font-bold text-white leading-snug mb-4"
            style={hf}
          >
            {l(slide.heading)}
          </motion.h2>
          {slide.body && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-text-secondary text-sm sm:text-base leading-relaxed"
              style={bf}
            >
              {l(slide.body)}
            </motion.p>
          )}
        </div>
      );

    case 'comparison':
      return (
        <div className="max-w-lg text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <div className="inline-block px-4 py-1.5 rounded-full bg-gold-primary/15 border border-gold-primary/25 text-gold-primary text-xs font-bold uppercase tracking-widest mb-6">
              Comparison
            </div>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl sm:text-2xl md:text-3xl font-bold text-gold-light leading-snug mb-5"
            style={hf}
          >
            {l(slide.heading)}
          </motion.h2>
          {slide.body && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-text-secondary text-sm sm:text-base leading-relaxed"
              style={bf}
            >
              {l(slide.body)}
            </motion.p>
          )}
          {slide.stat && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-6"
            >
              <span className="text-4xl sm:text-5xl font-black text-gold-primary font-mono">{slide.stat}</span>
            </motion.div>
          )}
        </div>
      );

    case 'quote':
      return (
        <div className="max-w-lg text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <svg width="40" height="40" viewBox="0 0 40 40" className="mx-auto text-gold-primary/40">
              <text x="0" y="36" fontSize="48" fill="currentColor">&ldquo;</text>
            </svg>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl sm:text-2xl md:text-3xl font-bold text-white italic leading-snug mb-4"
            style={hf}
          >
            {l(slide.heading)}
          </motion.h2>
          {slide.body && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-text-secondary text-sm sm:text-base leading-relaxed mb-4"
              style={bf}
            >
              {l(slide.body)}
            </motion.p>
          )}
          {slide.sourceText && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-gold-dark text-xs uppercase tracking-widest font-bold"
            >
              — {l(slide.sourceText)}
            </motion.p>
          )}
        </div>
      );

    case 'cta':
      return (
        <div className="max-w-lg text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-gold-light leading-snug mb-4"
            style={hf}
          >
            {l(slide.heading)}
          </motion.h2>
          {slide.body && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-text-secondary text-sm sm:text-base leading-relaxed mb-8"
              style={bf}
            >
              {l(slide.body)}
            </motion.p>
          )}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Link
              href={ctaUrl}
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gold-primary text-bg-primary font-bold text-base hover:bg-gold-light transition-colors"
            >
              {isDevanagariLocale(locale) ? 'पूरा लेख पढ़ें' : 'Read Full Article'}
              <ChevronRight className="w-5 h-5" />
            </Link>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-6 text-text-secondary/50 text-xs"
          >
            dekhopanchang.com
          </motion.p>
        </div>
      );

    default:
      return null;
  }
}
