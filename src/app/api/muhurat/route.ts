import { NextRequest, NextResponse } from 'next/server';
import { findMuhuratDates, getAllActivities, type MuhuratActivity } from '@/lib/calendar/muhurat-calendar';

export async function GET(req: NextRequest) {
  const year = parseInt(req.nextUrl.searchParams.get('year') || String(new Date().getFullYear()));
  const month = parseInt(req.nextUrl.searchParams.get('month') || String(new Date().getMonth() + 1));
  const activity = (req.nextUrl.searchParams.get('activity') || 'marriage') as MuhuratActivity;
  const lat = parseFloat(req.nextUrl.searchParams.get('lat') || '28.6139');
  const lng = parseFloat(req.nextUrl.searchParams.get('lng') || '77.2090');

  const dates = findMuhuratDates(year, month, activity, lat, lng);
  const activities = getAllActivities();
  return NextResponse.json({ year, month, activity, dates, activities });
}
