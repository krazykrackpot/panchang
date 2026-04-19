# Feature Spec 08: Detailed Compatibility Report

**Tier:** 2 — Strong retention, 4–5 days
**Priority:** 5th in custom order (after 14, 15, 13, 11)
**Status:** Spec Complete

---

## What It Does

Extends the existing Ashta Kuta matching (36-point score) into a full narrative compatibility report. Analyzes cross-chart aspects, Manglik dosha comparison, Nadi dosha depth, house-lord exchanges, Venus/Mars/7th house analysis, and dasha compatibility — producing a PDF-worthy report that tells the story of a relationship.

## Why It Matters

- **#1 use case in Indian matrimonial astrology.** A detailed report (not just a number) is what pandits charge ₹2,000+ for.
- **PDF export potential:** users want to print/share this with family. The jsPDF infrastructure exists.
- **Upgrade path:** this is a natural premium feature if paywall is ever re-introduced.

---

## Core Analysis Sections

1. **Ashta Kuta Summary** (existing — enhanced presentation)
   - All 8 kutas with detailed explanation of each score
   - Dosha exceptions and cancellations

2. **Cross-Chart Planetary Aspects**
   - His Mars in her 7th house → attraction + conflict analysis
   - His Venus-her Moon aspects → emotional compatibility
   - His Saturn-her Sun aspects → authority dynamics

3. **Manglik Dosha Analysis**
   - Mars in 1/2/4/7/8/12 from Lagna AND Moon in both charts
   - Cancellation conditions (Mars in own sign, Jupiter aspect, etc.)
   - Severity grading: mild/moderate/severe

4. **Nadi Dosha Deep Dive**
   - Same Nadi → potential health issues for progeny (classical view)
   - Nakshatra-level analysis (not just Nadi type)
   - Cancellation conditions

5. **Venus & 7th House Analysis**
   - Venus placement, dignity, and aspects in both charts
   - 7th house lord placement and mutual aspects
   - Darakaraka (Jaimini spouse significator) comparison

6. **Dasha Compatibility**
   - Current + upcoming major dasha periods
   - Whether dasha lords are mutual friends or enemies
   - Timeline overlay (simplified version of spec #06)

7. **Narrative Summary**
   - Rules-based (not LLM) — templates + conditions → 500-800 word synthesis
   - Strengths, challenges, remedies, best periods

## Page: `/matching/report`

- Input: two chart IDs or manual birth details
- Output: tabbed report with all sections above
- "Download PDF" button → jsPDF-generated document
- "Share" → generates a unique URL with obfuscated data

## Learning Page: `/learn/matching/detailed-report`

Topics: beyond the 36 points — what Ashta Kuta doesn't cover, cross-chart aspects, why timing matters (dasha compatibility), classical texts on marriage compatibility (Muhurta Chintamani, Kalaprakashika).

## Effort: ~4-5 days
