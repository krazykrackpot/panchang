// Compute month-to-date WhatsApp send cost and decide whether to alert
// or auto-pause sends. Used by:
//   - /api/cron/whatsapp-cost-rollup (daily at 23:00 UTC)
//   - /api/cron/whatsapp-daily-panchang (inline pre-check every tick)
//
// Budget cap is read from WHATSAPP_MONTHLY_BUDGET_USD env (default 25
// per the locked decision in §14 of the spec).

import type { SupabaseClient } from '@supabase/supabase-js';

// Default monthly budget if env var is unset or malformed. Locked at $25
// per the spec §14 user decision.
const DEFAULT_MONTHLY_BUDGET_USD = 25;

/**
 * Parse WHATSAPP_MONTHLY_BUDGET_USD env safely. NaN/missing/empty all fall
 * back to DEFAULT_MONTHLY_BUDGET_USD. Negative values also fall back —
 * "fail safe" by keeping the cap at the documented default if an operator
 * fat-fingers the env var. (Gemini PR #706 round-4 MED)
 */
export function getMonthlyBudgetUsd(): number {
  const raw = process.env.WHATSAPP_MONTHLY_BUDGET_USD?.trim();
  if (!raw) return DEFAULT_MONTHLY_BUDGET_USD;
  const parsed = parseFloat(raw);
  if (!isFinite(parsed) || parsed < 0) return DEFAULT_MONTHLY_BUDGET_USD;
  return parsed;
}

export function getMonthlyBudgetMicros(): number {
  return Math.round(getMonthlyBudgetUsd() * 1_000_000);
}

export interface CostSnapshot {
  /** Month-to-date cost in USD. */
  mtdUsd: number;
  /** Hard cap in USD from env (defaults to 25). */
  budgetUsd: number;
  /** mtdUsd / budgetUsd; >= 1 means cap reached. */
  fraction: number;
  /** Bands matched at the time of snapshot. */
  alertLevel: 'none' | 'warn-80' | 'cap-100';
  /** Number of sends contributing to this MTD value. */
  messages: number;
  /** Number of sends that already got skipped this month for budget. */
  skippedBudget: number;
}

export async function snapshotMtdCost(
  supabase: SupabaseClient,
): Promise<CostSnapshot> {
  const budgetUsd = getMonthlyBudgetUsd();

  const monthStart = new Date();
  monthStart.setUTCDate(1);
  monthStart.setUTCHours(0, 0, 0, 0);

  // Aggregate cost_micros + counts in one round-trip via group-by status.
  // PostgREST .select() with .group= isn't yet exposed; we fetch the rows
  // and aggregate client-side. At pilot scale (~750 sends/mo) this is
  // sub-millisecond; revisit if MTD ever exceeds 100k rows.
  const { data, error } = await supabase
    .from('whatsapp_send_log')
    .select('cost_micros, status')
    .gte('sent_at', monthStart.toISOString());

  if (error) {
    console.error('[wa-cost-rollup] query failed:', error);
    return {
      mtdUsd: 0,
      budgetUsd,
      fraction: 0,
      alertLevel: 'none',
      messages: 0,
      skippedBudget: 0,
    };
  }

  let mtdMicros = 0;
  let messages = 0;
  let skippedBudget = 0;
  for (const row of data ?? []) {
    if (row.status === 'skipped_budget') {
      skippedBudget++;
      continue;
    }
    if (row.status === 'skipped_paused') continue;
    mtdMicros += Number(row.cost_micros ?? 0);
    messages++;
  }

  const mtdUsd = mtdMicros / 1_000_000;
  const fraction = budgetUsd > 0 ? mtdUsd / budgetUsd : 0;
  const alertLevel: CostSnapshot['alertLevel'] =
    fraction >= 1 ? 'cap-100' : fraction >= 0.8 ? 'warn-80' : 'none';

  return { mtdUsd, budgetUsd, fraction, alertLevel, messages, skippedBudget };
}

/** Human-readable summary line for logs and emails. */
export function summarizeCost(s: CostSnapshot): string {
  return (
    `MTD WhatsApp cost: $${s.mtdUsd.toFixed(2)} of $${s.budgetUsd.toFixed(2)} ` +
    `(${(s.fraction * 100).toFixed(1)}%), ${s.messages} messages` +
    (s.skippedBudget > 0 ? `, ${s.skippedBudget} skipped` : '')
  );
}
