import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

// Mocks must be hoisted alongside vi.mock factories — top-level `const`
// inside the test file is captured AFTER the factory runs, so we use
// vi.hoisted() to share references between the factory and tests.
const mocks = vi.hoisted(() => {
  const supabaseMock = {
    from: vi.fn(),
    auth: { getUser: vi.fn(), admin: { getUserById: vi.fn() } },
  };
  return {
    supabaseMock,
    sendEmailMock: vi.fn().mockResolvedValue({ success: true }),
    state: { supabaseNotConfigured: false },
  };
});
vi.mock('@/lib/supabase/server', () => ({
  getServerSupabase: () => (mocks.state.supabaseNotConfigured ? null : mocks.supabaseMock),
}));
vi.mock('@/lib/email/resend-client', () => ({
  sendEmail: mocks.sendEmailMock,
}));
const { supabaseMock, sendEmailMock } = mocks;

import { GET, POST } from '../route';

const TEST_USER_ID = '00000000-0000-0000-0000-000000000001';

function authedReq(method: 'GET' | 'POST', body?: unknown): NextRequest {
  return new NextRequest('https://test.local/api/feedback/nps-inapp', {
    method,
    headers: {
      Authorization: 'Bearer fake-test-token',
      'Content-Type': 'application/json',
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
}

function unauthedReq(method: 'GET' | 'POST', body?: unknown): NextRequest {
  return new NextRequest('https://test.local/api/feedback/nps-inapp', {
    method,
    headers: { 'Content-Type': 'application/json' },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
}

interface Stub {
  profile?: { nps_feedback_sent_at: string | null; nps_modal_shown_at: string | null };
  existingResponses?: number;
  responsesUpsert?: { error?: { message: string } | null };
  markUpdate?: { error?: { message: string } | null };
  logInsert?: { error?: { message: string } | null };
}

function setupSupabase(stub: Stub = {}) {
  const profileRow = stub.profile ?? { nps_feedback_sent_at: null, nps_modal_shown_at: null };
  const existingResponses = stub.existingResponses ?? 0;

  supabaseMock.auth.getUser.mockResolvedValue({
    data: { user: { id: TEST_USER_ID, email: 'user@example.com' } },
    error: null,
  });
  supabaseMock.auth.admin.getUserById.mockResolvedValue({
    data: { user: { id: TEST_USER_ID, email: 'user@example.com', created_at: '2026-06-01' } },
    error: null,
  });

  supabaseMock.from.mockImplementation((table: string) => {
    if (table === 'user_profiles') {
      return {
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            maybeSingle: vi.fn().mockResolvedValue({ data: profileRow, error: null }),
          }),
        }),
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            is: vi.fn().mockResolvedValue(stub.markUpdate ?? { error: null }),
          }),
        }),
      };
    }
    if (table === 'nps_responses') {
      return {
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ data: null, count: existingResponses, error: null }),
        }),
        upsert: vi.fn().mockResolvedValue(stub.responsesUpsert ?? { error: null }),
      };
    }
    if (table === 'nps_endpoint_log') {
      return { insert: vi.fn().mockResolvedValue(stub.logInsert ?? { error: null }) };
    }
    throw new Error(`Unexpected table in test: ${table}`);
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  mocks.state.supabaseNotConfigured = false;
  // Route reads NPS_OPERATOR_EMAIL at call time and silently skips the
  // operator-notify email when it's missing. Set it so the "notifies
  // operator on submit" test observes sendEmail actually being called.
  process.env.NPS_OPERATOR_EMAIL = 'operator@test.local';
});

describe('GET /api/feedback/nps-inapp eligibility', () => {
  it('401 with no Authorization header', async () => {
    setupSupabase();
    const res = await GET(unauthedReq('GET'));
    expect(res.status).toBe(401);
  });

  it('eligible=false when email was never sent', async () => {
    setupSupabase({ profile: { nps_feedback_sent_at: null, nps_modal_shown_at: null } });
    const res = await GET(authedReq('GET'));
    const body = await res.json();
    expect(body.eligible).toBe(false);
  });

  it('eligible=false when email was sent <7 days ago', async () => {
    const threeDaysAgo = new Date(Date.now() - 3 * 86_400_000).toISOString();
    setupSupabase({ profile: { nps_feedback_sent_at: threeDaysAgo, nps_modal_shown_at: null } });
    const res = await GET(authedReq('GET'));
    const body = await res.json();
    expect(body.eligible).toBe(false);
  });

  it('eligible=true when email was sent >7 days ago, not shown, no response', async () => {
    const twoWeeksAgo = new Date(Date.now() - 14 * 86_400_000).toISOString();
    setupSupabase({ profile: { nps_feedback_sent_at: twoWeeksAgo, nps_modal_shown_at: null } });
    const res = await GET(authedReq('GET'));
    const body = await res.json();
    expect(body.eligible).toBe(true);
  });

  it('eligible=false when modal already shown', async () => {
    const twoWeeksAgo = new Date(Date.now() - 14 * 86_400_000).toISOString();
    setupSupabase({
      profile: { nps_feedback_sent_at: twoWeeksAgo, nps_modal_shown_at: new Date().toISOString() },
    });
    const res = await GET(authedReq('GET'));
    const body = await res.json();
    expect(body.eligible).toBe(false);
  });

  it('eligible=false when user already responded to email NPS', async () => {
    const twoWeeksAgo = new Date(Date.now() - 14 * 86_400_000).toISOString();
    setupSupabase({
      profile: { nps_feedback_sent_at: twoWeeksAgo, nps_modal_shown_at: null },
      existingResponses: 1,
    });
    const res = await GET(authedReq('GET'));
    const body = await res.json();
    expect(body.eligible).toBe(false);
    expect(body.already_responded).toBe(true);
  });
});

