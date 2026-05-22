/**
 * Tier-0 template fallback.
 *
 * Used when both the self-hosted Qwen (Tier 1) and Claude API (Tier 2)
 * fail or repeatedly produce Layer-4 validation failures. Always
 * available, never silent — the user always gets a personalised
 * answer, even if degraded.
 *
 * The templates are deliberately compact and category-specific. They
 * use a handful of placeholders filled from the Layer-2 context. They
 * do NOT make claims about specific yogas, positions, or future dates
 * that aren't directly in the context — so they pass Layer-4 trivially.
 */

import type {
  BrihaspatiContext,
  BrihaspatiNarration,
} from '../types';
import { systemPromptFor } from './prompts';

interface TemplateInput {
  category: BrihaspatiContext['category'];
  locale: BrihaspatiContext['locale'];
  lagna?: string;
  currentDasha?: string;
}

function readScalar(obj: Record<string, unknown>, key: string): string | undefined {
  const v = obj[key];
  return typeof v === 'string' ? v : undefined;
}

function extractTemplateInputs(ctx: BrihaspatiContext): TemplateInput {
  const dashas = ctx.dashas as Record<string, unknown>;
  const chart = ctx.chart as Record<string, unknown>;
  return {
    category: ctx.category,
    locale: ctx.locale,
    lagna: readScalar(chart, 'lagna') ?? readScalar(chart, 'ascendant'),
    currentDasha: readScalar(dashas, 'current'),
  };
}

const EN_TEMPLATES: Record<BrihaspatiContext['category'], (i: TemplateInput) => string> = {
  marriage: (i) =>
    `Your chart's marriage indicators are best read together with the dasha that's running now${
      i.currentDasha ? ` (currently ${i.currentDasha})` : ''
    }. Brihaspati's full guidance is being prepared; in the meantime, recall that classical Jyotish treats partnership timing as the meeting of three signals — the seventh house, its lord, and the activating dasha. Reflect on what your chart already shows about how you give and receive in close relationships. A simple Friday observance (light a ghee lamp, offer white flowers to Venus) is a grounded first step. We will email you the complete reading shortly.`,
  career: (i) =>
    `Career questions look at the tenth house, the strength of its lord, and any planet aspecting from the third or sixth. With your${
      i.lagna ? ` ${i.lagna} lagna` : ''
    } and current dasha${i.currentDasha ? ` of ${i.currentDasha}` : ''}, the chart's working themes are clear in our system but the full narration is being prepared. A Saturday discipline — even ten minutes of focused work before sunrise — aligns with the karmic axis your chart is asking you to honour. Full guidance follows by email.`,
  health: () =>
    `Health insights from a Vedic chart are best treated as a complement to a medical practitioner, never a substitute. The sixth and eighth houses, the constitution of the lagna lord, and any malefic transits to those houses are what we look at. Your full reading is in preparation; for now, the universal recommendation is to keep a steady morning routine, eat by the natural cycles of the day, and check in with a qualified doctor for any ongoing concern.`,
  finance: (i) =>
    `Wealth questions sit between the second house (accumulated resources) and the eleventh (gains and friendships that compound). Your${
      i.lagna ? ` ${i.lagna} lagna` : ''
    } chart's financial pattern is being narrated in full; in the interim, a Friday discipline of mindful spending and a small donation (preferably to those serving food) is consistent with the chart's broader signal.`,
  children: () =>
    `Questions about children are read from the fifth house, its lord, and the placement of Jupiter as karaka. Your chart's full guidance is being prepared. Until then, a Thursday discipline (yellow flowers, a Jupiter mantra such as Om Gurave Namah, recited 108 times) is a grounded support consistent with the chart's broader pattern.`,
  education: () =>
    `Study and exam questions look at Mercury and Jupiter together with the fourth and fifth houses. Your full chart-specific guidance is being prepared. Light a lamp before your books on Wednesday and Thursday evenings as a simple supportive practice in the meantime.`,
  dasha: (i) =>
    `You are presently in ${i.currentDasha ?? 'your current'} dasha. The full unfolding of this period is being narrated for you. Each mahadasha brings its lord's themes to the foreground — that lord's natural significations and its placement in your chart together describe what wants to mature now.`,
  remedies: () =>
    `Remedies are most effective when they match the chart's specific weak points. Your full personalised remedies are being prepared; until they arrive, a daily five-minute morning silence, a glass of water with both hands, and one act of unprompted kindness will hold the line in any direction.`,
  compatibility: () =>
    `Compatibility readings need both charts side by side. Your full Ashta Kuta analysis is being prepared. The classical guidance is that compatibility lives in three layers — practical (food, sleep, money rhythms), emotional (how the Moons interact), and spiritual (whether the dharma each carries can grow together). All three matter.`,
  timing: () =>
    `Auspicious-timing questions are answered from the choghadiya, hora, and current planetary climate. Your specific muhurta is being prepared. As a general principle, choose times when the activity's natural significator (Mercury for talk, Venus for art, Jupiter for teaching, Sun for state) is well-placed in the day.`,
  transit: () =>
    `Transits act on a chart that is already shaped — the natal placements decide what the transit can do, not the other way around. Your full transit guidance is being narrated. Saturn and Jupiter are the transits that matter most for life's larger shapes; for the day-to-day, the faster planets carry the texture.`,
  general: (i) =>
    `Your${i.lagna ? ` ${i.lagna} lagna` : ''} chart carries a specific signature that we read across positions, dashas, and transits together. The full reading is being prepared. Each chart has a centre of gravity — the planet most strongly placed and aspected — and your life's grain moves with what that planet asks of you. Returning to that planet, in mood and action, returns you to your axis.`,
};

