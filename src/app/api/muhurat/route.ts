import { NextRequest, NextResponse } from 'next/server';
import { findMuhuratDates, getAllActivities, type MuhuratActivity } from '@/lib/calendar/muhurat-calendar';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const year = parseInt(searchParams.get('year') || String(new Date().getFullYear()));
  const month = parseInt(searchParams.get('month') || String(new Date().getMonth() + 1));
  const activity = (searchParams.get('activity') || 'marriage') as MuhuratActivity;
  const lat = parseFloat(searchParams.get('lat') || '0'); // DEPRECATED fallback: client should always provide location
  const lng = parseFloat(searchParams.get('lng') || '0'); // DEPRECATED fallback: client should always provide location

  const dates = findMuhuratDates(year, month, activity, lat, lng);
  const activities = getAllActivities();
  return NextResponse.json({ year, month, activity, dates, activities }, {
    headers: { 'Cache-Control': 'public, s-maxage=3600' },
  });
}
