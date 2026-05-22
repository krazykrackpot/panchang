# Brihaspati Infrastructure & Training Plan

**Date:** 2026-05-21
**Branch:** `feat/brihaspati-ai-astrologer`
**Status:** Working document — finalised once each phase is executed and verified.
**Companion to:** `docs/superpowers/specs/2026-05-21-brihaspati-ai-astrologer-design.md` (the product spec) and `docs/brihaspati/PLAN.md` (background analysis).

> **2026-05-21 update — Self-hosting deferred.** Hetzner ARM (CAX) capacity is unavailable across all locations as of this date. Combined with the per-question economics — Claude Sonnet 4.6 costs ~$0.012 per answered question vs ~98% gross margin at ₹49 retail — **launch runs on Claude API (Tier 2) + templates (Tier 0) only**. The self-hosted Qwen tier (Phases 1, 2, 5) is now **fast-follow**, triggered when API spend crosses ~$200/month (≈15k paid questions/month) OR when CAX comes back in stock at a price that materially undercuts API. **Phase 3 (training) is reframed**: it runs against real production Q&A pairs captured by the spec's §11 data flywheel from day 1 — not synthetic Claude-generated charts. The Phase-1/2 playbook below remains valid for the eventual self-host milestone; nothing about the host setup needs to change when we revisit it.

This document covers the steps the **product spec** intentionally leaves out: how the data flywheel feeds future fine-tuning, how to stand up the self-hosted Qwen tier when its trigger fires, and how to wire everything to the Vercel app without merging anything to `main` until the whole stack is regression-clean on this feature branch.

---

## Guardrails (read before doing anything)

