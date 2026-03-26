'use client';

import { useState, useMemo } from 'react';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import GoldDivider from '@/components/ui/GoldDivider';
import { RashiIconById } from '@/components/icons/RashiIcons';
import { RASHIS } from '@/lib/constants/rashis';
import { dateToJD, sunLongitude, toSidereal, normalizeDeg, getRashiNumber, formatDegrees } from '@/lib/ephem/astronomical';
import type { Locale, Trilingual } from '@/types/panchang';

interface Upagraha {
  name: Trilingual;
  longitude: number;
  sign: number;
  signName: Trilingual;
  degree: string;
  description: Trilingual;
}

/**
 * Upagraha positions derived from the Sun
 * Dhuma = Sun + 133°20'
 * Vyatipata = 360° - Dhuma
 * Parivesha = Vyatipata + 180°
 * Chapa (Indra Dhanus) = 360° - Parivesha
 * Upaketu = Chapa + 16°40'
 */
function computeUpagrahas(jd: number): Upagraha[] {
  const sunTrop = sunLongitude(jd);
  const sunSid = toSidereal(sunTrop, jd);

  const dhumaLong = normalizeDeg(sunSid + 133 + 20/60);
  const vyatipataLong = normalizeDeg(360 - dhumaLong);
  const pariveshaLong = normalizeDeg(vyatipataLong + 180);
  const chapaLong = normalizeDeg(360 - pariveshaLong);
  const upaketuLong = normalizeDeg(chapaLong + 16 + 40/60);

  const make = (name: Trilingual, long: number, desc: Trilingual): Upagraha => {
    const sign = getRashiNumber(long);
    return {
      name,
      longitude: long,
      sign,
      signName: RASHIS[sign - 1].name,
      degree: formatDegrees(long % 30),
      description: desc,
    };
  };

  return [
    make(
      { en: 'Dhuma', hi: 'धूम', sa: 'धूमः' },
      dhumaLong,
      { en: 'Smoke of the Sun. Indicates hidden obstacles, smoke-like confusion, and veiled dangers.', hi: 'सूर्य का धूम। छिपी बाधाओं, धुँधलेपन और गुप्त खतरों का संकेत देता है।', sa: 'सूर्यस्य धूमः। गूढबाधाः, धूमवत् भ्रान्तिः, गुप्तसङ्कटानि च सूचयति।' }
    ),
    make(
      { en: 'Vyatipata', hi: 'व्यतीपात', sa: 'व्यतीपातः' },
      vyatipataLong,
      { en: 'The "great fall." Indicates calamity, destruction, and inauspicious events.', hi: '"महान पतन"। विपत्ति, विनाश और अशुभ घटनाओं का सूचक।', sa: '"महापतनम्"। विपत्तिः, विनाशः, अशुभघटनाः च सूचयति।' }
    ),
    make(
      { en: 'Parivesha', hi: 'परिवेश', sa: 'परिवेषः' },
      pariveshaLong,
      { en: 'Halo around the Sun. Indicates fame, aura, and spiritual influence.', hi: 'सूर्य के चारों ओर का प्रभामण्डल। यश, प्रभाव और आध्यात्मिक प्रभाव का सूचक।', sa: 'सूर्यपरितः प्रभामण्डलम्। यशः, प्रभावः, आध्यात्मिकप्रभावश्च सूचयति।' }
    ),
    make(
      { en: 'Chapa (Indra Dhanus)', hi: 'चाप (इन्द्रधनुष)', sa: 'चापः (इन्द्रधनुः)' },
      chapaLong,
      { en: 'Rainbow/Bow of Indra. Indicates divine grace, protection, and auspiciousness.', hi: 'इन्द्र का धनुष। दैवी कृपा, सुरक्षा और शुभता का सूचक।', sa: 'इन्द्रस्य धनुः। दैवकृपा, रक्षणम्, शुभता च सूचयति।' }
    ),
    make(
      { en: 'Upaketu', hi: 'उपकेतु', sa: 'उपकेतुः' },
      upaketuLong,
      { en: 'Sub-Ketu. Indicates karmic influences, sudden events, and spiritual awakening.', hi: 'उप-केतु। कार्मिक प्रभाव, आकस्मिक घटनाओं और आध्यात्मिक जागृति का सूचक।', sa: 'उपकेतुः। कार्मिकप्रभावाः, आकस्मिकघटनाः, आध्यात्मिकजागृतिश्च सूचयति।' }
    ),
  ];
}

