'use client';

import { useState, useEffect } from 'react';
import { useLocationStore } from '@/stores/location-store';
import { MapPin, AlertTriangle, X } from 'lucide-react';

const SESSION_KEY = 'dp-tz-mismatch-dismissed';

export default function TimezoneMismatchBanner() {
  const { timezone: locationTz, name: locationName, confirmed, detect } = useLocationStore();
  const [browserTz, setBrowserTz] = useState<string | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    try { setBrowserTz(Intl.DateTimeFormat().resolvedOptions().timeZone); }
    catch { /* can't detect browser timezone */ }
  }, []);

  useEffect(() => {
    if (!browserTz || !locationTz) return;
    if (confirmed) return; // User explicitly chose this location — respect it
    try { if (sessionStorage.getItem(SESSION_KEY)) return; } catch { /* proceed if sessionStorage unavailable */ }
    if (browserTz === locationTz) return;

    // Check if same UTC offset right now (handles aliases like Europe/Berlin ≈ Europe/Zurich)
    try {
      const now = new Date();
      const getOffset = (tz: string) =>
        new Intl.DateTimeFormat('en-US', { timeZone: tz, timeZoneName: 'shortOffset' })
          .formatToParts(now)
          .find(p => p.type === 'timeZoneName')?.value;
      if (getOffset(browserTz) === getOffset(locationTz)) return;
    } catch { /* show banner on error */ }

    setShow(true);
  }, [browserTz, locationTz, confirmed]);

  const dismiss = () => {
    setShow(false);
    try { sessionStorage.setItem(SESSION_KEY, '1'); } catch { /* ignore if sessionStorage unavailable */ }
  };

  const useDeviceLocation = () => {
    dismiss();
    detect();
  };

  if (!show || !browserTz || !locationTz) return null;

  const browserCity = browserTz.replace(/_/g, ' ').split('/').pop() || browserTz;
  const locationCity = locationName || locationTz.replace(/_/g, ' ').split('/').pop() || locationTz;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-md z-50
      bg-gradient-to-br from-[#2d1b69]/90 via-[#1a1040]/95 to-[#0a0e27]/95
      border border-amber-500/30 rounded-xl p-4 shadow-xl backdrop-blur-sm">
      <button
        onClick={dismiss}
        className="absolute top-2 right-2 text-text-secondary hover:text-text-primary p-1"
        aria-label="Dismiss timezone mismatch banner"
      >
        <X className="w-4 h-4" />
      </button>
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-2">
          <p className="text-text-primary text-sm leading-snug">
            Your device is in <strong className="text-gold-light">{browserCity}</strong> but
            showing panchang for <strong className="text-gold-light">{locationCity}</strong> ({locationTz}).
          </p>
          <p className="text-text-secondary text-xs">
            This can happen with a VPN or when travelling. Times shown are for {locationCity}.
          </p>
          <div className="flex items-center gap-3 mt-2">
            <button
              onClick={useDeviceLocation}
              className="flex items-center gap-1.5 text-xs font-medium text-gold-primary hover:text-gold-light transition-colors"
            >
              <MapPin className="w-3.5 h-3.5" />
              Use my actual location
            </button>
            <button
              onClick={dismiss}
              className="text-xs text-text-secondary hover:text-text-primary transition-colors"
            >
              Continue with {locationCity}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
