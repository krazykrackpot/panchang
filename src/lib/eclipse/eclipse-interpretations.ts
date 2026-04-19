/**
 * Eclipse Impact Interpretations
 *
 * Provides house significations and interpretive content for eclipse impacts
 * on natal charts. Each of the 12 houses × 2 eclipse types (solar/lunar) has
 * unique guidance covering life areas, advice, duration, and Vedic remedies.
 */

export const HOUSE_SIGNIFICATIONS: Record<number, string[]> = {
  1: ['identity', 'self-image', 'physical body', 'new beginnings'],
  2: ['finances', 'family', 'speech', 'values'],
  3: ['communication', 'siblings', 'courage', 'short travel'],
  4: ['home', 'mother', 'emotional security', 'property'],
  5: ['creativity', 'children', 'romance', 'speculation'],
  6: ['health', 'enemies', 'service', 'daily routine'],
  7: ['partnerships', 'marriage', 'contracts', 'public dealings'],
  8: ['transformation', 'occult', 'inheritance', 'joint finances'],
  9: ['dharma', 'guru', 'higher learning', 'long travel'],
  10: ['career', 'reputation', 'authority', 'father'],
  11: ['gains', 'friends', 'aspirations', 'networks'],
  12: ['spirituality', 'isolation', 'foreign lands', 'expenses'],
};

export interface EclipseInterpretation {
  summary: string;
  lifeAreas: string[];
  advice: string;
  duration: string;
  remedies: string[];
}

/**
 * ECLIPSE_INTERPRETATIONS[eclipseKind][houseNumber]
 *
 * Solar eclipses represent external shifts, new beginnings, and fate-level turning points.
 * Lunar eclipses represent emotional culminations, endings, and inner realizations.
 */
