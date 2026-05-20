# GPU Options: Home vs Cloud

## Your Situation
- Location: Corseaux/Vevey, Switzerland
- Electricity cost: ~0.22-0.27 CHF/kWh (expensive by global standards)
- Use cases: fine-tuning + development inference + potentially production serving

---

## Option A: Home GPU Setup

### Recommended Hardware

| Component | Option 1 (Budget) | Option 2 (Future-proof) |
|-----------|-------------------|------------------------|
| GPU | RTX 3090 24GB (used) | RTX 4090 24GB |
| Price | CHF 700-900 | CHF 1,800-2,200 |
| VRAM | 24GB | 24GB |
| Power draw | 350W under load | 450W under load |
| Inference speed (14B Q4) | ~25 tok/s | ~45 tok/s |
| Inference speed (27B Q4) | ~12 tok/s | ~22 tok/s |
| Fine-tuning (14B LoRA) | ~3 hours | ~1.5 hours |
| CPU | Any modern 6+ core | Any modern 8+ core |
| RAM | 32GB minimum | 64GB recommended |
| Total build cost | CHF 1,500-2,000 | CHF 3,000-3,500 |

### Monthly Running Cost (Home)

| Scenario | Hours/day | Power (kWh/mo) | Cost/mo (CHF) |
|----------|-----------|----------------|---------------|
| Development only (4h/day) | 4 | 42-54 | CHF 9-15 |
| Dev + serving (12h/day) | 12 | 126-162 | CHF 28-44 |
| 24/7 production | 24 | 252-324 | CHF 55-87 |

### Pros
- One-time cost (GPU holds resale value)
- Zero latency to your dev machine
- Fine-tune anytime without cloud costs
- No data leaves your premises
- Use for other projects (video generation, local LLMs, etc.)
- Swiss electricity is renewable (hydro) — guilt-free compute

### Cons
- 24/7 production serving = noise + heat in your home
- No redundancy (GPU fails = service down)
- Switzerland electricity is expensive vs cloud in Nordic countries
- You manage drivers, CUDA, cooling, UPS

---

## Option B: Cloud Only

### Development (fine-tuning + testing)

| Provider | GPU | Cost | When to use |
|----------|-----|------|-------------|
| **RunPod** | A100 80GB | $2/hr | Fine-tuning (2h sessions, ~$4/run) |
| **Vast.ai** | RTX 4090 | $0.30-0.50/hr | Development inference testing |
| **Lambda Labs** | A100 40GB | $1.10/hr | Fine-tuning + eval |

### Production Serving

| Provider | Server | Cost/mo | Speed (14B) | Speed (27B) |
|----------|--------|---------|-------------|-------------|
| **Hetzner CAX41** (CPU) | 16 ARM vCPU, 32GB | €15.90 | 12 tok/s | Too slow |
| **Hetzner GPU** | L40S 48GB | ~€150 | 50 tok/s | 35 tok/s |
| **RunPod Serverless** | A100 | ~$0.001/request | 60 tok/s | 45 tok/s |

---

## My Recommendation: Home GPU + Hetzner CPU for Production

```
┌─────────────────────┐     ┌──────────────────────┐
│   HOME (RTX 3090)   │     │  HETZNER CAX41       │
│                      │     │  (€15.90/mo)         │
│  • Fine-tuning       │     │                      │
│  • Development       │     │  • Production serve  │
│  • Testing           │     │  • 24/7 uptime       │
│  • Model experiments │     │  • Qwen 14B Q4       │
│                      │     │  • 12 tok/s          │
│  Cost: CHF 1,500     │     │  • Auto-restart      │
│  (one-time)          │     │                      │
└─────────────────────┘     └──────────────────────┘
```

### Why This Combo

1. **Home GPU for development:** Fine-tune locally (faster iteration, no cloud costs). Test different model sizes, prompts, quantisation levels. Run eval suites. Experiment freely.

2. **Hetzner CPU for production:** €15.90/month is unbeatable. 25-second response time is acceptable for a ₹49 paid reading (feels "thoughtful"). 24/7 uptime without your home GPU running all night.

3. **Upgrade path:** When you hit 200+ paying users, move production to Hetzner GPU (€150/mo) for 8-second responses. Home GPU continues as dev/fine-tuning box.

### Buy the RTX 3090 (Used)

- CHF 700-900 on Ricardo.ch, Tutti.ch, or eBay.ch
- 24GB VRAM handles everything up to 27B quantised
- Fine-tuning 14B LoRA: 3 hours (vs $4+ per session on cloud)
- After 10 fine-tuning runs, the GPU has paid for itself vs cloud costs
- Resale value in 2 years: still CHF 400-500 (these hold value)
- Can also use for: Stable Diffusion (OG images), video generation, local AI assistants

### Don't Buy the RTX 4090

- CHF 1,000+ more for ~1.8x speed improvement
- Not worth it when production runs on Hetzner anyway
- The 3090 handles everything we need for dev + fine-tuning
- If you need 4090-class speed in production, rent it from Hetzner

---

## Decision Matrix

| Factor | Home GPU | Cloud Only |
|--------|----------|-----------|
| **Fine-tuning cost** | CHF 0 (after purchase) | $4-8 per run |
| **Dev iteration speed** | Instant (no upload/download) | 10-15 min setup each session |
| **Production serving** | Not recommended (noise, reliability) | Hetzner €15.90/mo |
| **Total Year 1 cost** | CHF 1,500 + €190 (Hetzner) ≈ CHF 1,700 | €190 (Hetzner) + $200 (cloud fine-tuning) ≈ CHF 400 |
| **Total Year 2 cost** | €190 (Hetzner only) ≈ CHF 200 | €190 + $200 ≈ CHF 400 |
| **Break-even** | ~Month 18 if fine-tuning frequently | N/A |
| **Flexibility** | Maximum (any model, any experiment) | Limited to rented time |

**Bottom line:** If you plan to iterate on the model frequently (monthly re-training, testing new base models, experimenting with prompt strategies) — buy the RTX 3090. It pays for itself by month 18 and gives you unlimited experimentation.

If you just want to fine-tune once and deploy — cloud only is cheaper for the first year.

Given that Brihaspati will need quarterly re-training with new data, and you'll want to experiment with 27B vs 14B vs different base models, **the home GPU is the better investment.**
