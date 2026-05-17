export const DOSHA_GENTLE: Record<string, { titleEn: string; titleHi: string; bodyEn: string; bodyHi: string }> = {
  'mangal-dosha': {
    titleEn: 'Relationships need patience',
    titleHi: 'संबंधों में धैर्य आवश्यक',
    bodyEn: 'A karmic pattern suggests delayed but ultimately stable partnerships. Marriage after careful consideration tends to be more fulfilling. Remedies can smooth the path.',
    bodyHi: 'एक कार्मिक प्रवृत्ति विलम्बित किन्तु अन्ततः स्थिर साझेदारी का संकेत देती है। सावधानीपूर्वक विचार के बाद विवाह अधिक सन्तोषजनक होता है। उपाय मार्ग सुगम कर सकते हैं।',
  },
  'kaal-sarpa': {
    titleEn: 'Life unfolds in concentrated bursts',
    titleHi: 'जीवन केन्द्रित विस्फोटों में प्रकट होता है',
    bodyEn: 'A pattern of intense focus and sudden breakthroughs characterises your path. What feels like constraint is actually concentration — your energy is channelled, not blocked.',
    bodyHi: 'तीव्र ध्यान और अचानक सफलताओं का प्रतिरूप आपके मार्ग की विशेषता है। जो बाधा प्रतीत होती है वह वास्तव में एकाग्रता है।',
  },
  'pitra-dosha': {
    titleEn: 'Ancestral patterns seek resolution',
    titleHi: 'पैतृक प्रवृत्तियाँ समाधान चाहती हैं',
    bodyEn: 'Inherited karmic patterns from your lineage influence career and father relationships. Conscious acknowledgement and specific remedies help dissolve these patterns over time.',
    bodyHi: 'आपके वंश से विरासत में मिली कार्मिक प्रवृत्तियाँ करियर और पिता सम्बन्धों को प्रभावित करती हैं। सचेत स्वीकृति और विशिष्ट उपाय इन प्रवृत्तियों को समय के साथ विसर्जित करते हैं।',
  },
};

export function getDoshaGentleText(doshaId: string, locale: string): { title: string; body: string } | null {
  const entry = DOSHA_GENTLE[doshaId];
  if (!entry) return null;
  return {
    title: locale === 'hi' ? entry.titleHi : entry.titleEn,
    body: locale === 'hi' ? entry.bodyHi : entry.bodyEn,
  };
}
