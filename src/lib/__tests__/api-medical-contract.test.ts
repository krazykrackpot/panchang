// src/lib/__tests__/api-medical-contract.test.ts
//
// D1 — Contract tests for POST /api/medical.
//
// Regression-guards the existing response keys (prakriti, bodyMap,
// healthTimeline, diseaseProfile, healthPrognosis) AND verifies the new
// healthDiagnosis key with the correct natalElements counts per spec §8.

import { describe, it, expect } from 'vitest';
import { POST } from '@/app/api/medical/route';

// ─── Shared test birth data ────────────────────────────────────────────────
const BASE_BIRTH = {
  date: '1990-01-15',
  time: '06:30',
  lat: 28.61,
  lng: 77.21,
  timezone: 'Asia/Kolkata',
} as const;

function makeRequest(body: Record<string, unknown>): Request {
  return new Request('http://test/api/medical', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-forwarded-for': '127.0.0.1',
    },
    body: JSON.stringify(body),
  });
}

// ─── Tests ────────────────────────────────────────────────────────────────
describe('/api/medical contract', () => {
  it('returns existing keys + healthDiagnosis with 19 default elements', async () => {
    const req = makeRequest(BASE_BIRTH);
    const res = await POST(req);

    expect(res.status).toBe(200);
    const body = await res.json();

    // ── Regression guard: existing keys must remain ──────────────────────
    expect(body.prakriti).toBeDefined();
    expect(body.bodyMap).toBeDefined();
    expect(body.healthTimeline).toBeDefined();
    expect(body.diseaseProfile).toBeDefined();
    // healthPrognosis is optional (may be undefined on some charts) — check key exists
    expect('healthPrognosis' in body).toBe(true);

    // ── New key ──────────────────────────────────────────────────────────
    expect(body.healthDiagnosis).toBeDefined();
    expect(body.healthDiagnosis.natalElements).toHaveLength(19);

    // Sanity-check shape
    expect(body.healthDiagnosis.optedInToExtended).toBe(false);
    expect(Array.isArray(body.healthDiagnosis.displayedElements)).toBe(true);
    expect(body.healthDiagnosis.overall).toBeDefined();
    expect(body.healthDiagnosis.overall.rating).toBeDefined();
  });

  it('extended=true yields 22 natal elements', async () => {
    const req = makeRequest({ ...BASE_BIRTH, extended: true });
    const res = await POST(req);

    expect(res.status).toBe(200);
    const body = await res.json();

    expect(body.healthDiagnosis.natalElements).toHaveLength(22);
    expect(body.healthDiagnosis.optedInToExtended).toBe(true);
  });

  it('age option is threaded through (does not throw)', async () => {
    const req = makeRequest({ ...BASE_BIRTH, age: 45 });
    const res = await POST(req);

    expect(res.status).toBe(200);
    const body = await res.json();
    // Layer 3 life-stage gate changes with age — just verify no crash
    expect(body.healthDiagnosis.natalElements).toHaveLength(19);
  });

  it('returns 400 when required fields are missing', async () => {
    const req = makeRequest({ date: '1990-01-15' });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});
