import { NextResponse } from 'next/server';
import { scanDateRange } from '@/lib/muhurta/time-window-scanner';
import { getExtendedActivity } from '@/lib/muhurta/activity-rules-extended';
import type { ExtendedActivityId, MuhurtaAIResult } from '@/types/muhurta-ai';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      activity,
      startDate,
      endDate,
      lat = 28.6139,
      lng = 77.2090,
      tz = 5.5,
    } = body as {
      activity: ExtendedActivityId;
      startDate: string;
      endDate: string;
      lat?: number;
      lng?: number;
      tz?: number;
    };

    if (!activity || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Missing required fields: activity, startDate, endDate' },
        { status: 400 },
      );
    }

    const rules = getExtendedActivity(activity);
    if (!rules) {
      return NextResponse.json(
        { error: `Unknown activity: ${activity}` },
        { status: 400 },
      );
    }

    const topRecommendations = scanDateRange({
      startDate, endDate, activity, lat, lng, tz,
    });

    const result: MuhurtaAIResult = {
      activity,
      activityLabel: rules.label,
      dateRange: { start: startDate, end: endDate },
      topRecommendations,
      summary: {
        en: `Found ${topRecommendations.length} auspicious windows for ${rules.label.en} between ${startDate} and ${endDate}.${topRecommendations.length > 0 ? ` Best score: ${topRecommendations[0].totalScore}/100.` : ''}`,
        hi: `${startDate} से ${endDate} के बीच ${rules.label.hi} के लिए ${topRecommendations.length} शुभ समय मिले।${topRecommendations.length > 0 ? ` सर्वोत्तम अंक: ${topRecommendations[0].totalScore}/100।` : ''}`,
        sa: `${startDate} तः ${endDate} पर्यन्तं ${rules.label.sa} कृते ${topRecommendations.length} शुभमुहूर्ताः प्राप्ताः।`,
      },
    };

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: 'Failed to compute Muhurta AI recommendations' },
      { status: 500 },
    );
  }
}
