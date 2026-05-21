# Brihaspati (बृहस्पति) — AI Vedic Pandit

> **Status:** Background / exploratory plan. The canonical product spec is `docs/superpowers/specs/2026-05-21-brihaspati-ai-astrologer-design.md` (Final, 2026-05-21). Where this document and the spec disagree (pricing tiers, model architecture, launch locales, currency), **the spec wins**. This PLAN.md is kept for the engine-routing table (§3), the model-hosting analysis (§5), the fine-tuning pipeline (§6), and the revenue model (§7) — all of which the spec references but does not duplicate.

> The Guru of the Devas becomes your personal Jyotish guide.

## Overview

Brihaspati is a paid AI astrology consultation feature. Users ask questions about their chart (career, marriage, health, timing, remedies) and receive personalised, detailed answers grounded in their actual birth chart computation — not LLM hallucinations.

**Business model:** Per-question payment (₹49–299/month). Zero marginal cost (self-hosted fine-tuned model).

**Architecture:** Deterministic Jyotish computation engine (existing 8,000+ lines) produces structured analysis → fine-tuned Qwen 14B narrates it as a wise pandit in Hindi/English.

---

## 1. Naming & Persona

**Name:** Brihaspati (बृहस्पति) — Jupiter, Guru of the Devas

**Why:**
- Instantly recognisable to every Hindu astrology user
- Jupiter IS wisdom, teaching, and guidance in Jyotish
- Gender-neutral (planet, not person) — avoids fake-human uncanny valley
- Works in Hindi and English equally
- SEO value — "Brihaspati" is itself a search term

**Persona traits:**
- Wise but warm — not cold or clinical
- Specific and grounded — cites actual planet positions, never vague
- Compassionate — especially for challenging readings (doshas, malefic periods)
- Practical — every answer ends with actionable advice
- Bilingual — natural Hindi with Sanskrit terms, or clear English. Never translationese.

**Voice examples:**

> *English:* "Your 7th house lord Venus sits strong in own sign Taurus — a clear promise of a meaningful partnership. However, Ketu's presence in the 7th house whispers a different story: the path to marriage may not be conventional, and timing may test your patience. This is not a denial — it is a redirection."

> *Hindi:* "आपके सप्तम भाव का स्वामी शुक्र अपनी ही राशि वृषभ में बलवान है — एक सार्थक साझेदारी का स्पष्ट वादा। परन्तु सप्तम में केतु की उपस्थिति एक भिन्न कहानी कहती है: विवाह का मार्ग पारम्परिक नहीं हो सकता, और समय आपके धैर्य की परीक्षा ले सकता है। यह अस्वीकृति नहीं — पुनर्निर्देशन है।"

---

