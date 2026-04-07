'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, AlertTriangle } from 'lucide-react';
import type { KundaliData } from '@/types/kundali';
import type { Locale } from '@/types/panchang';
import { useSubscription } from '@/hooks/useSubscription';
import { useAuthStore } from '@/stores/auth-store';

interface Props {
  kundali: KundaliData;
  locale: Locale;
  headingFont: React.CSSProperties;
}

export default function AIReadingButton({ kundali, locale, headingFont }: Props) {
  const [reading, setReading] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showReading, setShowReading] = useState(false);
  const [rateLimited, setRateLimited] = useState(false);
  const [rateLimitMsg, setRateLimitMsg] = useState('');
  const readingRef = useRef<HTMLDivElement>(null);
  const isDevanagari = locale !== 'en';
  const bodyFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined;

  // Check subscription — only Pro/Jyotishi can use AI readings
  const { tier } = useSubscription();
  const session = useAuthStore(s => s.session);
  const isPaid = tier === 'pro' || tier === 'jyotishi';

  const generateReading = useCallback(async () => {
    setLoading(true);
    setError(null);
    setReading('');
    setShowReading(true);
    setRateLimited(false);

    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }

      const res = await fetch('/api/tippanni-llm', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          kundali,
          stream: true,
          locale: locale === 'sa' ? 'en' : locale,
        }),
      });

      if (res.status === 429) {
        const data = await res.json().catch(() => ({}));
        setRateLimited(true);
        setRateLimitMsg(data.error || '');
        setLoading(false);
        return;
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'AI reading failed');
      }

      // Stream SSE response
      const reader = res.body?.getReader();
      if (!reader) throw new Error('No stream available');

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          try {
            const parsed = JSON.parse(line.slice(6));
            if (parsed.type === 'text' && parsed.text) {
              setReading(prev => prev + parsed.text);
            }
          } catch {
            // Skip
          }
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to generate AI reading');
    }

    setLoading(false);
  }, [kundali, locale]);

  // Not paid — show upgrade prompt
  if (!isPaid) {
    return (
      <div className="rounded-2xl p-5 border border-gold-primary/20 bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] text-center">
        <Sparkles className="w-8 h-8 text-gold-primary mx-auto mb-3" />
        <h3 className="text-gold-light font-bold text-lg mb-2" style={headingFont}>
          {locale === 'en' ? 'AI-Powered Personal Reading' : 'AI-संचालित व्यक्तिगत विश्लेषण'}
        </h3>
        <p className="text-text-secondary text-sm mb-4" style={bodyFont}>
          {locale === 'en'
            ? 'Get a deeply personalized reading powered by Claude AI that weaves together your natal chart, dashas, transits, and convergence patterns into a unified narrative — like a consultation with a senior astrologer.'
            : 'क्लॉड AI द्वारा संचालित एक गहन व्यक्तिगत विश्लेषण प्राप्त करें जो आपकी जन्म कुंडली, दशा, गोचर और संयोग पैटर्न को एक एकीकृत कथा में बुनता है।'}
        </p>
        <a href="/pricing" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gold-dark to-gold-primary text-bg-primary font-bold text-sm rounded-xl hover:from-gold-primary hover:to-gold-light transition-all">
          <Sparkles className="w-4 h-4" />
          {locale === 'en' ? 'Upgrade to Pro' : 'प्रो में अपग्रेड करें'}
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Generate button */}
      {!showReading && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={generateReading}
          disabled={loading}
          className="w-full rounded-2xl p-5 border-2 border-gold-primary/25 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] hover:border-gold-primary/40 hover:from-[#2d1b69]/50 transition-all group cursor-pointer"
        >
          <div className="flex items-center justify-center gap-3">
            <Sparkles className="w-6 h-6 text-gold-primary group-hover:text-gold-light transition-colors" />
            <span className="text-gold-light font-bold text-lg" style={headingFont}>
              {locale === 'en' ? 'Get AI Reading' : 'AI विश्लेषण प्राप्त करें'}
            </span>
          </div>
          <p className="text-text-secondary/75 text-xs mt-2">
            {locale === 'en'
              ? 'Powered by Claude AI — a personalized narrative weaving all your chart factors together'
              : 'क्लॉड AI द्वारा संचालित — आपकी कुंडली के सभी कारकों को एकीकृत करने वाली व्यक्तिगत कथा'}
          </p>
        </motion.button>
      )}

      {/* Reading display */}
      <AnimatePresence>
        {showReading && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="rounded-2xl border-2 border-gold-primary/25 bg-gradient-to-br from-[#1a0e3a]/60 via-[#0f0825]/70 to-[#0a0e27] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gold-primary/15">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-gold-primary" />
                <span className="text-gold-light font-bold" style={headingFont}>
                  {locale === 'en' ? 'AI Personal Reading' : 'AI व्यक्तिगत विश्लेषण'}
                </span>
                {loading && (
                  <span className="flex items-center gap-1.5 text-[10px] text-amber-300 bg-amber-500/15 border border-amber-500/25 rounded-full px-2 py-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                    {locale === 'en' ? 'Writing...' : 'लिख रहा है...'}
                  </span>
                )}
              </div>
              <button
                onClick={() => { setShowReading(false); setReading(''); setError(null); }}
                className="p-1.5 rounded-lg hover:bg-bg-tertiary/50 text-text-secondary hover:text-text-primary transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div ref={readingRef} className="px-5 py-5 max-h-[70vh] overflow-y-auto">
              {rateLimited && (
                <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/8 border border-amber-500/20 mb-4">
                  <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-amber-200 text-sm font-bold">
                      {locale === 'en' ? 'AI Reading Limit Reached' : 'AI विश्लेषण सीमा पूर्ण'}
                    </p>
                    <p className="text-text-secondary text-xs mt-1">
                      {rateLimitMsg || (locale === 'en'
                        ? 'Monthly AI reading limit reached. Your rule-based convergence analysis above is always available.'
                        : 'मासिक AI विश्लेषण सीमा पूर्ण। ऊपर नियम-आधारित विश्लेषण हमेशा उपलब्ध है।')}
                    </p>
                  </div>
                </div>
              )}

              {error && (
                <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/8 border border-red-500/20 mb-4">
                  <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-red-300 text-sm font-bold">
                      {locale === 'en' ? 'AI Reading Unavailable' : 'AI विश्लेषण अनुपलब्ध'}
                    </p>
                    <p className="text-text-secondary text-xs mt-1">{error}</p>
                  </div>
                </div>
              )}

              {reading && (
                <div
                  className="prose prose-invert prose-sm max-w-none
                    prose-headings:text-gold-light prose-headings:font-bold
                    prose-h2:text-xl prose-h2:mt-6 prose-h2:mb-3
                    prose-h3:text-lg prose-h3:mt-4 prose-h3:mb-2
                    prose-p:text-text-primary prose-p:leading-relaxed
                    prose-strong:text-amber-400
                    prose-li:text-text-primary
                    prose-a:text-gold-primary"
                  style={bodyFont}
                  dangerouslySetInnerHTML={{ __html: markdownToHtml(reading) }}
                />
              )}

              {loading && !reading && (
                <div className="flex items-center justify-center py-12">
                  <div className="flex items-center gap-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-gold-primary border-t-transparent" />
                    <span className="text-text-secondary text-sm">
                      {locale === 'en' ? 'Preparing your personal reading...' : 'आपका व्यक्तिगत विश्लेषण तैयार हो रहा है...'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Minimal markdown-to-HTML for the AI reading output.
 * Handles: ## headings, **bold**, *italic*, - lists, \n paragraphs
 */
function markdownToHtml(md: string): string {
  return md
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    // Headings
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // List items
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, (match) => `<ul>${match}</ul>`)
    // Numbered lists
    .replace(/^\d+\.\s+(.+)$/gm, '<li>$1</li>')
    // Paragraphs (double newline)
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(?!<[hul])/, '<p>')
    .replace(/(?<![>])$/, '</p>')
    // Clean up empty paragraphs
    .replace(/<p><\/p>/g, '')
    .replace(/<p>(<h[23]>)/g, '$1')
    .replace(/(<\/h[23]>)<\/p>/g, '$1');
}
