# Tactical LLM Features — Design & Architecture Document

## 1. Executive Summary

Three new LLM-powered features that leverage our existing Anthropic SDK integration and deterministic calculation engine. Each feature follows the project's **progressive enhancement** pattern: works without LLM (degraded), enhanced with LLM (full experience).

### Features
| # | Feature | Description | LLM Role |
|---|---------|-------------|----------|
| A | **Chat with Your Chart** | Conversational Q&A about a generated kundali | Reasoning over structured chart data |
| B | **Daily Horoscope** | 12 Moon-sign daily forecasts from real planetary data | Content generation from astronomical facts |
| C | **Enhanced Tippanni** | Varga-aware deep interpretation with classical citations | Synthesis across all divisional charts |

---

## 2. Current Architecture (Relevant Parts)

```
┌─────────────────────────────────────────────────────────┐
│                    NEXT.JS APP (TypeScript)              │
│                                                         │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │ /api/kundali │  │ /api/panchang│  │ /api/tippanni│   │
│  │  (pure JS)   │  │  (pure JS)   │  │ (JS + Claude)│   │
│  └──────┬──────┘  └──────┬───────┘  └──────┬───────┘   │
│         │                │                  │            │
│  ┌──────▼──────────────▼──────────────────▼──────────┐ │
│  │          CALCULATION ENGINE (deterministic)         │ │
│  │  astronomical.ts │ panchang-calc.ts │ kundali-calc │ │
│  │  jaimini-calc.ts │ varga-tippanni.ts              │ │
│  └───────────────────────────────────────────────────┘ │
│                          │                              │
│                   ┌──────▼──────┐                       │
│                   │   RAG Layer  │                       │
│                   │ retriever.ts │──→ Supabase (vectors) │
│                   │synthesizer.ts│──→ Claude API         │
│                   └─────────────┘                       │
└─────────────────────────────────────────────────────────┘
```

**Key constraints:**
- All astronomical calculations are pure JS (no LLM needed)
- Claude is only used for tippanni synthesis (optional)
- Supabase stores classical text embeddings for RAG
- Graceful degradation: everything works without external APIs

---

## 3. Feature A: Chat with Your Chart

### 3.1 User Flow
```
User generates kundali → clicks "Chat" tab → asks questions
  "Will I get married soon?"
  "What does Jupiter in my 7th house mean?"
  "Is this a good time to change careers?"
```

### 3.2 Architecture
```
┌─────────────────────────────────────────────┐
│              CHAT TAB (client)               │
│                                              │
│  User message ──→ POST /api/chart-chat       │
│                     │                        │
│              ┌──────▼──────┐                 │
│              │ Build prompt │                 │
│              │  - Chart D1  │                 │
│              │  - D9, D10   │                 │
│              │  - Dashas    │                 │
│              │  - Jaimini   │                 │
│              │  - Transits  │                 │
│              └──────┬──────┘                 │
│                     │                        │
│              ┌──────▼──────┐                 │
│              │ Claude API   │                 │
│              │ (streaming)  │                 │
│              └──────┬──────┘                 │
│                     │                        │
│              Stream response to UI            │
└─────────────────────────────────────────────┘
```

### 3.3 API Design
```
POST /api/chart-chat
Content-Type: application/json

Request:
{
  "message": "Will I get married soon?",
  "kundali": KundaliData,      // full chart data
  "history": ChatMessage[],     // conversation history (last 10)
  "locale": "en" | "hi" | "sa"
}

Response: ReadableStream (SSE)
data: {"text": "Based on your D9 Navamsha..."}
data: {"text": " Jupiter is in the 7th house..."}
data: {"done": true}
```

### 3.4 System Prompt Strategy
The system prompt will include:
1. **Role**: "You are a Vedic astrology scholar analyzing a specific birth chart"
2. **Chart data** (structured): Ascendant, all planet positions, houses, dignities
3. **Dasha timing**: Current Mahadasha/Antardasha with dates
4. **Key yogas/doshas**: Pre-detected by our engine
5. **Constraints**: "Only reference data provided. Do not invent positions. Cite house numbers and signs accurately."

### 3.5 Fallback (no API key)
- Tab hidden if `ANTHROPIC_API_KEY` not set
- Message: "Chat requires API configuration"

### 3.6 Cost Estimate
- ~3000 tokens per exchange (1500 in system prompt + context, 1500 out)
- ~$0.01-0.03 per message at Claude Sonnet pricing
- Rate limit: 20 messages per session

---

## 4. Feature B: Daily Horoscope

### 4.1 User Flow
```
Home page → "Today's Horoscope" section
  - 12 Moon sign cards
  - Click to expand full reading
  - Based on ACTUAL planetary positions (not generic)
```