export const ECLIPSE_INTERPRETATIONS: Record<'solar' | 'lunar', Record<number, EclipseInterpretation>> = {
  solar: {
    1: {
      summary: 'A powerful reset of personal identity and self-expression. You may feel compelled to reinvent yourself or change how others perceive you.',
      lifeAreas: ['personal identity', 'physical appearance', 'health vitality', 'life direction'],
      advice: 'Embrace the transformation rather than resisting it. Set strong intentions for the person you wish to become. Avoid impulsive decisions about appearance for two weeks after the eclipse.',
      duration: 'Effects unfold over 6 months, with the strongest impact in the first 2 weeks.',
      remedies: ['Surya Namaskar at sunrise for 40 days', 'Donate wheat or jaggery on Sundays', 'Recite Aditya Hridayam stotra'],
    },
    2: {
      summary: 'Financial matters and family dynamics undergo significant shifts. Hidden issues around money, speech, or family values come to light.',
      lifeAreas: ['income and savings', 'family relationships', 'speech and communication', 'food habits'],
      advice: 'Review your financial plans carefully. Avoid major purchases or investments during the eclipse window. Family conversations may be more charged than usual — choose words deliberately.',
      duration: 'Financial shifts manifest over 3-6 months. Family dynamics may take up to a year to settle.',
      remedies: ['Donate white foods (rice, milk) on Fridays', 'Recite Shri Suktam for abundance', 'Feed cows or birds regularly'],
    },
    3: {
      summary: 'Your communication style and relationship with siblings undergo transformation. New opportunities for learning, writing, or short travel emerge.',
      lifeAreas: ['siblings', 'writing and media', 'courage and initiative', 'neighborhood and short journeys'],
      advice: 'Be mindful of misunderstandings in written and verbal communication. Back up important documents. This is an excellent period for starting a creative writing project or learning a new skill.',
      duration: 'Communication shifts become clear within 1-3 months. Travel opportunities arise within 6 months.',
      remedies: ['Recite Hanuman Chalisa for courage', 'Donate green items on Wednesdays', 'Offer prayers to Lord Ganesha before new ventures'],
    },
    4: {
      summary: 'Domestic life, property matters, and your emotional foundation are activated. Changes in living situation or relationship with mother are possible.',
      lifeAreas: ['home and property', 'mother', 'emotional wellbeing', 'vehicles and comfort'],
      advice: 'Pay attention to home repairs or property matters that have been deferred. Emotional patterns from childhood may resurface for healing. Ground yourself through meditation and nature.',
      duration: 'Property and home changes crystallize within 6 months. Emotional shifts are immediate and deep.',
      remedies: ['Offer water to a Shiva Linga on Mondays', 'Donate white cloth or silver', 'Recite Chandra mantra (Om Chandraya Namaha) 108 times'],
    },
    5: {
      summary: 'Creativity, romance, and matters related to children take center stage. A new creative project or romantic chapter may begin.',
      lifeAreas: ['children', 'romance and love affairs', 'creativity and self-expression', 'investments and speculation'],
      advice: 'Channel the intense creative energy constructively. Avoid risky speculative investments near the eclipse. Relationships with children may need extra attention and patience.',
      duration: 'Romantic and creative developments unfold over 6-12 months. Investment outcomes manifest in 3-6 months.',
      remedies: ['Recite Santan Gopal mantra if children-related', 'Donate yellow items on Thursdays', 'Worship Lord Vishnu for creative blessings'],
    },
    6: {
      summary: 'Health routines, work habits, and dealings with adversaries are highlighted. A wake-up call about wellness or workplace dynamics may arrive.',
      lifeAreas: ['health and disease', 'daily work routine', 'competitors and legal disputes', 'service and healing'],
      advice: 'Schedule overdue health checkups. Restructure daily habits that no longer serve you. Workplace conflicts may escalate but ultimately resolve in your favor if you remain dharmic.',
      duration: 'Health awareness is immediate. Work routine changes settle within 3 months. Legal matters may take 6-12 months.',
      remedies: ['Recite Maha Mrityunjaya mantra 108 times daily', 'Donate medicines or pay for someone\'s treatment', 'Feed stray animals, especially on Saturdays'],
    },
    7: {
      summary: 'Partnerships, marriage, and business alliances face a pivotal turning point. New relationships may begin or existing ones transform fundamentally.',
      lifeAreas: ['marriage and spouse', 'business partnerships', 'contracts and agreements', 'public reputation'],
      advice: 'Avoid signing contracts or making relationship commitments during the eclipse fortnight. Existing partnerships that are strong will deepen; those with unresolved issues will face tests.',
      duration: 'Relationship developments unfold over 6-12 months. Business partnership shifts within 3-6 months.',
      remedies: ['Recite Parvati mantra for marital harmony', 'Donate sugar or white sweets on Fridays', 'Worship Lakshmi-Narayana together with spouse'],
    },
    8: {
      summary: 'Deep transformation, hidden matters, and joint resources are powerfully activated. Secrets may surface, or a fundamental shift in consciousness occurs.',
      lifeAreas: ['inheritance and joint finances', 'occult knowledge and research', 'transformation and rebirth', 'longevity'],
      advice: 'This is one of the most potent eclipse positions. Review insurance, inheritance, and tax matters. Spiritual practices intensify naturally. Do not resist the process of letting go.',
      duration: 'Transformation is deep and can take 1-2 years to fully integrate. Financial matters resolve within 6 months.',
      remedies: ['Recite Maha Mrityunjaya mantra for protection', 'Donate black sesame seeds on Saturdays', 'Perform Shradh or ancestor prayers (Pitru Tarpan)'],
    },
    9: {
      summary: 'Your beliefs, spiritual path, and relationship with teachers undergo a significant shift. Long-distance travel or higher education opportunities may arise.',
      lifeAreas: ['dharma and spiritual beliefs', 'guru and mentors', 'long-distance travel', 'higher education and philosophy'],
      advice: 'Be open to revising long-held beliefs. A new teacher or teaching may enter your life. Travel plans, especially overseas, gain momentum. Avoid dogmatism.',
      duration: 'Philosophical shifts are immediate. Travel and education opportunities develop over 6-12 months.',
      remedies: ['Recite Guru mantra (Om Gurave Namaha)', 'Donate yellow cloth or turmeric on Thursdays', 'Visit a temple or place of pilgrimage'],
    },
    10: {
      summary: 'Career, public standing, and authority undergo major realignment. Promotions, career changes, or shifts in your relationship with authority figures are likely.',
      lifeAreas: ['career and profession', 'public reputation', 'government and authority', 'father'],
      advice: 'Career decisions made now have long-lasting effects. Do not rush job changes but be prepared for unexpected opportunities. Your public image may shift — ensure it aligns with your authentic self.',
      duration: 'Career shifts manifest over 6-12 months. Reputation changes may take up to 2 years to fully settle.',
      remedies: ['Recite Surya mantra for career success', 'Donate red sandalwood or copper on Sundays', 'Offer water to the Sun at sunrise'],
    },
    11: {
      summary: 'Social networks, gains, and aspirations are activated. Friendships shift, new income sources emerge, or long-held wishes begin to materialize.',
      lifeAreas: ['income from profession', 'friendships and social circle', 'elder siblings', 'hopes and aspirations'],
      advice: 'Reassess which friendships and social groups truly support your growth. New income channels may open. Be discerning about group involvements and avoid over-committing to social obligations.',
      duration: 'Income shifts within 3-6 months. Social circle changes over 6-12 months.',
      remedies: ['Recite Shani mantra for sustained gains', 'Donate blue or black items on Saturdays', 'Support charitable organizations aligned with your values'],
    },
    12: {
      summary: 'Spirituality, foreign connections, and hidden expenses are highlighted. A period of withdrawal, retreat, or spiritual deepening begins.',
      lifeAreas: ['spiritual practice and moksha', 'foreign residence or travel', 'hidden expenses and losses', 'sleep and dreams'],
      advice: 'This eclipse favors meditation retreats and spiritual intensification. Watch for hidden expenses or financial drains. Dreams may be especially vivid and prophetic. Journaling helps integrate the experience.',
      duration: 'Spiritual insights are immediate. Foreign connections develop over 6-12 months. Expense patterns clarify within 3 months.',
      remedies: ['Recite Vishnu Sahasranama', 'Donate to ashrams or spiritual institutions', 'Practice Yoga Nidra or deep meditation regularly'],
    },
  },
  lunar: {
    1: {
      summary: 'Emotional patterns around self-worth and identity reach a climax. Past habits or self-perceptions you have outgrown are released.',
      lifeAreas: ['emotional identity', 'self-perception', 'health patterns', 'personal habits'],
      advice: 'Allow old self-images to dissolve. Physical health symptoms may surface as the body releases stored tension. Practice self-compassion. This is an ending that makes space for a truer you.',
      duration: 'Emotional release is immediate. Physical effects resolve within 1-3 months.',
      remedies: ['Offer milk to Shiva Linga on full moon night', 'Practice Chandra Namaskar (Moon salutations)', 'Wear a pearl or moonstone if Moon is beneficial in your chart'],
    },
    2: {
      summary: 'Emotional attachments to money, possessions, or family traditions come to a head. A financial situation reaches resolution or culmination.',
      lifeAreas: ['emotional relationship with money', 'family traditions', 'self-worth and values', 'dietary habits'],
      advice: 'Review emotional spending patterns. Family secrets or unspoken dynamics may surface — address them with compassion. Reassess what truly has value to you beyond material worth.',
      duration: 'Financial emotional patterns shift within 1-3 months. Family dynamics take 3-6 months.',
      remedies: ['Fast on full moon days (Purnima Vrat)', 'Donate dairy products or white foods', 'Recite Lakshmi Ashtottara for value alignment'],
    },
    3: {
      summary: 'Emotional dynamics with siblings or neighbors reach a turning point. A communication project or learning endeavor concludes or transforms.',
      lifeAreas: ['sibling emotional bonds', 'mental patterns and habits', 'writing or teaching projects', 'local community ties'],
      advice: 'Old ways of thinking and communicating are being released. A writing or creative project may reach completion. Pay attention to recurring thoughts — they reveal what needs to be let go.',
      duration: 'Mental pattern shifts are immediate. Sibling and communication matters resolve within 3 months.',
      remedies: ['Recite Saraswati mantra for mental clarity', 'Donate books or educational materials', 'Practice pranayama to calm the mind'],
    },
    4: {
      summary: 'Deep emotional processing around home, security, and maternal bonds. A chapter of domestic life closes, making way for a new sense of belonging.',
      lifeAreas: ['emotional security', 'home and living situation', 'relationship with mother', 'inner peace'],
      advice: 'Childhood memories and emotional patterns may surface intensely. Allow the process without suppressing. Physical home changes (moving, renovation) may finalize. Create a sanctuary space for processing.',
      duration: 'Emotional processing is most intense for 2 weeks. Home changes settle within 3-6 months.',
      remedies: ['Offer water and flowers to the Moon on Purnima', 'Recite Durga Saptashati for emotional strength', 'Keep fresh water in a silver vessel by your bedside'],
    },
    5: {
      summary: 'Romantic feelings, creative projects, or matters with children reach an emotional crescendo. A love affair or artistic work reaches its natural conclusion or peak.',
      lifeAreas: ['romantic emotions', 'creative fulfillment', 'children\'s wellbeing', 'heart\'s desires'],
      advice: 'Emotions in romance run high — avoid making permanent decisions based on temporary feelings. A creative project may reach a natural completion point. Children may need extra emotional support.',
      duration: 'Romantic culminations within 2 weeks to 1 month. Creative projects resolve within 3 months.',
      remedies: ['Recite Santan Gopal mantra for children\'s welfare', 'Offer sweets at a Hanuman temple', 'Practice heart-opening meditation or kirtan'],
    },
    6: {
      summary: 'Health patterns, work stress, or conflicts with rivals reach an emotional peak. A chronic issue may finally be understood and addressed.',
      lifeAreas: ['health emotions and anxiety', 'work-life balance', 'resolution of conflicts', 'service motivations'],
      advice: 'Stress and anxiety may peak — this is the clearing before relief. Long-standing health issues may get a definitive diagnosis or treatment path. Workplace grievances surface for resolution.',
      duration: 'Health revelations within 2 weeks. Work stress resolves within 1-3 months.',
      remedies: ['Recite Dhanvantari mantra for healing', 'Donate medicines or health supplies', 'Practice Yoga Nidra for deep rest and restoration'],
    },
    7: {
      summary: 'A relationship reaches its emotional truth. Partnerships are tested by the light of the full moon — what is real strengthens, what is illusion falls away.',
      lifeAreas: ['marriage dynamics', 'partnership emotions', 'public relationships', 'contractual commitments'],
      advice: 'This is one of the most relationship-sensitive eclipse positions. Give your partner space and avoid ultimatums. The truth of the relationship becomes clear — trust what you feel, not just what you see.',
      duration: 'Relationship revelations within 2 weeks. Full integration of changes over 6 months.',
      remedies: ['Worship Radha-Krishna or Shiva-Parvati together', 'Donate sweets to married couples', 'Recite Swayamvara Parvati mantra for harmony'],
    },
    8: {
      summary: 'Buried emotions, fears, and control patterns surface for release. Joint financial matters or inheritance issues reach resolution.',
      lifeAreas: ['deep emotional fears', 'shared resources', 'psychological patterns', 'transformative experiences'],
      advice: 'This is the most psychologically intense eclipse position. Old traumas or buried fears may surface. Seek therapeutic support if needed. Financial entanglements with others reach a decisive point.',
      duration: 'Psychological processing spans 1-6 months. Financial resolution within 3 months.',
      remedies: ['Perform Pitru Tarpan (ancestor offerings)', 'Donate black sesame and mustard oil on Saturdays', 'Recite Maha Mrityunjaya for protection from fears'],
    },
    9: {
      summary: 'A belief system or philosophical framework you have held reaches its emotional limit. Disillusionment with a teacher or teaching leads to deeper wisdom.',
      lifeAreas: ['faith and belief', 'relationship with guru', 'philosophical understanding', 'sense of meaning'],
      advice: 'Question what you have accepted on faith alone. A teacher or belief system may disappoint — this clears space for more authentic wisdom. Long-distance matters or legal issues may resolve.',
      duration: 'Philosophical shifts are immediate and profound. Legal and travel matters resolve within 3-6 months.',
      remedies: ['Recite Guru Paduka Stotram', 'Donate spiritual books or fund education', 'Practice silent meditation or Vipassana'],
    },
    10: {
      summary: 'Career ambitions and public standing face an emotional reckoning. What you thought you wanted professionally may shift as your heart speaks its truth.',
      lifeAreas: ['career satisfaction', 'public persona vs. private self', 'authority relationships', 'professional fulfillment'],
      advice: 'The gap between what society expects of you and what fulfills you emotionally becomes starkly visible. Do not make impulsive career moves, but honor the insight. Your father or a mentor figure may feature prominently.',
      duration: 'Career emotional processing takes 1-3 months. Actual career changes may unfold over 6-12 months.',
      remedies: ['Offer water to the Sun at sunrise with gratitude', 'Recite Vishwakarma mantra for right livelihood', 'Donate to causes that align with your true calling'],
    },
    11: {
      summary: 'Friendships and social aspirations face emotional truth. You may outgrow certain social circles or realize which friends truly support you.',
      lifeAreas: ['friendship dynamics', 'social identity', 'group emotional bonds', 'fulfilled vs. unfulfilled wishes'],
      advice: 'Let go of friendships maintained out of obligation rather than genuine connection. Long-held wishes may either manifest or be released. Income from social connections may shift.',
      duration: 'Social circle shifts within 1-3 months. Aspiration realignment over 6 months.',
      remedies: ['Recite Shani Gayatri for right relationships', 'Donate food at community kitchens (anna daan)', 'Practice metta (loving-kindness) meditation'],
    },
    12: {
      summary: 'The deepest emotional release occurs here. Dreams, subconscious patterns, and spiritual longing reach a peak. Something is ending at the soul level.',
      lifeAreas: ['subconscious patterns', 'spiritual awakening', 'karmic release', 'isolation and retreat'],
      advice: 'Honor the need for solitude and rest. Vivid dreams carry important messages. This is one of the most spiritually potent eclipse positions — meditation and prayer are especially powerful now.',
      duration: 'Spiritual experiences peak within 1-2 weeks. Karmic release patterns unfold over 6-12 months.',
      remedies: ['Practice deep meditation daily for 40 days', 'Recite Vishnu Sahasranama before sleep', 'Donate to orphanages or institutions caring for the helpless'],
    },
  },
};