export default function UpagrahaPage() {
  const locale = useLocale() as Locale;
  const isDevanagari = locale !== 'en';
  const headingFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };

  const [dateStr, setDateStr] = useState(new Date().toISOString().split('T')[0]);

  const upagrahas = useMemo(() => {
    const [y, m, d] = dateStr.split('-').map(Number);
    const jd = dateToJD(y, m, d, 6); // noon IST ~ 6 UT
    return computeUpagrahas(jd);
  }, [dateStr]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <h1 className="text-5xl sm:text-6xl font-bold mb-4" style={headingFont}>
          <span className="text-gold-gradient">{locale === 'en' ? 'Upagraha Positions' : 'उपग्रह स्थिति'}</span>
        </h1>
        <p className="text-text-secondary text-lg max-w-2xl mx-auto">
          {locale === 'en'
            ? 'Sub-planets derived from the Sun — Dhuma, Vyatipata, Parivesha, Chapa, Upaketu'
            : 'सूर्य से व्युत्पन्न उपग्रह — धूम, व्यतीपात, परिवेश, चाप, उपकेतु'}
        </p>
      </motion.div>

      {/* Date selector */}
      <div className="flex justify-center mb-10">
        <input type="date" value={dateStr} onChange={e => setDateStr(e.target.value)}
          className="px-5 py-3 rounded-xl bg-bg-tertiary/50 border border-gold-primary/20 text-gold-light text-lg font-mono focus:outline-none focus:border-gold-primary/50"
        />
      </div>

      <GoldDivider />

      <div className="space-y-4 my-10">
        {upagrahas.map((u, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card rounded-xl p-6 border border-gold-primary/15"
          >
            <div className="flex items-start gap-4">
              <RashiIconById id={u.sign} size={44} />
              <div className="flex-1">
                <div className="flex items-center gap-3 flex-wrap mb-1">
                  <span className="text-gold-light text-xl font-bold" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : headingFont}>
                    {u.name[locale]}
                  </span>
                  <span className="text-text-secondary text-sm font-mono">{u.degree}</span>
                </div>
                <div className="text-sm text-text-secondary mb-2" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                  <span className="text-gold-dark">{locale === 'en' ? 'Sign:' : 'राशि:'}</span> {u.signName[locale]}
                  <span className="text-gold-dark/30 mx-2">|</span>
                  <span className="font-mono text-xs">{u.longitude.toFixed(4)}°</span>
                </div>
                <p className="text-text-secondary/70 text-xs leading-relaxed" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                  {u.description[locale]}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Formula explanation */}
      <div className="glass-card rounded-xl p-6 mt-6 border border-gold-primary/10">
        <h3 className="text-gold-light text-lg font-bold mb-3" style={headingFont}>
          {locale === 'en' ? 'Derivation Formulae' : 'व्युत्पत्ति सूत्र'}
        </h3>
        <div className="space-y-1.5 text-sm font-mono text-text-secondary">
          <div>Dhuma = Sun + 133°20&apos;</div>
          <div>Vyatipata = 360° - Dhuma</div>
          <div>Parivesha = Vyatipata + 180°</div>
          <div>Chapa = 360° - Parivesha</div>
          <div>Upaketu = Chapa + 16°40&apos;</div>
        </div>
      </div>
    </div>
  );
}