## 2. Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                        USER QUESTION                          │
│            "When will I get married?"                         │
└──────────────────┬───────────────────────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────────────────────────┐
│              QUESTION CLASSIFIER (deterministic)              │
│  Keyword matching + category rules                           │
│  → Category: MARRIAGE                                        │
│  → Sub-intent: TIMING                                        │
│  → Required engines: domain-synthesis, dasha-prognosis,      │
│                       transit-activation, remedies            │
└──────────────────┬───────────────────────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────────────────────────┐
│              COMPUTATION ENGINE (deterministic)                │
│  Runs on user's kundali snapshot (already computed + cached)  │
│                                                               │
│  → 7th house analysis: lord, occupants, aspects               │
│  → Marriage domain rating: madhyama (mixed)                   │
│  → Current dasha: Jupiter-Mercury (activates 7th from Moon)   │
│  → Next Venus dasha: starts 2027-03-14                        │
│  → Jupiter transit 7th: 2026-11 to 2027-04                    │
│  → Doshas: Ketu in 7th (delay, unconventional)                │
│  → Remedies: Diamond, Friday donation, Venus mantra           │
│                                                               │
│  Output: structured JSON blob (~500 tokens)                   │
└──────────────────┬───────────────────────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────────────────────────┐
│            NARRATION MODEL (fine-tuned Qwen 14B)              │
│                                                               │
│  System prompt: "You are Brihaspati, a wise Vedic astrologer. │
│  Narrate the following chart analysis as a personal reading.  │
│  NEVER invent data — only use what is provided.               │
│  Language: {Hindi/English}"                                   │
│                                                               │
│  Input: structured JSON + user's question                     │
│  Output: 300-500 tokens of flowing, personalised prose        │
│                                                               │
│  Self-hosted on Hetzner. Zero per-query cost.                 │
└──────────────────┬───────────────────────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────────────────────────┐
│                     RESPONSE TO USER                          │
│                                                               │
│  ── Chart Analysis ──                                        │
│  [Personalised analysis with actual planet positions]         │
│                                                               │
│  ── Timing Windows ──                                        │
│  [Specific date ranges with dasha/transit triggers]           │
│                                                               │
│  ── Remedies ──                                              │
│  [Gemstone, mantra, donation — specific to their chart]       │
│                                                               │
│  ── Classical Reference ──                                   │
│  [BPHS/Saravali verse supporting the analysis]               │
└──────────────────────────────────────────────────────────────┘
```

**Key principle:** The LLM never computes astrology. It only narrates. All Jyotish intelligence lives in our deterministic engine (verified against Prokerala, grounded in BPHS). The LLM is a skilled writer, not an astrologer.

---

## 3. Question Categories & Engine Routing

| Category | Example Questions | Engines Used |
|----------|------------------|-------------|
| Career | "Will I get promoted?", "Should I start a business?" | domain-synthesis(career), dasha-prognosis, transit-activation, 10th house analysis |
| Marriage | "When will I get married?", "Will my marriage survive?" | domain-synthesis(marriage), dasha-timing, 7th house, Venus/Jupiter analysis |
| Health | "What health risks do I face?" | domain-synthesis(health), 6th/8th house, planet-in-house, remedies |
| Finance | "Is this a good time to invest?" | domain-synthesis(wealth), 2nd/11th house, transit-activation, muhurta |
| Children | "When will I have children?" | domain-synthesis(children), 5th house, putrakaraka, Jupiter transit |
| Education | "Will I pass my exam?" | domain-synthesis(education), Mercury/Jupiter analysis, dasha |
| Dasha | "What does my current period mean?" | dasha-prognosis, dasha-effects-enhanced, stage-advice, transit overlay |
| Remedies | "What should I do to improve my life?" | remedies-enhanced, weakest planet (Shadbala), dosha-specific |
| Compatibility | "Are we compatible?" (needs partner chart) | ashta-kuta, dasha-comparison, synastry, family-synthesis |
| Timing | "When is the best time for X?" | muhurta-scorer, personal-muhurta, transit windows |
| Transit | "How is Saturn/Jupiter affecting me?" | gochar, sade-sati, double-transit, transit-activation |
| General | "Tell me about my chart" | full tippanni, life-overview, personality snapshot |

---

## 4. Pricing Model

| Tier | Price (INR) | Price (USD) | What they get |
|------|------------|-------------|---------------|
| **Single Question** | ₹49 | $0.50 | One detailed answer with timing + remedies |
| **3-Question Pack** | ₹99 | $1.10 | Three questions (valid 30 days) |
| **Monthly Unlimited** | ₹299 | $3.50 | Unlimited questions + PDF export |
| **Annual** | ₹1,999 | $24 | Unlimited + priority + shareable reports |

**Context:**
- AstroSage live chat: ₹9–35/min (our single question is cheaper)
- Human astrologer: ₹500–2,000 per consultation (we're 10x cheaper)
- Competing AI astrology apps: $5–15/month (we're cheaper)
- Our marginal cost per question: ₹0

**Payment integration:** Already built — Stripe (USD) + Razorpay (INR).

---

## 5. Model Selection & Hosting

### Phase 1: Launch (0–200 users)

| Parameter | Value |
|-----------|-------|
| Model | Qwen 3 14B (Q4_K_M quantised, ~9GB) |
| Server | Hetzner CAX41 (16 vCPU ARM, 32GB RAM) |
| Cost | €15.90/month (~$17) |
| Inference | llama.cpp or vLLM, CPU mode |
| Speed | ~12 tok/s → 300 token response in ~25 seconds |
| Concurrency | 2–3 simultaneous requests |

### Phase 2: Growth (200–1,000 users)

| Parameter | Value |
|-----------|-------|
| Model | Qwen 3 32B or Gemma 3 27B (Q4, ~20GB) |
| Server | Hetzner GPU server (L40S 48GB) |
| Cost | ~€150/month |
| Speed | ~40 tok/s → 300 tokens in ~8 seconds |
| Concurrency | 10+ simultaneous requests |

### Phase 3: Scale (1,000+ users)

| Parameter | Value |
|-----------|-------|
| Model | Qwen 3 32B (FP16) or custom fine-tune |
| Server | 2× GPU instances behind load balancer |
| Cost | ~€300/month |
| Speed | ~3 seconds per response |
| Concurrency | 50+ simultaneous |

---

## 6. Fine-Tuning Plan

### 6.1 Training Data Generation

**Source:** Use Claude Sonnet (our current model) to generate gold-standard narrations from our computation engine output.

**Pipeline:**
```
500 diverse birth charts × 12 question categories = 6,000 training pairs

For each pair:
  1. Run our computation engine → structured JSON
  2. Claude Sonnet prompt:
     "You are Brihaspati, a wise Vedic astrologer.
      Given this chart analysis JSON, answer the question
      in [Hindi/English]. 300-500 words.
      RULES: Never invent data. Cite specific positions.
      End with practical remedy. Mention classical reference."
  3. Collect (input: JSON + question, output: Claude narration)
