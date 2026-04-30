'use client';

import { Calendar } from 'lucide-react';

interface MonthlyPDFButtonProps {
  year: number;
  month: number;
  citySlug?: string;
  lat?: number;
  lng?: number;
  timezone?: string;
  locationName?: string;
  className?: string;
}

/**
 * Opens the monthly panchang print-optimized HTML in a new tab.
 * The user can then Save as PDF from their browser's print dialog.
 *
 * Accepts either a city slug OR lat/lng/timezone for custom locations.
 * City slug is preferred when available (shorter URL, cached on CDN).
 */
export default function MonthlyPDFButton({
  year,
  month,
  citySlug,
  lat,
  lng,
  timezone,
  locationName,
  className,
}: MonthlyPDFButtonProps) {
  const handleClick = () => {
    const params = new URLSearchParams();
    params.set('year', String(year));
    params.set('month', String(month));

    if (citySlug) {
      params.set('city', citySlug);
    } else if (lat != null && lng != null && timezone) {
      params.set('lat', String(lat));
      params.set('lng', String(lng));
      params.set('timezone', timezone);
      if (locationName) {
        params.set('locationName', locationName);
      }
    }

    window.open(`/api/panchang-pdf?${params.toString()}`, '_blank');
  };

  return (
    <button
      onClick={handleClick}
      className={
        className ||
        'inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md border border-gold-primary/15 text-text-secondary hover:text-gold-light hover:border-gold-primary/30 transition-all'
      }
      aria-label="Download monthly panchang PDF"
    >
      <Calendar className="w-3 h-3" />
      Monthly PDF
    </button>
  );
}
