/**
 * Locale-aware narrative templates for the cosmic-blueprint engine.
 *
 * Three short templates that the engine composes from localized
 * archetype names + chapter themes:
 *   - headline: "{primary} soul in {current} phase[, approaching {next} shift in {year}]"
 *   - transitionNote: "Shifting from {fromName} to {toName} — {fromTheme} gives way to {toTheme}."
 *   - expression: "Your {primaryName} nature expresses {lagnaModifier}"
 *
 * Each template gets one entry per visible locale (en, hi, ta, te, bn,
 * gu, kn, mai, mr). Missing locales fall back to `en`.
 */
import type { Locale } from '@/types/panchang';

export interface HeadlineArgs {
  primary: string;
  current: string;
  next?: string;
  year?: number;
}

export interface TransitionNoteArgs {
  fromName: string;       // already lowercased + "The " stripped
  toName: string;
  fromTheme: string;
  toTheme: string;
}

export interface ExpressionArgs {
  primaryName: string;
  lagnaModifier: string;
}

type LocaleFn<A> = (a: A) => string;

const headline: Record<string, LocaleFn<HeadlineArgs>> = {
  en: ({ primary, current, next, year }) =>
    `${primary} soul in ${current} phase${
      next && year ? `, approaching ${next} shift in ${year}` : ''
    }`,
  hi: ({ primary, current, next, year }) =>
    `${current} काल में ${primary} आत्मा${
      next && year ? `, ${year} में ${next} का संक्रमण आ रहा है` : ''
    }`,
  ta: ({ primary, current, next, year }) =>
    `${current} கட்டத்தில் ${primary} ஆன்மா${
      next && year ? `, ${year}-ல் ${next} மாற்றம் நெருங்குகிறது` : ''
    }`,
  te: ({ primary, current, next, year }) =>
    `${current} దశలో ${primary} ఆత్మ${
      next && year ? `, ${year}లో ${next} మార్పు సమీపిస్తోంది` : ''
    }`,
  bn: ({ primary, current, next, year }) =>
    `${current} পর্যায়ে ${primary} আত্মা${
      next && year ? `, ${year}-এ ${next} পরিবর্তন আসছে` : ''
    }`,
  gu: ({ primary, current, next, year }) =>
    `${current} તબક્કામાં ${primary} આત્મા${
      next && year ? `, ${year}માં ${next} પરિવર્તન નજીક છે` : ''
    }`,
  kn: ({ primary, current, next, year }) =>
    `${current} ಹಂತದಲ್ಲಿ ${primary} ಆತ್ಮ${
      next && year ? `, ${year}ರಲ್ಲಿ ${next} ಪರಿವರ್ತನೆ ಸಮೀಪಿಸುತ್ತಿದೆ` : ''
    }`,
  mai: ({ primary, current, next, year }) =>
    `${current} कालमे ${primary} आत्मा${
      next && year ? `, ${year}मे ${next} सङ्क्रमण आबि रहल अछि` : ''
    }`,
  mr: ({ primary, current, next, year }) =>
    `${current} टप्प्यात ${primary} आत्मा${
      next && year ? `, ${year} मध्ये ${next} संक्रमण जवळ आहे` : ''
    }`,
};

const transitionNote: Record<string, LocaleFn<TransitionNoteArgs>> = {
  en: ({ fromName, toName, fromTheme, toTheme }) =>
    `Shifting from ${fromName} to ${toName}  –  ${fromTheme} gives way to ${toTheme}.`,
  hi: ({ fromName, toName, fromTheme, toTheme }) =>
    `${fromName} से ${toName} की ओर संक्रमण  –  ${fromTheme} का स्थान ${toTheme} ले रहा है।`,
  ta: ({ fromName, toName, fromTheme, toTheme }) =>
    `${fromName} இலிருந்து ${toName} நோக்கி மாற்றம்  –  ${fromTheme} இடத்தை ${toTheme} எடுக்கிறது.`,
  te: ({ fromName, toName, fromTheme, toTheme }) =>
    `${fromName} నుండి ${toName}కి మార్పు  –  ${fromTheme} స్థానంలో ${toTheme} వస్తోంది.`,
  bn: ({ fromName, toName, fromTheme, toTheme }) =>
    `${fromName} থেকে ${toName}-এ পরিবর্তন  –  ${fromTheme}-এর স্থান ${toTheme} নিচ্ছে।`,
  gu: ({ fromName, toName, fromTheme, toTheme }) =>
    `${fromName}થી ${toName}માં પરિવર્તન  –  ${fromTheme}નું સ્થાન ${toTheme} લે છે.`,
  kn: ({ fromName, toName, fromTheme, toTheme }) =>
    `${fromName} ಯಿಂದ ${toName}ಗೆ ಪರಿವರ್ತನೆ  –  ${fromTheme} ಸ್ಥಾನವನ್ನು ${toTheme} ಪಡೆಯುತ್ತದೆ.`,
  mai: ({ fromName, toName, fromTheme, toTheme }) =>
    `${fromName} सँ ${toName} दिश सङ्क्रमण  –  ${fromTheme} केर स्थान ${toTheme} ल' रहल अछि।`,
  mr: ({ fromName, toName, fromTheme, toTheme }) =>
    `${fromName} पासून ${toName} कडे संक्रमण  –  ${fromTheme}ची जागा ${toTheme} घेत आहे.`,
};

const expression: Record<string, LocaleFn<ExpressionArgs>> = {
  en: ({ primaryName, lagnaModifier }) =>
    `Your ${primaryName} nature expresses ${lagnaModifier}`,
  hi: ({ primaryName, lagnaModifier }) =>
    `आपकी ${primaryName} प्रकृति ${lagnaModifier} रूप में व्यक्त होती है`,
  ta: ({ primaryName, lagnaModifier }) =>
    `உங்கள் ${primaryName} இயல்பு ${lagnaModifier} வடிவில் வெளிப்படுகிறது`,
  te: ({ primaryName, lagnaModifier }) =>
    `మీ ${primaryName} స్వభావం ${lagnaModifier} రూపంలో వ్యక్తమవుతుంది`,
  bn: ({ primaryName, lagnaModifier }) =>
    `আপনার ${primaryName} প্রকৃতি ${lagnaModifier} রূপে প্রকাশ পায়`,
  gu: ({ primaryName, lagnaModifier }) =>
    `તમારી ${primaryName} પ્રકૃતિ ${lagnaModifier} રૂપે વ્યક્ત થાય છે`,
  kn: ({ primaryName, lagnaModifier }) =>
    `ನಿಮ್ಮ ${primaryName} ಸ್ವಭಾವ ${lagnaModifier} ರೂಪದಲ್ಲಿ ವ್ಯಕ್ತಗೊಳ್ಳುತ್ತದೆ`,
  mai: ({ primaryName, lagnaModifier }) =>
    `अहाँक ${primaryName} स्वभाव ${lagnaModifier} रूपमे प्रकट होइत अछि`,
  mr: ({ primaryName, lagnaModifier }) =>
    `तुमचा ${primaryName} स्वभाव ${lagnaModifier} रूपात व्यक्त होतो`,
};

export function renderHeadline(args: HeadlineArgs, locale: Locale): string {
  return (headline[locale] ?? headline.en)(args);
}

export function renderTransitionNote(args: TransitionNoteArgs, locale: Locale): string {
  return (transitionNote[locale] ?? transitionNote.en)(args);
}

export function renderExpression(args: ExpressionArgs, locale: Locale): string {
  return (expression[locale] ?? expression.en)(args);
}
