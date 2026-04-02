import { NextResponse } from 'next/server';
import { z } from 'zod';
import { generateSankalpa } from '@/lib/puja/sankalpa-generator';
import { checkRateLimit, getClientIP } from '@/lib/api/rate-limit';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';
// getSamvatsara used indirectly via generateSankalpa

const sankalpaSchema = z.object({
  name: z.string().max(200).default('______'),
  gotra: z.string().max(200).default('______'),
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  timezone: z.string().max(100).optional(),
  placeName: z.string().max(200).optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  purposeType: z.enum(['puja', 'vrat', 'custom']),
  purposeText: z.string().max(500),
  pujaSlug: z.string().max(100).optional(),
});

export async function POST(request: Request) {
  const ip = getClientIP(request);
  const { allowed } = checkRateLimit(ip, { maxRequests: 60, windowMs: 60000 });
  if (!allowed) {
    return NextResponse.json(
      { error: 'Rate limit exceeded.' },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const parsed = sankalpaSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { name, gotra, lat, lng, timezone, placeName, date, purposeType, purposeText } = parsed.data;
    const [y, m, d] = date.split('-').map(Number);
    const dateObj = new Date(y, m - 1, d);

    const tz = timezone
      ? getUTCOffsetForDate(y, m, d, timezone)
      : -(dateObj.getTimezoneOffset() / 60);

    const pujaDeity = purposeText;

    const generated = generateSankalpa({
      date: dateObj,
      lat,
      lng,
      timezoneOffset: tz,
      userName: name || undefined,
      gotra: gotra || undefined,
      pujaDeity,
      festivalSlug: 'custom',
      placeName: placeName || undefined,
    });

    const iast = devanagariToIAST(generated.devanagari);

    const english = buildEnglishMeaning({
      name: name || '(devotee)',
      gotra: gotra || '(gotra)',
      fields: generated.fields,
      purpose: purposeText,
      purposeType,
    });

    const vikramSamvat = y + 57;

    return NextResponse.json({
      devanagari: generated.devanagari,
      iast,
      english,
      components: {
        kalpaText: '\u0950 \u0935\u093F\u0937\u094D\u0923\u0941\u0930\u094D \u0935\u093F\u0937\u094D\u0923\u0941\u0930\u094D \u0935\u093F\u0937\u094D\u0923\u0941\u0903',
        samvatsara: generated.fields.samvatsara,
        ayana: generated.fields.ayana,
        ritu: generated.fields.ritu,
        masa: generated.fields.masa,
        paksha: generated.fields.paksha,
        tithi: generated.fields.tithi,
        vara: generated.fields.vara,
        nakshatra: generated.fields.nakshatra,
        desha: `${lat.toFixed(2)}\u00B0, ${lng.toFixed(2)}\u00B0`,
        kartaa: name || '______',
        purpose: purposeText,
      },
      panchangDate: date,
      vikramSamvat,
    });
  } catch (err) {
    console.error('Sankalpa API error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

function devanagariToIAST(text: string): string {
  const map: Record<string, string> = {
    '\u0905': 'a', '\u0906': '\u0101', '\u0907': 'i', '\u0908': '\u012B', '\u0909': 'u', '\u090A': '\u016B',
    '\u090F': 'e', '\u0910': 'ai', '\u0913': 'o', '\u0914': 'au', '\u090B': '\u1E5B',
    '\u0915': 'ka', '\u0916': 'kha', '\u0917': 'ga', '\u0918': 'gha', '\u0919': '\u1E45a',
    '\u091A': 'ca', '\u091B': 'cha', '\u091C': 'ja', '\u091D': 'jha', '\u091E': '\u00F1a',
    '\u091F': '\u1E6Da', '\u0920': '\u1E6Dha', '\u0921': '\u1E0Da', '\u0922': '\u1E0Dha', '\u0923': '\u1E47a',
    '\u0924': 'ta', '\u0925': 'tha', '\u0926': 'da', '\u0927': 'dha', '\u0928': 'na',
    '\u092A': 'pa', '\u092B': 'pha', '\u092C': 'ba', '\u092D': 'bha', '\u092E': 'ma',
    '\u092F': 'ya', '\u0930': 'ra', '\u0932': 'la', '\u0935': 'va', '\u0936': '\u015Ba', '\u0937': '\u1E63a', '\u0938': 'sa', '\u0939': 'ha',
    '\u093E': '\u0101', '\u093F': 'i', '\u0940': '\u012B', '\u0941': 'u', '\u0942': '\u016B',
    '\u0947': 'e', '\u0948': 'ai', '\u094B': 'o', '\u094C': 'au', '\u0943': '\u1E5B',
    '\u094D': '', '\u0902': '\u1E43', '\u0903': '\u1E25', '\u0901': '\u1E41',
    '\u0950': 'O\u1E43', '\u0965': '||',
  };

  let result = '';
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (i + 1 < text.length) {
      const pair = text[i] + text[i + 1];
      if (map[pair] !== undefined) {
        result += map[pair];
        i++;
        continue;
      }
    }
    if (map[ch] !== undefined) {
      result += map[ch];
    } else {
      result += ch;
    }
  }
  return result;
}

function buildEnglishMeaning(opts: {
  name: string;
  gotra: string;
  fields: Record<string, string>;
  purpose: string;
  purposeType: string;
}): string {
  const { name, gotra, fields, purpose, purposeType } = opts;

  const actionVerb = purposeType === 'vrat'
    ? 'observe this sacred vow'
    : 'perform this worship';

  return [
    'Om Vishnu, Vishnu, Vishnu!',
    `In the Samvatsara named ${fields.samvatsara}, during ${fields.ayana}, in the season of ${fields.ritu},`,
    `in the month of ${fields.masa}, during the ${fields.paksha} fortnight, on the ${fields.tithi} Tithi,`,
    `on ${fields.vara}-vara (day), under the ${fields.nakshatra} Nakshatra, in the ${fields.yoga} Yoga,`,
    `I, ${name}, of ${gotra} Gotra,`,
    `do hereby resolve to ${actionVerb} for ${purpose}.`,
  ].join(' ');
}
