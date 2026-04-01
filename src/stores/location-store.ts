'use client';

import { create } from 'zustand';

interface LocationState {
  lat: number | null;
  lng: number | null;
  name: string;
  confirmed: boolean;
  detecting: boolean;
  setLocation: (lat: number, lng: number, name: string) => void;
  setDetecting: (v: boolean) => void;
  detect: () => void;
}

export const useLocationStore = create<LocationState>((set, get) => ({
  lat: null,
  lng: null,
  name: '',
  confirmed: false,
  detecting: false,

  setLocation: (lat, lng, name) => set({ lat, lng, name, confirmed: true, detecting: false }),
  setDetecting: (v) => set({ detecting: v }),

  detect: () => {
    if (get().confirmed || get().detecting) return;
    set({ detecting: true });

    const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10`);
        const data = await res.json();
        const city = data.address?.city || data.address?.town || data.address?.village || '';
        const country = data.address?.country || '';
        return [city, country].filter(Boolean).join(', ') || `${lat.toFixed(2)}°, ${lng.toFixed(2)}°`;
      } catch {
        return `${lat.toFixed(2)}°, ${lng.toFixed(2)}°`;
      }
    };

    const fromIP = () => {
      fetch('https://ipapi.co/json/')
        .then(res => res.json())
        .then(data => {
          if (data.latitude && data.longitude) {
            const name = [data.city, data.country_name].filter(Boolean).join(', ');
            set({ lat: data.latitude, lng: data.longitude, name, confirmed: true, detecting: false });
          } else {
            set({ detecting: false });
          }
        })
        .catch(() => set({ detecting: false }));
    };

    if (!('geolocation' in navigator)) { fromIP(); return; }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const name = await reverseGeocode(latitude, longitude);
        set({ lat: latitude, lng: longitude, name, confirmed: true, detecting: false });
      },
      () => fromIP(),
      { timeout: 8000 }
    );
  },
}));