1. **No merges to `main` until §10 (Test & Regression Plan) is fully green.** Every commit lives on `feat/brihaspati-ai-astrologer`. Preview deploys are the test target.
2. **No production traffic to self-hosted Qwen at launch.** Launch uses Tier 0 (templates) + Tier 2 (Claude API). Tier 1 (Qwen) comes online behind a feature flag, gets shadow-traffic compared against Tier 2 for ≥1 week, only then takes real traffic.
3. **Validation wall Layer 4** stays in **log-only** mode until shadow telemetry confirms <2% false-positive rate. The product spec already calls for this — repeating here because it's easy to forget when the model changes.
4. **Secrets never in git.** Hetzner SSH keys, model API tokens, Razorpay keys all live in Vercel env vars or in Coolify's secret store. Never `.env` committed.
5. **One-way doors get user approval.** Buying the GPU, signing the Hetzner annual commitment, posting fine-tuned weights to a public HF repo — pause and confirm before doing any of these.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                       USER (any country)                         │
└─────────────────────────────────────────────────────────────────┘
                              │ HTTPS
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│          VERCEL (dekhopanchang.com) — Next.js 16 app             │
│  /api/brihaspati/*  • /api/webhooks/{razorpay,stripe}            │
│  Supabase Postgres (RLS) for questions + credits                 │
└──────────────────────────┬──────────────────────────────────────┘
                           │ inference call
            ┌──────────────┼──────────────┐
            ▼              ▼              ▼
       ┌─────────┐    ┌─────────┐    ┌─────────────┐
       │ Tier 2  │    │ Tier 1  │    │  Tier 0     │
       │ Claude  │    │ Qwen 14B│    │ Templates   │
       │  API    │    │ Hetzner │    │ (in-app)    │
       └─────────┘    └─────────┘    └─────────────┘
       launch        fast-follow      always present
                          │
                          │ tunnelled via Cloudflare
                          ▼
                ┌─────────────────────┐
                │ HETZNER (DE/FI)     │
                │ Coolify on CAX41    │
                │ ├ llama.cpp server  │
                │ │  (Qwen 14B Q4)    │
                │ ├ caddy reverse-px  │
                │ ├ prometheus        │
                │ └ grafana           │
                └─────────────────────┘
```

Routing is decided in `src/lib/brihaspati/narration/inference.ts`:

1. If `BRIHASPATI_QWEN_ENABLED=true` AND health check passes AND not a kundali "first reading" → try Tier 1.
2. Otherwise → Tier 2 (Claude API).
3. On any inference failure or Layer 4 validation failure → retry next tier down.
4. Final fallback → Tier 0 (templates).

---

## Phase 0 — Pre-requisites

- [ ] Hetzner Cloud account created with EU billing
- [ ] Project name in Hetzner: `dekho-panchang-brihaspati`
- [ ] Cloudflare DNS already controls `dekhopanchang.com` (confirmed in memory)
- [ ] Decide subdomain: **`brihaspati-api.dekhopanchang.com`** (proposed) — private-API style, not exposed in user-facing UI
- [ ] SSH key for Hetzner: generate `~/.ssh/hetzner_brihaspati_ed25519` (passphrase, NOT password-less)
- [ ] Anthropic API key already provisioned (`ANTHROPIC_API_KEY`) — confirm in Vercel envs
- [ ] HuggingFace account + access token (for model download). Read-only token is enough.
- [ ] Razorpay keys obtained for Brihaspati merchant account (separate from subscriptions if compliance wants)
- [ ] Cost confirmation: ~CHF 20–30/month for Hetzner CAX41 + bandwidth. User signs off before phase 1.

---

## Phase 1 — Hetzner + Coolify Provisioning  *[DEFERRED 2026-05-21]*

> **Status:** Deferred. CAX series unavailable at the time of the launch decision. This playbook is kept verbatim so the work isn't re-derived when we trigger the self-host milestone. **Skip this phase for launch.**
>
> **Updated pricing (2026-05):** CAX41 is now ~€34.04/mo (was €15.90 in older PLAN.md). With Hetzner backups (+20%) that's ~€40.85/mo. Triggering condition for revisit: see "Self-hosting trigger conditions" at the end of this document.

### 1.1 Provision the server

- [ ] Create Hetzner Cloud server:
  - Type: **CAX41** (16 vCPU ARM Ampere, 32 GB RAM, 320 GB NVMe)
  - Location: **Falkenstein (fsn1)** or **Helsinki (hel1)** — Falkenstein has lower latency to Vercel's Frankfurt edge
  - OS: **Debian 12** (Coolify's recommended host)
  - SSH key: the one generated in Phase 0
  - Cloud-init: enable IPv4 + IPv6
  - Backup: enable Hetzner's daily snapshots (€2/mo)
- [ ] Note the server IP. Add to `/etc/hosts` locally for now.

### 1.2 Harden the host

SSH in as root, then:

- [ ] `apt update && apt upgrade -y`
- [ ] Create non-root user `dpadmin`, add to sudo, copy SSH key, set umask 0027
- [ ] Disable root SSH and password auth in `/etc/ssh/sshd_config`:
  - `PermitRootLogin no`
  - `PasswordAuthentication no`
- [ ] `ufw allow 22/tcp && ufw allow 80/tcp && ufw allow 443/tcp && ufw enable`
- [ ] `apt install -y fail2ban` (default jail = ssh)
- [ ] `apt install -y unattended-upgrades && dpkg-reconfigure --priority=low unattended-upgrades`
- [ ] Reboot. Reconnect as `dpadmin` to confirm.

### 1.3 Install Coolify

- [ ] `curl -fsSL https://cdn.coollabs.io/coolify/install.sh | sudo bash`
- [ ] Wait ~3 min for stack (Docker + Coolify + Traefik) to come up
- [ ] Open `http://<server-ip>:8000` and complete first-run wizard
- [ ] Create admin user (use a 1Password-generated 32-char password)
- [ ] Coolify auto-provisions Let's Encrypt TLS for any domain you connect

### 1.4 DNS + TLS

- [ ] In Cloudflare: create A record `brihaspati-api.dekhopanchang.com` → Hetzner IP
- [ ] **Proxy mode: DNS-only** initially (grey cloud) so Let's Encrypt's HTTP-01 challenge works
- [ ] In Coolify: add `brihaspati-api.dekhopanchang.com` as a domain; verify auto cert issued
- [ ] After cert is live: switch Cloudflare to **proxied** (orange cloud) — gives us DDoS protection and rate-limiting
- [ ] Set Cloudflare SSL/TLS mode to **Full (strict)**

### 1.5 Inference auth shim

Vercel → Hetzner traffic must be authenticated. The model server itself has no auth.

- [ ] Inside Coolify, deploy a **Caddy** service in front of llama.cpp:
  ```caddyfile
  brihaspati-api.dekhopanchang.com {
    @authed header X-Brihaspati-Key {env.BRIHASPATI_SHARED_KEY}
    handle @authed {
      reverse_proxy llama-cpp:8080
    }
    respond 401
  }
  ```
- [ ] Generate `BRIHASPATI_SHARED_KEY` (`openssl rand -hex 32`)
- [ ] Store in Coolify secrets + Vercel envs (`BRIHASPATI_QWEN_ENDPOINT`, `BRIHASPATI_SHARED_KEY`)
- [ ] Vercel inference client always sends `X-Brihaspati-Key` header

---

## Phase 2 — Qwen 14B Self-hosted (CPU mode at launch)  *[DEFERRED 2026-05-21]*

> **Status:** Deferred along with Phase 1. The model choice (Qwen3-14B Q4_K_M GGUF, llama.cpp server) and the benchmark gates below remain the contract for the eventual self-host build.

CAX41 is ARM CPU only — that's fine for Qwen 14B Q4_K_M at ~12 tok/s, which is acceptable for the "thoughtful pandit" UX (25 s for a 300-token answer). GPU upgrade is Phase 5.

### 2.1 Choose the runtime

- **llama.cpp** (chosen) — battle-tested, ARM-optimised, OpenAI-compatible HTTP server, tiny image
- (Considered vLLM — needs CUDA, not viable on CAX41 ARM)

### 2.2 Download the model

- [ ] On Hetzner host as `dpadmin`:
  ```bash
  mkdir -p /opt/brihaspati/models && cd /opt/brihaspati/models
  # Qwen3 14B Instruct, Q4_K_M GGUF — ~9 GB
  huggingface-cli download Qwen/Qwen3-14B-Instruct-GGUF \
    qwen3-14b-instruct-q4_k_m.gguf --local-dir .
  ```
- [ ] Verify SHA-256 against the HF model card
- [ ] `chmod 400` the `.gguf` so only owner reads

### 2.3 Deploy llama.cpp via Coolify

- [ ] In Coolify, create a new "Docker compose" application:
  ```yaml
  services:
    llama-cpp:
      image: ghcr.io/ggerganov/llama.cpp:server-arm64
      restart: unless-stopped
      volumes:
        - /opt/brihaspati/models:/models:ro
      command: >
        -m /models/qwen3-14b-instruct-q4_k_m.gguf
        --host 0.0.0.0 --port 8080
        --ctx-size 8192
        --threads 14
        --parallel 2
        --cont-batching
      healthcheck:
        test: ["CMD", "curl", "-f", "http://localhost:8080/health"]
        interval: 30s
        timeout: 10s
        retries: 3
      mem_limit: 24g
  ```
- [ ] Deploy. Verify `/health` returns 200.
- [ ] Smoke test from local laptop:
  ```bash
  curl -X POST https://brihaspati-api.dekhopanchang.com/v1/chat/completions \
    -H "X-Brihaspati-Key: $KEY" -H "Content-Type: application/json" \
    -d '{"model":"qwen","messages":[{"role":"user","content":"ping"}],"max_tokens":20}'
  ```

### 2.4 Benchmark before wiring to Vercel

- [ ] Run `scripts/brihaspati-bench.ts` (to be added) — 50 representative prompts × 4 locales
- [ ] Measure: p50/p95/p99 latency, tok/s, tokens-out distribution, OOM events
- [ ] Acceptance gate before Phase 4 enables Tier 1:
  - p95 first-token < 3 s
  - p95 full-response < 35 s for 300-token answer
  - Zero OOMs over 200 sequential requests
  - Output passes Layer 4 validation in ≥95% of held-out test cases (using the existing Claude-generated answers as ground truth)

---

## Phase 3 — Training Plan (Production Data Flywheel, with Claude as bootstrap)

The product spec relies on the existing deterministic Jyotish engine — that's what Layer 1 of the validation wall protects. The LLM only narrates. We fine-tune Qwen so it narrates **specifically the way our engine outputs**, in our preferred voice, in four locales.

**Strategy (reframed 2026-05-21):** Real production Q&A pairs are the primary training corpus. Synthetic Claude-generated pairs are the bootstrap only — used to (a) fill category/locale gaps where production data is sparse, and (b) bridge until production volume reaches the launch threshold of 3,000 eligible pairs (spec §11). Production pairs are higher value because they reflect questions users actually pay to ask, in the voice we already chose, with our actual engine output.

### 3.1 Data sources

- **Primary: production Q&A pairs** captured per spec §11 from day 1 of launch. Filtered nightly by the eligibility job (`/api/cron/brihaspati-mark-eligible`). Acceptance criteria are in the spec; do not duplicate them here.
- **Secondary: synthetic Claude-generated pairs**, used as fill-in only. Pipeline below describes the synthetic path; we only run it for categories/locales where production rows are <150 at training time.

### 3.2 Synthetic bootstrap (gap-fill only)

Pipeline: `scripts/brihaspati-train/synthetic.ts` (to be added on this branch).

- [ ] **Step 1 — Identify gaps**: query training-eligible rows grouped by (`query_category`, `locale`). Any cell with <150 rows is a gap. Generate enough synthetic pairs to bring each gap cell to 150.
- [ ] **Step 2 — Sample charts**: draw from the diversity matrix in PLAN.md §6.1 (12 lagnas × 3 dasha periods × 3 yoga combos × 2 genders). All charts use real Swiss Ephemeris computation — never synthetic positions.
- [ ] **Step 3 — Generate contexts**: run the Brihaspati Layer-2 + Layer-3 input builder against each chart × the gap categories. Save to `training-data/synthetic/contexts/<chart-id>/<category>.json`. Tag with the same `engine_version` we'll filter on later.
- [ ] **Step 4 — Generate Claude gold answers**: for each context, call Claude with the **same locked system prompt** used in production (so synthetic and real pairs are stylistically aligned). Anthropic batch API + prompt caching ≈ 65% off retail.
- [ ] **Step 5 — Layer 4 filter**: run the production claim verifier. Discard failures. Expected drop rate 5–10%.
- [ ] **Step 6 — Human review**: 5% sample manually scored by a native speaker per locale (Hindi/Tamil/Bengali — the user or contracted reviewer; English by the assistant). Discard anything that reads translated rather than native.
- [ ] **Step 7 — Synthetic tagging**: every synthetic row in the export gets `source: 'synthetic'` so downstream eval can stratify and detect distribution shift between synthetic and real.

### 3.3 Trigger for the first training run

All of the following must be true:

- `count(training_eligible = true and source = 'production') >= 3,000`
- Per-cell coverage: every (`query_category`, `locale`) has ≥150 rows (production + synthetic combined)
- Claude API spend ≥ $200/month for at least 30 consecutive days OR CAX availability has returned at a price that beats API economics
- Phase 1 + Phase 2 of this document have been executed and the Hetzner box is up

Until ALL of those are true, we stay on Claude API in production and keep accruing data. The longer we wait, the better the eventual fine-tune.

### 3.2 Fine-tuning

- [ ] **Environment**: RunPod A100 80GB (~$2/hr) for the actual fine-tune. NOT the home GPU even if purchased — RunPod is faster for one-shot work and avoids tying up the workstation for ~3 h.
- [ ] **Framework**: Axolotl (recommended over LLaMA-Factory because of better Qwen3 templates as of May 2026)
- [ ] **Config**: LoRA, rank 64, alpha 128, dropout 0.05, learning rate 2e-4, cosine schedule, 3 epochs, batch size 4 with gradient accumulation 4 → effective 16
- [ ] **Training run**: ~3 hours on A100 80GB → ~$6
- [ ] **Quantise the merged result** to Q4_K_M GGUF (llama.cpp's `quantize` tool); upload to a private HF repo named `dekho-panchang/brihaspati-qwen3-14b-lora-v1`
- [ ] **Tag the dataset** with the commit hash of the engine that generated the contexts (`ENGINE_VERSION`) — so we can re-run training if the engine changes meaningfully

### 3.3 Evaluation

- [ ] **Automated** (runs on every model version):
  - Run all 500 hold-out questions through the fine-tuned model
  - Compute: Layer 4 pass rate (target ≥95%), avg output token count (target 300–500), avg cosine similarity vs gold answer (≥0.78)
  - Save to `eval-results/<model-version>.json`
- [ ] **Human** (Hindi):
  - Native Hindi speaker rates 50 pairs blind: fine-tuned Qwen vs Claude gold
  - Target: ≥80% rated "as good or better" than Claude
- [ ] **A/B test in production**:
  - Once Phase 4 ships and Tier 1 is shadow-only, every Tier 2 (Claude) answer is also generated by Tier 1 and stored. Compare validation pass rate, output length, token usage.
  - Tier 1 is promoted from shadow to traffic only after the human eval gate AND ≥1 week of shadow comparison shows Tier 1 ≥ Tier 2 on Layer 4 pass rate.

### 3.4 Re-training cadence

- Quarterly re-training using accumulated real user Q&A pairs as additional training data
- Plus: any time `ENGINE_VERSION` materially changes (yoga rules, dasha math, dignity tables), re-generate at least the 500 hold-out evaluation set and confirm pass rate hasn't regressed
- Cost per re-train: ~$30 (data gen) + ~$6 (fine-tune) = ~$36

---

## Phase 4 — Production Wiring

### 4.1 Vercel env vars (preview AND production)

Use `vercel env add` (or `vercel-plugin:env`):

```
ANTHROPIC_API_KEY=<existing>
BRIHASPATI_QWEN_ENDPOINT=https://brihaspati-api.dekhopanchang.com
BRIHASPATI_SHARED_KEY=<from Coolify>
BRIHASPATI_QWEN_ENABLED=false          # flip true only after shadow validation
BRIHASPATI_QWEN_SHADOW_RATIO=1.0       # 1.0 = shadow every Tier 2 call
BRIHASPATI_LAYER4_BLOCK=false          # log-only at launch
RAZORPAY_KEY_ID=<new>
RAZORPAY_KEY_SECRET=<new>
STRIPE_PRICE_BRIHASPATI_SINGLE=<new>
STRIPE_PRICE_BRIHASPATI_PACK_5=<new>
STRIPE_PRICE_BRIHASPATI_MONTHLY=<new>
STRIPE_PRICE_BRIHASPATI_ANNUAL=<new>
```

### 4.2 Inference client (`src/lib/brihaspati/narration/inference.ts`)

Reference flow (pseudo):

```typescript
import { after } from 'next/server';

export async function narrate(ctx: BrihaspatiContext): Promise<NarrateResult> {
  if (process.env.BRIHASPATI_QWEN_ENABLED === 'true' && await qwenHealthy()) {
    try { return await callQwen(ctx); }
    catch (err) { console.error('[brihaspati] qwen failed, falling back to claude:', err); }
  }

  // Shadow mode: also call Qwen, persist for comparison. Use Next.js after() so
  // Vercel's Fluid Compute keeps the function alive until the shadow call
  // completes, after the user's response has streamed. A bare fire-and-forget
  // promise would be terminated when the response finishes.
  const shadowRatio = Number(process.env.BRIHASPATI_QWEN_SHADOW_RATIO || 0);
  if (shadowRatio > 0 && Math.random() < shadowRatio) {
    after(async () => {
      try {
        const shadow = await callQwen(ctx);
        await saveShadowResult(ctx, shadow);
      } catch (err) {
        console.error('[brihaspati] shadow:', err);
      }
    });
  }

  try { return await callClaude(ctx); }
  catch (err) {
    console.error('[brihaspati] claude failed, falling back to template:', err);
    return await callTemplate(ctx);
  }
}
```

Universal-rule compliance: every `catch` logs with `[brihaspati]` tag and surfaces via the template fallback — never silent. Shadow comparison runs via `after()` rather than fire-and-forget; if `after()` is unavailable in the runtime (older Next.js versions), the fallback is to `await` the shadow call inline and accept the latency.

### 4.3 Cloudflare protection

- [ ] Cloudflare WAF rule: rate-limit `brihaspati-api.dekhopanchang.com` to 60 req/min per IP
- [ ] Bot Fight Mode: on (lightweight)
- [ ] Mandatory header check: requests missing `X-Brihaspati-Key` are blocked at the edge (defence in depth — Caddy also checks)

### 4.4 Observability

- [ ] Coolify includes a Prometheus + Grafana stack — enable it
- [ ] Export llama.cpp metrics via `--metrics` flag → scrape via Prometheus
- [ ] Grafana dashboards (templates in `infra/grafana/`):
  - **Inference**: req/s, tok/s, p95 latency, error rate, queue depth
  - **Memory**: RSS, GC events, container OOM events
  - **Comparison**: shadow Qwen vs Claude — Layer 4 pass rate, output token delta, semantic similarity (offline)
- [ ] Alerting via Coolify webhooks → Resend email to user when:
  - `/health` fails for 3+ minutes
  - Error rate >5% over 5 minutes
  - Layer 4 pass rate <90% over 1 hour

---

## Phase 5 — GPU Upgrade Trigger (not at launch)

Move from CAX41 (CPU) to Hetzner GPU server when **any** of these is true:

- p95 full-response latency >40s sustained over 2+ days
- Concurrent request queue depth >5 sustained for >30 min/day
- ≥500 paying monthly subscribers
- Adopting Qwen3 32B or a 27B successor (CPU can't keep up)

When triggered:

- [ ] Provision Hetzner GPU instance with L40S 48GB (~€150/mo)
- [ ] Same Coolify install playbook
- [ ] Re-quantise model: Q5_K_M or FP16 (GPU has headroom)
- [ ] Run dual-deploy for 48 h, then DNS cut-over
- [ ] Keep CAX41 as warm standby for 1 week

---

## Phase 6 — Feature-Branch Deployment & Preview

This branch must get a **preview deployment** on Vercel for end-to-end testing without touching `main`. Vercel auto-creates preview URLs for every pushed branch.

- [ ] Push branch: `git push -u origin feat/brihaspati-ai-astrologer` (user-approved before push)
- [ ] Vercel preview URL pattern: `https://panchang-git-feat-brihaspati-ai-astrologer-<team>.vercel.app`
- [ ] In Vercel project settings → Environment Variables, ensure all Brihaspati env vars are set for **Preview** scope as well as Production
- [ ] Add a banner to the preview build: a small "PREVIEW" badge top-right so testers know they're on the feature branch
- [ ] **Disable bot indexing** for preview: confirmed in `next.config` already, but spot-check `/robots.txt` returns `Disallow: /` for non-prod origins

---

## Phase 7 — Razorpay & Stripe Setup

### 7.1 Razorpay (INR)

- [ ] In Razorpay dashboard, create:
  - **Plan: Brihaspati Single** (₹49)
  - **Plan: Brihaspati 5-Pack** (₹199, one-time)
  - **Plan: Brihaspati Monthly** (₹299/month, recurring)
  - **Plan: Brihaspati Annual** (₹1,999/year, recurring)
- [ ] Webhook endpoint: `https://dekhopanchang.com/api/brihaspati/webhook/razorpay`
- [ ] Events subscribed: `payment.captured`, `payment.failed`, `subscription.activated`, `subscription.cancelled`, `subscription.charged`, `refund.created`
- [ ] Webhook secret → Vercel env `RAZORPAY_WEBHOOK_SECRET_BRIHASPATI`
- [ ] Test mode: run full flow on preview URL with test card `4111 1111 1111 1111` before going live

### 7.2 Stripe (USD)

- [ ] Create four Products + Prices in Stripe dashboard
- [ ] Webhook endpoint: `https://dekhopanchang.com/api/brihaspati/webhook/stripe`
- [ ] Events: `checkout.session.completed`, `payment_intent.succeeded`, `payment_intent.payment_failed`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.paid`, `invoice.payment_failed`, `charge.refunded`
- [ ] Webhook signing secret → Vercel env (`STRIPE_WEBHOOK_SECRET_BRIHASPATI`)
- [ ] Enable **Stripe Tax** for cross-border VAT (EU, UK)
- [ ] Test with `4242 4242 4242 4242` on preview

---

## Phase 8 — Supabase Schema Migration

- [ ] Migration file: `supabase/migrations/028_brihaspati.sql` (next sequence number after 027)
- [ ] Contents: the `brihaspati_questions` + `brihaspati_credits` tables from the spec §Backend, plus the `user_profiles.brihaspati_subscription` jsonb column
- [ ] All triggers (if any) follow CLAUDE.md rules: `SECURITY DEFINER`, `SET search_path = public`, `EXCEPTION WHEN OTHERS THEN RETURN NEW`, `ON CONFLICT ... DO NOTHING`
- [ ] RLS: users select their own rows only; all writes via service-role from API routes
- [ ] **Apply to staging Supabase first** (`npx supabase db query --linked --file supabase/migrations/028_brihaspati.sql` against a staging project)
- [ ] Verify signup still works (`curl -X POST .../auth/v1/signup`) — the auth.users trigger sanity check from CLAUDE.md
- [ ] Apply to prod ONLY after preview deploy passes §10 test plan

---

## Phase 9 — Frontend Wiring

(This is the implementation phase — included here so the rollout plan is complete; details are in the spec's Components table.)

- [ ] Build order:
  1. `BrihaspatiProvider` (context + state machine)
  2. `BrihaspatiButton` (floating)
  3. `BrihaspatiPanel` (drawer/sheet — desktop right, mobile bottom)
  4. `BrihaspatiBanner` (contextual, data-driven)
  5. `/brihaspati/history` page
  6. API routes: `/balance`, `/order`, `/`, webhook handlers
  7. Layer 2 classifier + router + handlers
  8. Layer 3 narration (prompts + inference + fallback)
  9. Layer 4 validator
  10. Telemetry events
  11. Removal of `ai_chat` and `muhurta_ai` UI surfaces
- [ ] Every component PR-sized commit; squash-merge to `feat/brihaspati-ai-astrologer` is fine but never to `main`
- [ ] All commits run through pre-push hook (`tsc --noEmit -p tsconfig.build-check.json`) — never `--no-verify`

---

## Phase 10 — Test & Regression Plan (BLOCKING — no merge without this green)

Each row below must be **demonstrably green** with evidence (screenshot, test log, vercel logs URL) attached in the eventual PR description.

### 10.1 Automated tests

- [ ] `npx tsc --noEmit -p tsconfig.build-check.json` — zero errors
- [ ] `npx vitest run` — full suite passes, including new tests:
  - Classifier accuracy on labelled corpus (≥95% per-category accuracy)
  - Layer 4 validator: known-good answers pass, planted-hallucination answers reject
  - Payment signature verification (Razorpay HMAC + Stripe signature) on positive and negative cases
  - Credit ledger: deduct, expiry, refund handling
  - Subscription state transitions (none → monthly → cancelled → none)
  - Rate limiter: 10/hr free, 60/hr subscribed
  - SSE stream: first-token latency, completion event, abort handling
- [ ] `npx next build` — zero errors, zero new warnings
- [ ] Bundle size: no route exceeds +50 kB vs `main` baseline (run `next-bundle-analyzer`)

### 10.2 Manual end-to-end (on preview URL, before promote)

Run for every combination unless otherwise noted:

**Browser matrix**: Chrome 124, Safari 17, Firefox 125, mobile Safari (iPhone 14), Chrome Android. Use real devices, not just DevTools emulation (per CLAUDE.md Lesson VI).

**Locales**: EN, HI, TA, BN. For each, verify panel UI text, prompts, banner copy, disclaimer, history page.

**Payment paths** (one full round each):
- [ ] Anonymous → Google OAuth → buy `single` via Razorpay (INR test card) → receive answer
- [ ] Anonymous → Google OAuth → buy `single` via Stripe (USD test card) → receive answer
- [ ] Logged-in, no chart → fill inline birth form → pay `pack_5` → receive answer → confirm 4 credits remain
- [ ] Logged-in with chart, no balance → pay `monthly` → ask 3 questions → confirm all 3 free
- [ ] Logged-in `monthly` → cancel mid-period via dashboard → ask question → confirm still free until expiry
- [ ] `annual` → ask question → confirm priority queue marker on row
- [ ] Payment fails → retry → succeeds → exactly one row in DB
- [ ] Payment succeeds, LLM fails → template fallback fires, user sees answer, row tier=0

**Content correctness**:
- [ ] Sample 20 answers across categories. For each, manually verify Layer 4: every planet/sign/yoga/date mentioned in the answer appears in the source kundali snapshot. Zero hallucinations.
- [ ] Compare 5 timing-question answers against Prokerala — date ranges must agree within ±2 days
- [ ] Marriage/career/health questions must end with a practical remedy and a classical reference

**Cross-cutting regression** (CLAUDE.md non-negotiables):
- [ ] Existing kundali generation flow: same numerical output as `main` (run `scripts/snapshot-diff.ts` between branches)
- [ ] Existing panchang page: tithi/nakshatra times unchanged (Bern, Delhi, Seattle — all three timezones, per `testing_strategy`)
- [ ] Existing matching page: 36-point scores unchanged for 5 reference pairs
- [ ] Auth flow: signup + signin + Google OAuth all work
- [ ] Sitemap: `/brihaspati/history` present in 4 launch locales, no static-page-budget breach (still ≤2000 static pages)
- [ ] PWA service worker: cache version bumped if any cached assets changed
- [ ] No `ai_chat` or `muhurta_ai` UI references remain (grep)
- [ ] No "Prokerala" / "Drik" / "Shubh Panchang" strings in any user-facing content (`feedback_no_competitor_references`)
- [ ] All new error paths surface to user AND log with tagged `console.error` (`feedback_never_silently_fail`)
- [ ] All new useEffects with auto-fill are guarded against `initialData` (`feedback_check_callsite_context`)

### 10.3 Load test (preview only — opt-in)

- [ ] `k6` script: 50 concurrent users asking questions over 10 minutes, mix of cached / fresh / new-user paths
- [ ] No 5xx in Vercel logs
- [ ] Hetzner Qwen instance handles ≥10 req/min without OOM (when shadow-traffic is on)

### 10.4 Pre-promotion checklist (final gate)

- [ ] All Razorpay/Stripe webhook secrets configured in Vercel **Production** envs (separate from Preview)
- [ ] Sentry / log monitoring tags Brihaspati errors distinctly (e.g. `feature: brihaspati`)
- [ ] Refund policy page (`/refunds`) is live and linked from the disclaimer
- [ ] Support email inbox configured for refund requests
- [ ] `BRIHASPATI_QWEN_ENABLED=false` in production env (Tier 1 stays off at launch)
- [ ] `BRIHASPATI_LAYER4_BLOCK=false` in production env (log-only mode at launch)
- [ ] Existing `ai_chat` / `muhurta_ai` permissions removed from `tiers.ts` (one final grep before push)
- [ ] `npx tsc --noEmit -p tsconfig.build-check.json && npx vitest run && npx next build` all green on a fresh clone

Only after every box in §10 is ticked, with evidence, does the branch get squash-merged to `main`. That one squash commit triggers one Vercel production build (per CLAUDE.md branch strategy).

---

## Phase 11 — Launch & Post-Launch Watch

- [ ] Run `vercel logs --follow` for the first 60 minutes post-promote
- [ ] Watch the telemetry funnel hourly for the first 24 h: banner → panel → payment → answer conversion
- [ ] Watch Razorpay + Stripe dashboards for unexpected refunds / chargebacks
- [ ] Day 7: review Layer 4 telemetry; if false-positive rate <2%, flip `BRIHASPATI_LAYER4_BLOCK=true`
- [ ] Day 14: review shadow Tier 1 results; if green, flip `BRIHASPATI_QWEN_ENABLED=true` with 10% traffic
- [ ] Day 21: ramp Tier 1 to 50%, then 100% if metrics hold

---

## Open questions (to resolve during build, not blocking finalisation)

1. **Subdomain choice** — `brihaspati-api.dekhopanchang.com` proposed, but if SEO surfaces start ranking for "Brihaspati", a user-facing `brihaspati.dekhopanchang.com` could be more discoverable. The API subdomain stays internal regardless; this is just whether we also create a public marketing subdomain.
2. **Webhook idempotency store** — use Postgres unique constraint on `(provider, provider_event_id)` (preferred) or rely on Razorpay/Stripe's own retry behaviour? Confirm during implementation.
3. **History pagination size** — 20 vs 50 per page. Decide after first 100 paying users — telemetry will say which scroll-depth is natural.
4. **Tamil/Bengali human reviewer** — need to identify and brief a native speaker for the eval gate before Phase 3 can complete. Action item before training run.

---

## Appendix A — Self-hosting Trigger Conditions

Self-hosted Qwen (Phases 1, 2, 5) was deferred at launch (2026-05-21) because (a) Hetzner ARM was unavailable and (b) Claude API economics give ~98% gross margin at our retail price. The data flywheel still runs from day 1 so the option is preserved.

**Revisit the self-host decision when ANY of these is true:**

| Trigger | Source of truth | What it means |
|---------|----------------|---------------|
| Claude API spend ≥ $200 / month for 30+ days | Anthropic billing dashboard | ~15k paid questions / month — savings start to justify ops overhead |
| CAX41 (or equivalent) in stock in fsn1/nbg1/hel1 | Hetzner Cloud Console | The original infra path is open again |
| p95 Claude API latency > 6s sustained 7+ days | `brihaspati_answer_streamed.latency_ms` | Self-host can be tuned for tail latency |
| Anthropic ToS/pricing change materially impacts margin | Vendor comms | Strategic risk; self-host removes single-vendor dependence |
| Validation Wall Layer 4 reject rate > 5% on Claude output | `validation_passed` aggregate | A fine-tuned model may behave more predictably for our schema |

**When triggered, the sequence is:**

1. Re-confirm Hetzner CAX (or successor) availability
2. Execute Phase 1 (provisioning) — playbook unchanged
3. Execute Phase 2 (llama.cpp + benchmark gate)
4. Export training data per Phase 3 (production-data flywheel is by then ≥3,000 rows; fill gaps with synthetic)
5. Run LoRA fine-tune on RunPod A100 (~$6)
6. Deploy fine-tuned Qwen behind a shadow flag (`BRIHASPATI_QWEN_SHADOW_RATIO=1.0`) for ≥1 week
7. Promote to primary tier only after shadow comparison shows Tier 1 ≥ Tier 2 on Layer 4 pass rate

Until then: launch on Claude API + templates. Data flywheel runs in the background. Re-evaluate quarterly even if no trigger has fired.
