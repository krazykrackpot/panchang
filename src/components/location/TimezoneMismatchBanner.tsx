'use client';

import { useLocationStore } from '@/stores/location-store';
import { MapPin, AlertTriangle, X } from 'lucide-react';

/**
 * Shows when location store has `stale: true` — meaning an auto-detected
 * location has a timezone mismatch with the browser (user may have travelled).
 *
 * Manual selections (source === 'manual') NEVER trigger this banner.
 * The store's detect() sets `stale: true` only after verifying the TZ
 * mismatch is genuine (not an alias like Europe/Berlin ≈ Europe/Zurich).
 */
export default function TimezoneMismatchBanner() {
  const { timezone: locationTz, name: locationName, stale, confirmCurrent, clearAndRedetect } = useLocationStore();

  if (!stale || !locationTz) return null;

  let browserTz: string | null = null;
  try {
    browserTz = typeof window !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone : null;
  } catch {
    // Browser timezone detection failed — can't show a meaningful banner
    return null;
  }
  if (!browserTz) return null;

  const browserCity = browserTz.replace(/_/g, ' ').split('/').pop() || browserTz;
  const locationCity = locationName || locationTz.replace(/_/g, ' ').split('/').pop() || locationTz;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-md z-50
      bg-gradient-to-br from-[#2d1b69]/90 via-[#1a1040]/95 to-[#0a0e27]/95
      border border-amber-500/30 rounded-xl p-4 shadow-xl backdrop-blur-sm">
      <button
        onClick={confirmCurrent}
        className="absolute top-2 right-2 text-text-secondary hover:text-text-primary p-1"
        aria-label="Dismiss"
      >
        <X className="w-4 h-4" />
      </button>
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-2">
          <p className="text-text-primary text-sm leading-snug">
            Your device is in <strong className="text-gold-light">{browserCity}</strong> but
            showing panchang for <strong className="text-gold-light">{locationCity}</strong>.
          </p>
          <p className="text-text-secondary text-xs">
            Travelled recently? Update your location. Using a VPN? Keep the current city.
          </p>
          <div className="flex items-center gap-3 mt-2">
            <button
              onClick={clearAndRedetect}
              className="flex items-center gap-1.5 text-xs font-medium text-gold-primary hover:text-gold-light transition-colors"
            >
              <MapPin className="w-3.5 h-3.5" />
              Update my location
            </button>
            <button
              onClick={confirmCurrent}
              className="text-xs text-text-secondary hover:text-text-primary transition-colors"
            >
              Keep {locationCity}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