```

**Chart diversity matrix:**
- 12 lagnas × 3 dasha periods × 3 yoga combinations × 2 genders = ~216 base charts
- Add 284 edge cases: retrograde planets, combustion, Sade Sati, Kaal Sarpa, Manglik
- Total: 500 unique charts

**Language split:**
- 3,000 pairs in English
- 3,000 pairs in Hindi
- Natural code-switching examples in both (Indians mix Hindi+English)

### 6.2 Quality Filtering

- Manual review of ~200 random pairs
- Discard any where Claude hallucinated positions or gave generic advice
- Keep only responses that are specific, cite actual data, and sound like a real pandit
- Target: ~5,000 filtered pairs

### 6.3 Fine-Tuning

| Parameter | Value |
|-----------|-------|
| Base model | Qwen 3 14B |
| Method | LoRA (rank 64, alpha 128) |
| Data | ~5,000 filtered pairs |
| Hardware | RunPod A100 80GB ($2/hr) |
| Duration | ~2 hours |
| Framework | Axolotl or LLaMA-Factory |
| Epochs | 3 |

### 6.4 Evaluation

- 50 blind test questions answered by Claude AND fine-tuned Qwen
- Hindi native speaker rates both on: accuracy, naturalness, persona, helpfulness
- Target: fine-tuned Qwen rated ≥80% as good as Claude
- A/B test with 10 beta users

### 6.5 Costs

| Item | Cost | Frequency |
|------|------|-----------|
| Claude API for training data (6K pairs) | ~$90 | One-time |
| RunPod A100 for fine-tuning | ~$4 | One-time (per iteration) |
| Quality review | $0 (your time) | One-time |
| **Total initial** | **~$95** | **One-time** |
| Re-training (quarterly, with new data) | ~$30 | Quarterly |

---

## 7. Revenue Projections

| Users | Questions/mo | Revenue/mo | Server cost | Margin |
|-------|-------------|-----------|------------|--------|
| 50 | 150 | ₹7,350 ($86) | $17 | 80% |
| 200 | 1,000 | ₹49,000 ($575) | $17 | 97% |
| 500 | 4,000 | ₹1,96,000 ($2,300) | $17 | 99% |
| 1,000 | 8,000 | ₹3,92,000 ($4,600) | $150 | 97% |
| 5,000 | 50,000 | ₹24,50,000 ($28,800) | $300 | 99% |

---

## 8. Implementation Timeline

| Week | Milestone |
|------|-----------|
| 1 | Question classifier + computation routing (connect existing engines) |
| 2 | Generate 6,000 training pairs via Claude |
| 3 | Fine-tune Qwen 14B, evaluate quality |
| 4 | Build UI: question screen, answer display, payment flow |
| 5 | Beta test with 10 users (free credits) |
| 6 | Launch with Razorpay + Stripe integration |

---

## 9. Technical File Structure

```
src/lib/brihaspati/
├── classifier.ts          # Question → category + sub-intent routing
├── router.ts              # Category → engine orchestration
├── handlers/
│   ├── career.ts          # Career question computation
│   ├── marriage.ts        # Marriage question computation
│   ├── health.ts          # Health question computation
│   ├── finance.ts         # Finance question computation
│   ├── timing.ts          # "When will X happen?" computation
│   ├── remedies.ts        # Remedy recommendation
│   ├── compatibility.ts   # Matching computation
│   ├── transit.ts         # Transit impact computation
│   ├── dasha.ts           # Dasha period analysis
│   └── general.ts         # Full chart reading
├── narration/
│   ├── prompt-builder.ts  # Builds system prompt + structured input for LLM
│   ├── inference.ts       # Calls self-hosted Qwen via HTTP
│   └── fallback.ts        # Template-based fallback if LLM is down
├── credits/
│   ├── types.ts           # Credit, Purchase, Plan types
│   ├── credit-manager.ts  # Check/deduct/add credits
│   └── plans.ts           # Pricing tiers
└── types.ts               # Question, Answer, Category types

src/app/api/brihaspati/
├── ask/route.ts           # POST: submit question, deduct credit, return answer
├── credits/route.ts       # GET: check remaining credits
└── purchase/route.ts      # POST: buy credits via Stripe/Razorpay

src/app/[locale]/brihaspati/
├── page.tsx               # Question input + answer display
├── layout.tsx             # SEO metadata
└── history/page.tsx       # Past questions and answers
```

---

## 10. Competitive Advantages

| vs. | Their weakness | Our strength |
|-----|---------------|-------------|
| **AstroSage** | Human astrologers (₹9–35/min, inconsistent quality) | Instant, consistent, grounded in Swiss Ephemeris computation |
| **ChatGPT/Gemini** | Hallucinate Jyotish rules, no real chart computation | Real planetary positions, verified against Prokerala |
| **Other AI astrology apps** | LLM-only (expensive, generic) | Deterministic engine + LLM narration (accurate + eloquent) |
| **Local pandits** | ₹500–2,000, appointment needed | ₹49, instant, available 24/7 |

---

## 11. Risk Mitigation

| Risk | Mitigation |
|------|-----------|
| LLM narration quality too low | Template-based fallback (still personalised, just less fluid) |
| User asks something outside our scope | Classifier detects "out of scope" → polite refusal + redirect |
| Wrong astrological interpretation | Computation engine is deterministic + tested against reference sources. LLM cannot override computed data. |
| Hindi quality complaints | Fine-tune on native Hindi examples. A/B test with Hindi speakers before launch. |
| Low conversion to paid | Free "preview" answer (first 3 lines) + paywall for full reading |
| Server downtime | Template fallback serves answers without LLM. Degraded but functional. |
