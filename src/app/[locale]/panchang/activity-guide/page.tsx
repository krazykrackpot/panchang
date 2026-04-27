'use client';

import { useState, useEffect, useCallback } from 'react';
import { useLocale } from 'next-intl';
import { Link } from '@/lib/i18n/navigation';
import { ArrowLeft, MapPin, Loader2 } from 'lucide-react';
import NakshatraActivityGuide from '@/components/panchang/NakshatraActivityGuide';
import type { PanchangData } from '@/types/panchang';
import { useLocationStore } from '@/stores/location-store';
import { isDevanagariLocale, getHeadingFont } from '@/lib/utils/locale-fonts';

export default function ActivityGuidePage() {
  const locale = useLocale();
  const isDevanagari = isDevanagariLocale(locale);
  const headingFont = getHeadingFont(locale);
  const { lat, lng, name: locationName, setLocation } = useLocationStore();

  const [panchang, setPanchang] = useState<PanchangData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchPanchang = useCallback(async (lt: number, ln: number) => {
    setLoading(true);
    try {
      const now = new Date();
      const y = now.getFullYear(), m = now.getMonth() + 1, d = now.getDate();
      const tzName = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const res = await fetch(`/api/panchang?year=${y}&month=${m}&day=${d}&lat=${lt}&lng=${ln}&timezone=${encodeURIComponent(tzName)}&location=${encodeURIComponent(locationName || '')}`);
      if (res.ok) {
        const data = await res.json();
        setPanchang(data);
      }
    } catch (err) {
      console.error('[activity-guide] fetch failed:', err);
    }
    setLoading(false);
  }, [locationName]);

  // Auto-detect location on mount
  useEffect(() => {
    if (lat && lng) {
      fetchPanchang(lat, lng);
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation(pos.coords.latitude, pos.coords.longitude, 'Current Location');
          fetchPanchang(pos.coords.latitude, pos.coords.longitude);
        },
        () => {
          // Geolocation denied — show error, don't hardcode a location
          setLoading(false);
        }
      );
    }
  }, [lat, lng, fetchPanchang, setLocation]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back link */}
      <Link href="/panchang" className="inline-flex items-center gap-2 text-sm text-gold-primary/60 hover:text-gold-primary transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" />
        {isDevanagari ? 'पंचांग पर वापस' : 'Back to Panchang'}
      </Link>

      <h1 className="text-3xl font-bold text-gold-light mb-2" style={headingFont}>
        {isDevanagari ? 'नक्षत्र गतिविधि मार्गदर्शिका' : 'Nakshatra Activity Guide'}
      </h1>
      <p className="text-text-secondary text-sm mb-8">
        {isDevanagari
          ? 'आज के नक्षत्र के आधार पर अनुकूल और प्रतिकूल कार्यों का मार्गदर्शन'
          : "Today's favorable and unfavorable activities based on the ruling nakshatra"}
      </p>

      {/* Location indicator */}
      {locationName && (
        <div className="flex items-center gap-2 text-text-secondary text-xs mb-6">
          <MapPin className="w-3.5 h-3.5" />
          <span>{locationName}</span>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-gold-primary animate-spin" />
        </div>
      ) : panchang?.nakshatra?.id ? (
        <NakshatraActivityGuide
          nakshatraId={panchang.nakshatra.id}
          moonSignId={panchang.moonSign?.rashi || 1}
          locale={locale}
        />
      ) : (
        <p className="text-text-secondary text-center py-10">
          {isDevanagari ? 'पंचांग डेटा लोड नहीं हो सका' : 'Could not load panchang data'}
        </p>
      )}
    </div>
  );
}
