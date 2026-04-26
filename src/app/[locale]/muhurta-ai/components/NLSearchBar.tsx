'use client';

import { Loader2, Search } from 'lucide-react';

interface NLSearchBarProps {
  locale: string;
  query: string;
  searching: boolean;
  onQueryChange: (q: string) => void;
  onSearch: (e: React.FormEvent) => void;
  headingFont: React.CSSProperties;
}

export default function NLSearchBar({
  locale,
  query,
  searching,
  onQueryChange,
  onSearch,
  headingFont,
}: NLSearchBarProps) {
  const isHi = locale === 'hi';

  return (
    <div className="mb-10">
      <div className="rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/15 p-6">
        <h2
          className="text-gold-light text-lg font-bold mb-2"
          style={headingFont}
        >
          {isHi ? 'मुहूर्त खोजें' : 'Smart Muhurta Search'}
        </h2>
        <p className="text-text-secondary text-sm mb-4">
          {isHi
            ? 'प्राकृतिक भाषा में पूछें — "दिल्ली में अक्टूबर में शादी का सबसे अच्छा समय"'
            : 'Ask in plain language — "Best time for a wedding in Delhi in October"'}
        </p>
        <form onSubmit={onSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary/50 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder={
                isHi
                  ? 'कोई भी मुहूर्त प्रश्न पूछें...'
                  : 'Ask any muhurta question...'
              }
              className="w-full bg-bg-secondary border border-gold-primary/15 rounded-lg pl-10 pr-4 py-3 text-sm text-gold-light placeholder:text-text-secondary/50 focus:outline-none focus:border-gold-primary/40 transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={searching || !query.trim()}
            className="px-6 py-3 rounded-lg bg-gold-primary/20 border border-gold-primary/40 text-gold-light font-medium text-sm hover:bg-gold-primary/30 disabled:opacity-50 transition-all flex items-center gap-2"
          >
            {searching ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {isHi ? 'खोज रहे हैं...' : 'Searching...'}
              </>
            ) : (
              isHi ? 'खोजें' : 'Search'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