### 4.2 Architecture
```
┌──────────────────────────────────────────────────────┐
│                 DAILY HOROSCOPE SYSTEM                │
│                                                      │
│  ┌─────────────┐    ┌──────────────────────────┐     │
│  │ Cron / ISR   │───→│ /api/horoscope/generate  │     │
│  │ (daily 4am)  │    │                          │     │
│  └─────────────┘    │  1. computePanchang()     │     │
│                      │  2. getPlanetPositions()  │     │
│                      │  3. For each of 12 signs: │     │
│                      │     - Build transit prompt │     │
│                      │     - Claude generates    │     │
│                      │       ~150 word forecast   │     │
│                      │  4. Cache in memory/file   │     │
│                      └──────────────┬───────────┘     │
│                                     │                 │
│  ┌──────────────┐    ┌──────────────▼───────────┐     │
│  │ /api/horoscope│◄──│   In-memory cache         │     │
│  │   GET ?sign=1 │    │   (24-hour TTL)           │     │
│  └──────┬───────┘    └──────────────────────────┘     │
│         │                                             │
│  ┌──────▼───────┐                                     │
│  │ Horoscope UI  │   12 cards with Moon sign icons     │
│  │ (home page)   │   expandable for full reading       │
│  └──────────────┘                                     │
└──────────────────────────────────────────────────────┘
```

### 4.3 Prompt Design
Each sign's prompt includes:
- Today's exact planetary positions (from computePanchang)
- Transit Moon's position relative to that sign (which house)
- Any active yogas/doshas for the day
- Current nakshatra, tithi, vara

Example for Aries (Moon sign):
```
Today's transits for Aries Moon sign:
- Moon in Gemini (3rd house from Aries): Communication, short travel
- Sun in Pisces (12th house): Introspection, foreign connections
- Jupiter in Taurus (2nd house): Financial growth
- Saturn in Aquarius (11th house): Gains through discipline
- Rahu in Pisces (12th): Hidden opportunities
- Mars in Cancer (4th): Home/property focus
- Venus in Aries (1st): Personal charm enhanced

Tithi: Krishna Panchami (waning 5th)
Nakshatra: Mrigashira
Yoga: Siddha (auspicious)

Generate a 150-word daily horoscope for Aries Moon sign.
Mention 2-3 specific actionable insights based on the transits.
Tone: practical, grounded, referencing specific planet positions.
```

### 4.4 Fallback (no API key)
- Show pre-computed transit summaries (deterministic)
- "Moon in your 3rd house today — good for communication"
- No LLM-generated prose, just factual transit data

### 4.5 Cost Estimate
- 12 signs × ~500 tokens per forecast = ~6000 tokens/day
- ~$0.02-0.05/day total
- Generated once per day, cached for 24 hours

---

## 5. Feature C: Enhanced Varga Tippanni

### 5.1 Current State
- `varga-tippanni.ts` generates rule-based commentary per chart
- Template-based: "Lagna lord X in Yth house — favorable/unfavorable"
- No classical citations, no cross-chart synthesis

### 5.2 Enhancement
Pipe the structured varga analysis through Claude for:
1. **Natural prose** instead of templates
2. **Cross-chart correlation**: "D10 shows career strength AND D2 confirms financial support for it"
3. **Classical citations** via existing RAG pipeline
4. **Temporal synthesis**: "Given your current Saturn Mahadasha, the D10 career indicators will mature in the next 2 years"

### 5.3 Architecture
```
Existing varga-tippanni.ts (deterministic)
       │
       ▼ (structured data)
POST /api/varga-synthesis
       │
       ├── Build mega-prompt with ALL chart analyses
       │
       ├── Claude generates:
       │     - Cross-chart narrative (500 words)
       │     - Per-domain deep dives (100 words each for key charts)
       │     - Integrated 2-year prognosis
       │
       └── Return structured JSON
```

### 5.4 Prompt Design
System prompt includes the complete varga analysis output:
- All 19 chart strengths (strong/moderate/weak)
- Lagna lord placements in each chart
- Current dasha timing
- Key planet positions across all charts
- Request: "Synthesize a comprehensive reading that connects insights across divisional charts"

---

## 6. Data Flow Diagram (All Features)

