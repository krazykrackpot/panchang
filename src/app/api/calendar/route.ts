import { NextResponse } from 'next/server';
import { generateFestivalCalendar } from '@/lib/calendar/festivals';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const year = parseInt(searchParams.get('year') || new Date().getFullYear().toString());

  try {
    const festivals = generateFestivalCalendar(year);
    return NextResponse.json({ year, festivals });
  } catch {
    return NextResponse.json({ error: 'Failed to generate calendar' }, { status: 500 });
  }
}