describe('POST /api/feedback/nps-inapp submit', () => {
  it('rejects invalid score', async () => {
    setupSupabase();
    const res = await POST(authedReq('POST', { action: 'submit', score: 99 }));
    expect(res.status).toBe(400);
  });

  it('rejects negative score', async () => {
    setupSupabase();
    const res = await POST(authedReq('POST', { action: 'submit', score: -1 }));
    expect(res.status).toBe(400);
  });

  it('rejects unknown action', async () => {
    setupSupabase();
    const res = await POST(authedReq('POST', { action: 'whatever' }));
    expect(res.status).toBe(400);
  });

  it('returns 401 with no bearer', async () => {
    setupSupabase();
    const res = await POST(unauthedReq('POST', { action: 'submit', score: 9 }));
    expect(res.status).toBe(401);
  });

  it('skips with not_eligible if user no longer eligible (idempotent)', async () => {
    // Already shown — should be a no-op success, not an error.
    setupSupabase({
      profile: {
        nps_feedback_sent_at: new Date(Date.now() - 14 * 86_400_000).toISOString(),
        nps_modal_shown_at: new Date().toISOString(),
      },
    });
    const res = await POST(authedReq('POST', { action: 'submit', score: 9 }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.skipped).toBe('not_eligible');
  });

  it('writes response + notifies operator on valid submit', async () => {
    setupSupabase({
      profile: {
        nps_feedback_sent_at: new Date(Date.now() - 14 * 86_400_000).toISOString(),
        nps_modal_shown_at: null,
      },
    });
    const res = await POST(authedReq('POST', { action: 'submit', score: 9, reason: 'Great' }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.score).toBe(9);
    // Operator email sent
    expect(sendEmailMock).toHaveBeenCalledTimes(1);
    const [arg] = sendEmailMock.mock.calls[0] as [{ subject: string; html: string }];
    expect(arg.subject).toContain('[NPS 9');
    expect(arg.subject).toContain('PROMOTER');
  });

  it('dismiss marks shown but does not write a response or notify', async () => {
    setupSupabase({
      profile: {
        nps_feedback_sent_at: new Date(Date.now() - 14 * 86_400_000).toISOString(),
        nps_modal_shown_at: null,
      },
    });
    const res = await POST(authedReq('POST', { action: 'dismiss' }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.dismissed).toBe(true);
    expect(sendEmailMock).not.toHaveBeenCalled();
  });
});

describe('Operator notification HTML escaping', () => {
  it('escapes HTML in reason to prevent injection in the operator email', async () => {
    setupSupabase({
      profile: {
        nps_feedback_sent_at: new Date(Date.now() - 14 * 86_400_000).toISOString(),
        nps_modal_shown_at: null,
      },
    });
    const malicious = '<script>alert(1)</script>';
    await POST(authedReq('POST', { action: 'submit', score: 8, reason: malicious }));
    expect(sendEmailMock).toHaveBeenCalledTimes(1);
    const [arg] = sendEmailMock.mock.calls[0] as [{ subject: string; html: string }];
    expect(arg.html).not.toContain('<script>');
    expect(arg.html).toContain('&lt;script&gt;');
  });

  it('skips operator send when NPS_OPERATOR_EMAIL is not configured', async () => {
    delete process.env.NPS_OPERATOR_EMAIL;
    setupSupabase({
      profile: {
        nps_feedback_sent_at: new Date(Date.now() - 14 * 86_400_000).toISOString(),
        nps_modal_shown_at: null,
      },
    });
    // The user submit still succeeds — only the operator alert is
    // dropped when the env var is missing. Response DB row still lands.
    const res = await POST(authedReq('POST', { action: 'submit', score: 9 }));
    expect(res.status).toBe(200);
    expect(sendEmailMock).not.toHaveBeenCalled();
  });
});

describe('Eligibility DB error handling', () => {
  it('returns eligible=false when the response-count query fails', async () => {
    // Wire the response-count query to error so checkEligibility hits the
    // defensive branch. Without the branch, `alreadyResponded` would
    // default to false and the modal would re-prompt a user we can't
    // confirm hasn't already responded.
    supabaseMock.auth.getUser.mockResolvedValue({
      data: { user: { id: TEST_USER_ID, email: 'user@example.com' } },
      error: null,
    });
    supabaseMock.from.mockImplementation((table: string) => {
      if (table === 'user_profiles') {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              maybeSingle: vi.fn().mockResolvedValue({
                data: {
                  nps_feedback_sent_at: new Date(Date.now() - 14 * 86_400_000).toISOString(),
                  nps_modal_shown_at: null,
                },
                error: null,
              }),
            }),
          }),
        };
      }
      if (table === 'nps_responses') {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({ data: null, count: null, error: { message: 'boom' } }),
          }),
        };
      }
      throw new Error(`Unexpected table in test: ${table}`);
    });
    const res = await GET(authedReq('GET'));
    const body = await res.json();
    expect(body.eligible).toBe(false);
  });
});
