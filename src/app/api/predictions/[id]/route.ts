import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase/server';

const VALID_OUTCOMES = ['correct', 'partially_correct', 'incorrect'] as const;

// ---------------------------------------------------------------------------
// PATCH /api/predictions/[id] — rate a prediction (set outcome + note)
// ---------------------------------------------------------------------------
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const supabase = getServerSupabase();
  if (!supabase) return NextResponse.json({ error: 'Not configured' }, { status: 503 });

  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const token = authHeader.slice(7).trim();
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: 'Missing prediction id' }, { status: 400 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { outcome, outcomeNote } = body as {
    outcome?: unknown;
    outcomeNote?: unknown;
  };

  // Validate outcome (required)
  if (typeof outcome !== 'string' || !(VALID_OUTCOMES as readonly string[]).includes(outcome)) {
    return NextResponse.json(
      { error: `outcome must be one of: ${VALID_OUTCOMES.join(', ')}` },
      { status: 400 },
    );
  }

  // Validate outcomeNote (optional)
  if (outcomeNote !== undefined && outcomeNote !== null) {
    if (typeof outcomeNote !== 'string') {
      return NextResponse.json({ error: 'outcomeNote must be a string' }, { status: 400 });
    }
    if (outcomeNote.length > 500) {
      return NextResponse.json({ error: 'outcomeNote must be 500 characters or fewer' }, { status: 400 });
    }
  }

  const { data: prediction, error: updateError } = await supabase
    .from('prediction_tracking')
    .update({
      outcome,
      outcome_note: typeof outcomeNote === 'string' ? outcomeNote.trim() : null,
      resolved_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('user_id', user.id) // ownership guard
    .select()
    .single();

  if (updateError) {
    console.error('[predictions] update failed:', updateError);
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ prediction });
}

// ---------------------------------------------------------------------------
// DELETE /api/predictions/[id] — delete a prediction
// ---------------------------------------------------------------------------
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const supabase = getServerSupabase();
  if (!supabase) return NextResponse.json({ error: 'Not configured' }, { status: 503 });

  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const token = authHeader.slice(7).trim();
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: 'Missing prediction id' }, { status: 400 });
  }

  const { error: deleteError } = await supabase
    .from('prediction_tracking')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (deleteError) {
    console.error('[predictions] delete failed:', deleteError);
    return NextResponse.json({ error: deleteError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