```
                         ┌──────────────┐
                         │   BROWSER     │
                         │              │
           ┌─────────────┤  Kundali UI  ├────────────────┐
           │             │  Panchang UI │                │
           │             │  Home Page   │                │
           │             └──────┬───────┘                │
           │                    │                        │
    ┌──────▼──────┐   ┌────────▼────────┐   ┌──────────▼──────┐
    │/api/chart-  │   │/api/horoscope   │   │/api/varga-      │
    │    chat     │   │                 │   │  synthesis      │
    │  (stream)   │   │  GET ?sign=N    │   │  POST           │
    └──────┬──────┘   └────────┬────────┘   └──────────┬──────┘
           │                   │                       │
           │         ┌────────▼────────┐               │
           │         │ Cache Layer     │               │
           │         │ (24h for horo)  │               │
           │         │ (1h for varga)  │               │
           │         └────────┬────────┘               │
           │                  │                        │
    ┌──────▼──────────────────▼────────────────────────▼──────┐
    │                    CLAUDE API                            │
    │              (claude-sonnet-4-20250514)                  │
    │                                                         │
    │  Chart Chat: streaming, ~3000 tok/exchange              │
    │  Horoscope:  batch 12 signs, ~6000 tok/day              │
    │  Varga:      single call, ~4000 tok/synthesis           │
    └─────────────────────────────────────────────────────────┘
```

---

## 7. Error Handling Strategy

| Scenario | Behavior |
|----------|----------|
| No `ANTHROPIC_API_KEY` | Chat tab hidden; horoscope shows transit-only fallback; varga uses rule-based tippanni |
| Claude API timeout | Chat: "I'm having trouble responding. Try again."; Horoscope: serve yesterday's cache; Varga: return deterministic version |
| Rate limit hit (429) | Chat: "Please wait before sending more messages"; Others: exponential backoff |
| Invalid chart data | Chat: "I need a valid kundali to analyze. Please generate one first." |
| Hallucination guard | System prompt instructs: "ONLY reference data I've provided. If unsure, say so." |

---

## 8. Test Plan

### Unit Tests
| Test | File | What it validates |
|------|------|-------------------|
| Chart chat prompt builder | `chart-chat.test.ts` | System prompt includes all planets, correct houses, dasha timing |
| Horoscope prompt builder | `horoscope.test.ts` | Transit data correctly mapped to each of 12 signs |
| Varga synthesis prompt | `varga-synthesis.test.ts` | All 19 charts included, cross-references correct |
| Fallback behavior | `fallback.test.ts` | Each feature degrades gracefully without API key |

### Integration Tests
| Test | What it validates |
|------|-------------------|
| `/api/chart-chat` returns SSE stream | Streaming response format correct |
| `/api/horoscope` returns 12 forecasts | All signs covered, cache working |
| `/api/varga-synthesis` returns structured JSON | Valid JSON with all sections |
| Rate limiting works | 429 returned after limit exceeded |

### E2E Tests
| Test | What it validates |
|------|-------------------|
| Generate kundali → open Chat tab → ask question → get response | Full user flow works |
| Home page loads → horoscope section visible → click sign → see forecast | Horoscope UX works |
| Generate kundali → Varga tab → see enhanced commentary | Varga synthesis renders |
| All features work without API key (degraded mode) | Progressive enhancement |

---

## 9. File Structure (New Files)

```
src/
├── app/api/
│   ├── chart-chat/route.ts          # Streaming chat endpoint
│   ├── horoscope/route.ts           # Daily horoscope endpoint
│   └── varga-synthesis/route.ts     # Enhanced varga synthesis
├── lib/
│   ├── llm/
│   │   ├── chart-chat-prompt.ts     # Builds chat system prompt from KundaliData
│   │   ├── horoscope-prompt.ts      # Builds horoscope prompts from PanchangData
│   │   ├── varga-synthesis-prompt.ts # Builds varga mega-prompt
│   │   └── llm-client.ts            # Shared Claude client singleton
│   └── cache/
│       └── horoscope-cache.ts       # In-memory 24h cache for horoscopes
├── components/
│   └── kundali/
│       └── ChartChatTab.tsx         # Chat UI component
├── lib/llm/__tests__/
│   ├── chart-chat-prompt.test.ts
│   ├── horoscope-prompt.test.ts
│   └── varga-synthesis-prompt.test.ts
└── e2e/
    ├── chart-chat.spec.ts
    ├── horoscope.spec.ts
    └── varga-synthesis.spec.ts
```

---

## 10. Security Considerations

1. **API key never exposed to client** — all LLM calls server-side via API routes
2. **Rate limiting** — 20 chat messages/session, 60 API calls/min
3. **Input sanitization** — Zod validation on all inputs, message length cap (500 chars)
4. **No PII in prompts** — Only astronomical data passed to Claude, no user names/emails
5. **Prompt injection defense** — Chart data passed as structured JSON in system prompt, not user-controlled

---

## 11. Cost Model

| Feature | Daily Usage (est.) | Tokens/day | Cost/day |
|---------|-------------------|------------|----------|
| Chart Chat | 100 conversations × 5 msgs | 1.5M | ~$4.50 |
| Daily Horoscope | 1 generation × 12 signs | 6K | ~$0.02 |
| Varga Synthesis | 50 generations | 200K | ~$0.60 |
| **Total** | | **~1.7M** | **~$5.12** |

At scale (10K users/day): ~$50/day. Manageable.
