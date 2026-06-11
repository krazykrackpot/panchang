/**
 * Chart-nudge email template — sent to authed users who haven't generated
 * a birth chart yet at specific drip checkpoints (Day 3 + Day 5 of the
 * 7-day onboarding drip).
 *
 * Why this exists
 * ---------------
 * The 7-day onboarding drip's content assumes a chart has been generated
 * by Day 4 (eclipse + houseRef interpolation) and Day 6 (dasha + dashaRef).
 * Users who never generate a chart silently slide through Days 3-7 receiving
 * content that refers to chart facts they don't have. The chart-nudge fires
 * in place of the regular Day 3 or Day 5 email — same drip cadence, no
 * additional email volume — and gives a focused, friction-removing CTA back
 * to /kundali.
 *
 * Why two checkpoints (Day 3, Day 5) and not just one
 * ---------------------------------------------------
 * Day 1 already CTAs to /kundali in the welcome. Day 3 is the first
 * remind-with-context (60% of the cohort lapses by Day 3 if they didn't
 * convert on Day 1). Day 5 is the last reasonable touch before the drip
 * winds down; nudging again here catches the slow-to-act cohort without
 * overlapping with Days 6-7 which the user may finally engage with on
 * their own once curious.
 *
 * Why drop the chart-nudge after Day 5
 * ------------------------------------
 * Days 6-7 are the "you're in dasha X" + "your family deserves charts too"
 * emails — both meaningful even without a personal chart in the system
 * (the dasha email gracefully degrades, the family email is about others).
 * Past Day 5 the dropoff signal is closer to "permanently uninterested"
 * than "needs another reminder" — no nudge.
 */
import type { Locale } from '@/lib/i18n/config';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

const BASE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dekhopanchang.com').replace(/\/$/, '');

export interface ChartNudgeOutput {
  subject: string;
  html: string;
  text: string;
}

// Minimal local helpers — kept independent of onboarding-templates.ts so the
// nudge email is a self-contained, testable unit.
function wrapEmail(content: string): string {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0;padding:24px 16px;background:#f5f1e8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#2c2820;">${content}</body></html>`;
}
function card(inner: string): string {
  return `<div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e6dfc8;border-radius:12px;padding:32px 28px;">${inner}</div>`;
}
function heading(text: string): string {
  return `<h1 style="margin:0 0 16px 0;font-size:22px;font-weight:600;color:#2c2820;">${text}</h1>`;
}
function p(text: string): string {
  return `<p style="margin:0 0 14px 0;font-size:15px;line-height:1.6;color:#4a4a4a;">${text}</p>`;
}
function gold(text: string): string {
  return `<span style="color:#d4a853;font-weight:bold;">${text}</span>`;
}
function ctaButton(label: string, href: string): string {
  return `<div style="margin:24px 0 8px;text-align:center;"><a href="${href}" style="display:inline-block;padding:13px 28px;background:#d4a853;color:#fff;text-decoration:none;border-radius:6px;font-weight:600;font-size:15px;">${label}</a></div>`;
}

/**
 * Day 3 chart-nudge — first targeted reminder. Frames the chart as the
 * unlock for everything else the product offers; calls out that the form
 * is short (date, time, place — three fields).
 */
export function chartNudgeDay3(locale: Locale, name?: string): ChartNudgeOutput {
  const display = name || (isDevanagariLocale(locale) ? 'मित्र' : 'Friend');
  const url = `${BASE_URL}/${locale}/kundali?from=email_nudge_d3`;
  if (isDevanagariLocale(locale)) {
    return {
      subject: 'आपकी जन्म कुंडली अभी तक नहीं बनी',
      html: wrapEmail(card(
        heading(`नमस्ते, ${display}!`) +
        p('कुछ दिन हो गए — हमने देखा कि आपने अभी तक अपनी जन्म कुंडली नहीं बनाई।') +
        p(`कुंडली बनाने के लिए केवल ${gold('तीन विवरण')} चाहिए: जन्म तिथि, समय और स्थान। पूरे 60 सेकंड में हो जाता है।`) +
        p('कुंडली बनने पर आप अपने ग्रह, नक्षत्र, दशा, साढ़े साती, राहु-केतु काल — सब कुछ देख पाएंगे।') +
        ctaButton('अभी कुंडली बनाएं', url)
      )),
      text: `नमस्ते ${display}!\n\nआपकी जन्म कुंडली अभी तक नहीं बनी। बस तीन विवरण चाहिए: जन्म तिथि, समय, स्थान। 60 सेकंड में हो जाता है।\n\n${url}`,
    };
  }
  return {
    subject: 'Your birth chart is still waiting',
    html: wrapEmail(card(
      heading(`Hi ${display}!`) +
      p('It has been a few days — we noticed your birth chart still has not been generated.') +
      p(`Generating one only needs ${gold('three details')}: birth date, time, and place. The whole thing takes about a minute.`) +
      p('Once your chart is in, everything else opens up — planets, nakshatras, your current Mahadasha, Sade Sati phase, Rahu-Ketu axis, and the daily readings tailored to your placements.') +
      ctaButton('Generate Your Birth Chart', url)
    )),
    text: `Hi ${display}!\n\nYour birth chart still has not been generated. It needs only three details: date, time, place. About a minute total.\n\n${url}`,
  };
}

/**
 * Day 5 chart-nudge — gentler, last-touch framing. Less imperative;
 * positions the chart as one-time setup that opens everything else.
 */
export function chartNudgeDay5(locale: Locale, name?: string): ChartNudgeOutput {
  const display = name || (isDevanagariLocale(locale) ? 'मित्र' : 'Friend');
  const url = `${BASE_URL}/${locale}/kundali?from=email_nudge_d5`;
  if (isDevanagariLocale(locale)) {
    return {
      subject: 'क्या आपने अपनी जन्म कुंडली बनाई?',
      html: wrapEmail(card(
        heading(`नमस्ते, ${display}!`) +
        p('एक छोटी सी जाँच — क्या आपने पिछले कुछ दिनों में अपनी जन्म कुंडली बनाई?') +
        p('अगर नहीं, तो आपके पास अभी भी मौका है। एक बार जन्म विवरण डालने पर आपकी कुंडली हमेशा के लिए सुरक्षित रहेगी, और ऐप के सभी निजी सुझाव — दैनिक पंचांग, मुहूर्त, साढ़े साती सूचनाएँ — स्वतः खुल जाएंगे।') +
        ctaButton('अपनी कुंडली बनाएं', url)
      )),
      text: `नमस्ते ${display}!\n\nक्या आपने अपनी जन्म कुंडली बनाई? न बनी हो तो: एक बार विवरण डालने पर सब निजी सुझाव खुल जाते हैं।\n\n${url}`,
    };
  }
  return {
    subject: 'Quick check — have you set up your chart yet?',
    html: wrapEmail(card(
      heading(`Hi ${display}!`) +
      p('Quick check-in — have you had a chance to generate your birth chart these last few days?') +
      p('If not, there is still time. The chart is one-time setup; once your birth details are in, your kundali stays in your account permanently, and all the personalised parts of the app — daily Panchang context, Muhurta picks for your activities, Sade Sati alerts — open up automatically.') +
      ctaButton('Set Up Your Chart', url)
    )),
    text: `Hi ${display}!\n\nQuick check — have you set up your birth chart yet? Once your details are in, the personalised parts of the app open up.\n\n${url}`,
  };
}