const HI_TEMPLATES: Record<BrihaspatiContext['category'], (i: TemplateInput) => string> = {
  marriage: () =>
    `विवाह सम्बन्धी प्रश्नों के लिए आपकी कुण्डली का पूर्ण विश्लेषण तैयार किया जा रहा है। शुक्रवार को घी का दीप जलाकर श्वेत पुष्प अर्पित करना एक सहज प्रारम्भिक उपाय है। पूर्ण पाठ शीघ्र ही ईमेल द्वारा भेजा जाएगा।`,
  career: () =>
    `कैरियर के प्रश्न दशम भाव, उसके स्वामी और तत्कालीन गोचर से देखे जाते हैं। आपका पूर्ण विश्लेषण तैयार किया जा रहा है। प्रातः सूर्योदय से पहले दस मिनट का एकाग्र कार्य आपकी कुण्डली के समग्र संकेत के अनुकूल है।`,
  health: () =>
    `स्वास्थ्य के संकेत वैद्यकीय परामर्श का स्थान नहीं ले सकते — वे केवल पूरक हैं। आपकी कुण्डली का पूर्ण विश्लेषण तैयार किया जा रहा है। तब तक नियमित दिनचर्या, प्राकृतिक आहार और कोई भी चिन्ता हो तो योग्य चिकित्सक से परामर्श उचित है।`,
  finance: () =>
    `धन-सम्पत्ति के प्रश्न द्वितीय और एकादश भावों के संयोग से देखे जाते हैं। आपका पूर्ण विश्लेषण तैयार किया जा रहा है। तब तक शुक्रवार को सजग व्यय और अन्नदान के रूप में एक छोटा दान शुभ है।`,
  children: () =>
    `सन्तान सम्बन्धी प्रश्न पंचम भाव और गुरु के स्थिति से देखे जाते हैं। पूर्ण विश्लेषण तैयार किया जा रहा है। तब तक गुरुवार को पीले पुष्प और 'ॐ गुरवे नमः' का 108 बार जाप एक शान्त सहायक अभ्यास है।`,
  education: () =>
    `शिक्षा और परीक्षा के प्रश्न बुध और गुरु से देखे जाते हैं। पूर्ण विश्लेषण तैयार किया जा रहा है। बुधवार और गुरुवार की सायं पुस्तकों के समक्ष दीप प्रज्वलित करना एक सरल अनुकूल अभ्यास है।`,
  dasha: (i) =>
    `इस समय आप ${i.currentDasha ?? 'अपनी वर्तमान'} दशा में हैं। दशा के स्वामी का स्वभाव और कुण्डली में उसकी स्थिति मिलकर बताती है कि अभी क्या विकसित होना चाहता है। पूर्ण विश्लेषण तैयार किया जा रहा है।`,
  remedies: () =>
    `उपाय तभी अधिक प्रभावी होते हैं जब वे कुण्डली के विशिष्ट कमजोर बिन्दुओं से मेल खाते हैं। आपके व्यक्तिगत उपाय तैयार किए जा रहे हैं। तब तक प्रातः पाँच मिनट का मौन, दोनों हाथों से जल का घूँट और एक अनायास परोपकार किसी भी दिशा में स्थिर सहायक है।`,
  compatibility: () =>
    `अनुकूलता के लिए दोनों कुण्डलियाँ साथ देखी जाती हैं। अष्टकूट विश्लेषण तैयार किया जा रहा है। शास्त्रीय दृष्टि से अनुकूलता तीन परतों में रहती है — व्यावहारिक, भावनात्मक, और आध्यात्मिक।`,
  timing: () =>
    `शुभ मुहूर्त के प्रश्न चौघड़िया, होरा और वर्तमान ग्रह-दृष्टि से उत्तर पाते हैं। आपका विशिष्ट मुहूर्त तैयार किया जा रहा है।`,
  transit: () =>
    `गोचर पहले से बनी हुई कुण्डली पर अपना प्रभाव छोड़ते हैं — जन्म-स्थितियाँ ही तय करती हैं कि गोचर क्या कर सकता है। आपका विस्तृत गोचर विश्लेषण तैयार किया जा रहा है।`,
  general: () =>
    `आपकी कुण्डली का एक विशिष्ट स्वर है, जिसे हम स्थिति, दशा और गोचर तीनों मिलाकर पढ़ते हैं। पूर्ण पाठ तैयार किया जा रहा है। प्रत्येक कुण्डली का एक 'गुरुत्व-केन्द्र' होता है — सबसे प्रबल ग्रह — और जीवन की धारा उसी के अनुरूप बहती है।`,
};

const TEMPLATES_BY_LOCALE: Partial<Record<BrihaspatiContext['locale'], typeof EN_TEMPLATES>> = {
  en: EN_TEMPLATES,
  hi: HI_TEMPLATES,
};

/**
 * Produce a Tier-0 template answer. Always succeeds. Layer-4
 * validation passes by construction because templates never make
 * specific positional / dasha / yoga claims.
 */
export function template(ctx: BrihaspatiContext): BrihaspatiNarration {
  const inputs = extractTemplateInputs(ctx);
  const bank = TEMPLATES_BY_LOCALE[ctx.locale] ?? EN_TEMPLATES;
  const fn = bank[ctx.category];
  const text = fn(inputs);
  return {
    text,
    modelUsed: 'template-v1',
    systemPromptVersion: systemPromptFor({ category: ctx.category, locale: ctx.locale }).version,
    inputTokens: 0,
    outputTokens: text.length / 4, // approx
  };
}
