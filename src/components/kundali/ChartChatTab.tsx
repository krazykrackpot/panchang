'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Loader2, Bot, User } from 'lucide-react';
import { authedFetch } from '@/lib/api/authed-fetch';
import type { KundaliData } from '@/types/kundali';
import type { Locale } from '@/types/panchang';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChartChatTabProps {
  kundali: KundaliData;
  locale: Locale;
  headingFont: React.CSSProperties;
}

const SUGGESTED_QUESTIONS = {
  en: [
    'What are my strongest career indicators?',
    'Will I get married soon based on my chart?',
    'What does my current dasha period mean for me?',
    'Are there any yogas in my chart?',
    'What remedies would help strengthen my chart?',
    'How is my financial outlook?',
  ],
  hi: [
    'मेरे करियर के सबसे मजबूत संकेत क्या हैं?',
    'मेरी कुण्डली के अनुसार विवाह कब होगा?',
    'वर्तमान दशा काल का मेरे लिए क्या अर्थ है?',
    'मेरी कुण्डली में कौन से योग हैं?',
    'कौन से उपाय मेरी कुण्डली को मजबूत करेंगे?',
    'मेरी आर्थिक स्थिति कैसी रहेगी?',
  ],
};

export default function ChartChatTab({ kundali, locale, headingFont }: ChartChatTabProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const isHi = locale === 'hi';
  const suggestions = SUGGESTED_QUESTIONS[isHi ? 'hi' : 'en'];

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;
    setError('');
    const userMsg: ChatMessage = { role: 'user', content: text.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await authedFetch('/api/chart-chat', {
        method: 'POST',
        body: JSON.stringify({
          message: text.trim(),
          kundali,
          history: newMessages.slice(-10),
          locale,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to get response');
      }

      const data = await res.json();
      setMessages([...newMessages, { role: 'assistant', content: data.response }]);
    } catch (err) {
      setError(isHi ? 'उत्तर प्राप्त करने में त्रुटि। पुनः प्रयास करें।' : 'Error getting response. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] sm:h-[500px] md:h-[600px]">
      <h3 className="text-gold-gradient text-xl font-bold mb-4 text-center" style={headingFont}>
        {isHi ? 'अपनी कुण्डली से चर्चा करें' : 'Chat with Your Chart'}
      </h3>
      <p className="text-text-secondary text-xs text-center mb-4">
        {isHi ? 'अपनी जन्म कुण्डली के बारे में कोई भी प्रश्न पूछें' : 'Ask any question about your birth chart'}
      </p>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-3 mb-4 pr-1">
        {messages.length === 0 && (
          <div className="space-y-2">
            <p className="text-text-tertiary text-xs text-center mb-3">
              {isHi ? 'सुझावित प्रश्न:' : 'Suggested questions:'}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {suggestions.map((q, i) => (
                <button key={i} onClick={() => sendMessage(q)}
                  className="text-left px-3 py-2.5 rounded-lg bg-bg-secondary/50 border border-gold-primary/10 text-text-secondary text-xs sm:text-sm hover:border-gold-primary/30 hover:text-gold-light transition-all">
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div className="w-7 h-7 rounded-full bg-gold-primary/15 flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="w-4 h-4 text-gold-primary" />
              </div>
            )}
            <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
              msg.role === 'user'
                ? 'bg-gold-primary/15 text-gold-light border border-gold-primary/20 rounded-br-md'
                : 'bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 text-text-primary rounded-bl-md'
            }`} style={isHi ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
              {msg.content}
            </div>
            {msg.role === 'user' && (
              <div className="w-7 h-7 rounded-full bg-bg-tertiary flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-4 h-4 text-text-secondary" />
              </div>
            )}
          </motion.div>
        ))}

        {loading && (
          <div className="flex gap-2.5">
            <div className="w-7 h-7 rounded-full bg-gold-primary/15 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-gold-primary" />
            </div>
            <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl rounded-bl-md px-4 py-3">
              <Loader2 className="w-4 h-4 animate-spin text-gold-primary" />
            </div>
          </div>
        )}
      </div>

      {error && <div className="text-red-400 text-xs text-center mb-2">{error}</div>}

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
          placeholder={isHi ? 'अपना प्रश्न टाइप करें...' : 'Type your question...'}
          disabled={loading}
          className="flex-1 px-4 py-2.5 rounded-xl bg-bg-secondary border border-gold-primary/15 text-text-primary text-sm focus:outline-none focus:border-gold-primary/40 placeholder:text-text-tertiary disabled:opacity-50"
          style={isHi ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}
        />
        <button onClick={() => sendMessage(input)} disabled={loading || !input.trim()}
          className="px-4 py-2.5 rounded-xl bg-gold-primary text-bg-primary font-medium hover:bg-gold-light transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
