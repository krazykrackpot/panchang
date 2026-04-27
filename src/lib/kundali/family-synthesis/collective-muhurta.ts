/**
 * Collective Muhurta Engine
 *
 * Finds time windows that are auspicious for ALL family members simultaneously.
 * Runs the V2 muhurta scanner for each member's birth data, then intersects
 * the results to surface windows where everyone scores well.
 */

import { scanDateRangeV2, type ScanV2Window } from '@/lib/muhurta/time-window-scanner';
import type { ExtendedActivityId } from '@/types/muhurta-ai';

// ─── Input / Output Types ────────────────────────────────────────────────────

export interface FamilyMemberInput {
  name: string;
  birthNakshatra: number;  // 1-27
  birthRashi: number;      // 1-12
  dashaLords?: { maha: number; antar: number; pratyantar: number };
}

export interface CollectiveMuhurtaWindow {
  date: string;
  startTime: string;
  endTime: string;
  collectiveScore: number;    // Average of all members' scores (0-100)
  minScore: number;           // Worst individual score
  maxScore: number;           // Best individual score
  memberScores: {
    name: string;
    score: number;
    taraBala?: { tara: number; name: string; auspicious: boolean };
  }[];
}

export interface CollectiveMuhurtaResult {
  activity: ExtendedActivityId;
  dateRange: [string, string];
  topWindows: CollectiveMuhurtaWindow[];   // Top 10 collective windows
  memberCount: number;
}

// ─── Engine ──────────────────────────────────────────────────────────────────

export function findCollectiveMuhurta(params: {
  members: FamilyMemberInput[];
  activity: ExtendedActivityId;
  startDate: string;
  endDate: string;
  lat: number;
  lng: number;
  tz: number;
}): CollectiveMuhurtaResult {
  const { members, activity, startDate, endDate, lat, lng, tz } = params;

  if (members.length === 0) {
    return {
      activity,
      dateRange: [startDate, endDate],
      topWindows: [],
      memberCount: 0,
    };
  }

  // 1. Run V2 scanner for each family member
  const memberResults = members.map(member => {
    const windows = scanDateRangeV2({
      startDate,
      endDate,
      activity,
      lat,
      lng,
      tz,
      windowMinutes: 120,
      preSunriseHours: 0,
      postSunsetHours: 1,
      birthNakshatra: member.birthNakshatra,
      birthRashi: member.birthRashi,
      dashaLords: member.dashaLords,
    });

    // 2. Build a map keyed by date+startTime for fast lookup
    const windowMap = new Map<string, ScanV2Window>();
    for (const w of windows) {
      windowMap.set(`${w.date}_${w.startTime}`, w);
    }

    return { name: member.name, windows, windowMap };
  });

  // 3. Intersect: iterate first member's windows, keep only those present for ALL members
  const firstMember = memberResults[0];
  const collectiveWindows: CollectiveMuhurtaWindow[] = [];

  for (const window of firstMember.windows) {
    const key = `${window.date}_${window.startTime}`;

    const allScores: { name: string; score: number; taraBala?: ScanV2Window['taraBala'] }[] = [];
    let allPresent = true;

    for (const mr of memberResults) {
      const w = mr.windowMap.get(key);
      if (!w) {
        allPresent = false;
        break;
      }
      allScores.push({
        name: mr.name,
        score: w.score,
        taraBala: w.taraBala,
      });
    }

    if (!allPresent) continue;

    const scores = allScores.map(s => s.score);
    const sum = scores.reduce((a, b) => a + b, 0);

    collectiveWindows.push({
      date: window.date,
      startTime: window.startTime,
      endTime: window.endTime,
      collectiveScore: Math.round(sum / scores.length),
      minScore: Math.min(...scores),
      maxScore: Math.max(...scores),
      memberScores: allScores,
    });
  }

  // 4. Sort by collectiveScore descending, return top 10
  collectiveWindows.sort((a, b) => b.collectiveScore - a.collectiveScore);

  return {
    activity,
    dateRange: [startDate, endDate],
    topWindows: collectiveWindows.slice(0, 10),
    memberCount: members.length,
  };
}
