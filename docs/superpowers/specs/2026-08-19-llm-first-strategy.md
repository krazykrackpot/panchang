# LLM-first acquisition strategy — 30-day plan

**Date:** 2026-08-19
**Author:** brainstormed with Claude in-session; user-approved after cost check.
**Status:** design approved; awaiting implementation-plan handoff.
**Priority:** Complements — does not supersede — the SEO monitor/Bengali/titles
spec at `2026-08-17-seo-monitor-and-bengali-pillar-design.md`. Both live.

## Context

Attribution query on 2026-08-19 revealed **ChatGPT (19 users) already beats
Google (17 users)** as an acquisition source, out of 102 attributed users.
This is inversely proportional to effort — we've invested heavily in Google
SEO with mediocre returns (rank slides, content bloat, competitor lock-in
by Kalnirnay/Drik with 15+ years of domain authority), while LLM referrals
happened accidentally with zero deliberate work.

User priorities (stated explicitly):

- **Bottleneck is acquisition, not retention.**
- **No new Vercel costs.** Cost reduction from 2026-05-27 must not be reverted.
- **No LLM inference costs.** Our engine is pure astronomical computation;
  we don't pay per query.

The strategic bet: **spend one focused month deliberately on LLM discovery.**
If the accidental channel is already outperforming the deliberate one, deliberate
attention to it should move the needle further and faster than more Google work.

## Constraints

- Zero net-new hosted infrastructure that scales with usage. MCP tools ship
  as locally-executed npm packages, not hosted endpoints.
- Any hosted public API additions must be edge-cached (`s-maxage`) so
  incremental calls don't hit compute.
- Content and outreach work is user-time-only, no infra cost.
- Measurement additions must be trivial (one row in Supabase per event).

## Non-goals

- Not a Google-abandonment plan. GSC monitor, Bengali pillar, title fixes
  from the earlier spec still ship — they're structural hygiene, not
  competing with this.
- Not a rebranding — Dekho Panchang stays a computation-first Vedic
  astrology platform. LLM-first is a *distribution* strategy, not a
  product pivot.
- Not chasing every AI trend. Focused on MCP + Perplexity Publishers +
  content structure + measurement. Skipping AI-generated content, AI SEO
  tools, LLM SEO agencies.

## Scope: four one-week bets, sequenced by leverage

### Week 1 — Infrastructure (highest leverage, zero-cost)

**W1.1 Ship `@dekhopanchang/mcp` — locally-run MCP server for Vedic astronomy.**

- Package published to npm. Claude Desktop / Cursor / Windsurf / any MCP
  client installs via config.
- Exposes tools: `getPanchang(date, lat, lng)`, `getKundali(birth)`,
  `getMuhurat(activity, dateRange)`, `getMatching(personA, personB)`,
  `getTransits(natalChart, date)`.
- All computation runs on the user's machine using our Swiss Ephemeris
  bindings. **We pay zero server cost per call.** Users get sub-second
  responses (no network round-trip).
- Repo: new folder `packages/mcp-server/` in the main repo (monorepo
  addition) OR separate GitHub repo — decision TBD in implementation plan.
- Distribution: npm + a landing page at `/mcp` explaining "add this to
  your Claude Desktop config."

**W1.2 Register with LLM/AI directories.**

Zero-cost sign-ups:

- [Perplexity Publishers program](https://perplexity.ai/publishers) — declares
  ourselves as content provider; unlocks better indexing.
- Anthropic content preferences (via robots.txt directives that Claude's
  crawler respects; we already allow crawling but should make explicit).
- OpenAI GPTBot allow-list confirmation.
- ChatGPT-User (browsing bot) allow.
- Register `@dekhopanchang/mcp` in the [Anthropic MCP server directory](https://github.com/modelcontextprotocol/servers)
  and MCPHub.

**W1.3 Extend `/api/llms/today` with edge caching + LLM citation headers.**

- Ensure `Cache-Control: public, s-maxage=3600, stale-while-revalidate=86400`.
  Verify actual header at production.
- Add `Link: <https://dekhopanchang.com/llms.txt>; rel="describedby"` header —
  LLM crawlers with tool-use can discover our catalog.
- Zero net compute cost (endpoint already exists; adding headers is free).

### Week 2 — Content (also zero-cost)

**W2.1 Rewrite top 4 highest-traffic pages in direct-answer format.**

Target pages (from Aug 17 GSC diagnostic):

- `/en/panchang` — Q: "What is today's panchang?" → answer in first paragraph
- `/en/kundali` — Q: "What is my kundali?" → answer flow with tool CTA
- `/en/matching` — Q: "Are we compatible in Vedic astrology?" → 36-point Ashta Kuta explanation
- `/en/muhurta-ai` — Q: "When is an auspicious time to X?" → engine flow

Direct-answer format = question in first sentence, answer in the next two.
Then supporting content. This is how LLMs prefer to cite (they pluck
sentence-level assertions).

**W2.2 Add `citation` block to every computed API response.**

Extend the existing `/api/llms/today` citation pattern to:

- `/api/kundali` response
- `/api/muhurta` response
- `/api/panchang` response

Format:

```json
{
  "data": { ... },
  "citation": {
    "source": "Dekho Panchang (dekhopanchang.com)",
    "engine": "Swiss Ephemeris DE441",
    "ayanamsha": "Lahiri (Chitrapaksha, Indian government standard)",
    "methodology": "https://dekhopanchang.com/en/about/methodology",
    "attribution": "Cite as: Dekho Panchang — Vedic Astrology Platform, 2026"
  }
}
```

Zero cost — additive fields in existing responses.

**W2.3 Publish one AI-comparison Medium article.**

Working title: "I fed my birth chart to 20 AI chatbots. Here's what happened."

- Comparison piece: ask ChatGPT, Claude, Gemini, Perplexity, plus 15
  smaller LLMs the same three Vedic-astrology questions. Show which
  hallucinate, which cite sources, which get computation wrong.
- Positions dekhopanchang.com as the tool that "actually computes" vs
  LLMs that guess. Ends with "and here's the MCP server that lets your
  AI agent get it right."
- Zero cost. User-time-only. UTM `campaign=ai-comparison`.
- Follow the article-voice memory rules (`feedback_article_voice`) —
  British English, no fabricated dialogue, no performed humility,
  no title-pattern-copying from prior articles.

### Week 3 — Outreach (time-only)

**W3.1 MCP server announcements.**

Post the MCP package (with a short "why it exists" hook) in:

- r/ClaudeAI · r/LocalLLaMA · r/singularity
- r/hinduism · r/vedicastrology · r/astrology (be respectful of subreddit rules — some ban self-promo; check first)
- Claude Desktop Discord · Anthropic developer Discord
- HN Show HN (or wait 2-3 days after npm publish so it has downloads to show)

**W3.2 Directory submissions.**

- Product Hunt "AI Tools" category
- ClaudeMind directory
- MCPHub directory
- "Awesome MCP Servers" GitHub list (open a PR)

**W3.3 Answer real questions.**

Pick 10 open Reddit/Twitter/HN questions per week about Vedic astrology,
kundali, muhurat, panchang. Answer substantively with our tool linked.
Do NOT spam. This is the same pattern that drove the D60 article's traffic.

### Week 4 — Measurement + iterate

**W4.1 Better LLM-referral tracking.**

Extend the `utm_visits` referrer categoriser to recognise:

- `chatgpt.com`, `chat.openai.com`
- `claude.ai`, `claude.anthropic.com`
- `perplexity.ai`
- `you.com`
- `gemini.google.com`
- `copilot.microsoft.com`
- Referrer-less visits with `?utm_source=chatgpt` or similar (LLMs increasingly append)

Add a bucket per LLM source in the dashboard query used in
`scripts/gsc-page-queries.mjs` and the daily signup query used in the
`/health` skill.

**W4.2 MCP telemetry (privacy-conscious).**

The MCP server is user-local, but the landing page at `/mcp` can capture
install intent — hit counter, "add to Claude Desktop" button clicks. No
personal data; just aggregate.

Optionally: if the MCP calls a `dekhopanchang.com/api/mcp/verify` endpoint
on first install (to log the version + user's Node.js version, no other
data), we get an install count. Debatable — some users will read this as
telemetry-they-didn't-ask-for. Default: **no phone-home**. Reconsider only
if we can't estimate installs from npm download stats alone.

**W4.3 Retro: which axis moved the needle.**

Success is measured by three deltas at T+30d from Week 1 start:

- **Signups from LLM referrers:** 19 → ≥40 (2× increase)
- **`/mcp` page visits:** 0 → ≥500
- **npm downloads of `@dekhopanchang/mcp`:** 0 → ≥100

If ≥2 of 3 hit, extend the plan. If ≤1 hit, retro why and either double down or move on.

## Cost accounting

| Axis | Cost delta | Notes |
|---|---|---|
| MCP package (local execution) | **Zero** | Users' machines run our engine |
| Directory registrations | Zero | Sign-up forms only |
| Citation blocks in API responses | Zero | Additive JSON fields |
| Content rewrites | Zero | Edits to existing files |
| Medium article | Zero | External platform |
| Community outreach | Zero | User time only |
| LLM-referral tracker extension | Zero | Extends existing query |
| MCP telemetry | Zero (if we skip phone-home; ~$0.01/mo if we don't) | Defer decision |
| **Total** | **Zero** | Explicitly cost-neutral by design |

The one theoretical cost risk — a hosted MCP endpoint scaling with usage — is
avoided by design: **the MCP server ships as a locally-executed npm package**.
No hosted-per-call cost.

## Risks

- **MCP as a technology is early.** If adoption stalls or the protocol shifts,
  the package becomes maintenance debt. Mitigation: pin to MCP spec version;
  package is < 200 lines wrapping existing engine.
- **npm publish + attribution requires a GitHub org / npm account.** Assumes
  we already have one — verify at implementation.
- **Medium article risks running afoul of `feedback_no_competitor_references`
  memory rule** (never name Prokerala/Drik/Shubh in marketing). The AI-comparison
  article names LLMs, not astrology competitors — should be fine, but review
  the draft against that rule before publish.
- **Perplexity Publishers program may require verification steps** (domain
  ownership, contact email). Trivial but not instant.
- **The 2× signup lift is aspirational.** LLM referral attribution is famously
  lossy (subdomains stripped, no-referrer visits from ChatGPT app). Actual
  measured lift might understate real lift by 2-3×. Retro should account for this.

## Explicit follow-ups deferred

- Building our own AI chat product using our engine as backend — retention play,
  not acquisition. Out of scope.
- Sponsored placement in AI tools directories (some accept payment for
  featured listings). Not cost-neutral, defer.
- Building an LLM-facing API SDK in Python (for AI/ML developer audience).
  Ship if MCP package sees uptake.
- Contacting AI news outlets (VentureBeat, The Information) for coverage of
  the MCP release. Speculative.

## Sequencing note

**Week 1's MCP server is the single highest-leverage bet.** It creates
distribution independent of anyone's algorithm — every AI agent that
gains MCP support becomes a distribution channel. Prioritise it above
all else. Weeks 2-4 are amplification.

## Coexistence with the 2026-08-17 SEO spec

The earlier spec (`2026-08-17-seo-monitor-and-bengali-pillar-design.md`)
ships **structural hygiene** — GSC alert fix, Bengali page depth, title
rewrites. It shipped as one 3-part feature branch and is orthogonal to
this strategy. Both plans live simultaneously.

If forced to pick sequence: **ship the MCP server (W1 of this spec) first**,
then the SEO monitor fix (Part A of the other spec) — the former is a
distribution bet, the latter is measurement infra. Content-heavy work in
both specs (Bengali pillar, direct-answer rewrites) can happen in parallel
by different sessions.
