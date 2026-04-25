'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Link } from '@/lib/i18n/navigation';

const CelestialSphere = dynamic(
  () => import('@/components/3d/CelestialSphere').then(m => m.CelestialSphere),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-[500px] rounded-2xl border border-gold-primary/15 bg-gradient-to-br from-[#1a1040]/40 to-[#0a0e27]">
        <p className="text-text-secondary text-sm animate-pulse">Loading 3D scene...</p>
      </div>
    ),
  },
);

export default function Sky3DPage() {
  const [autoRotate, setAutoRotate] = useState(true);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gold-gradient">3D Celestial Sphere</h1>
        <p className="text-text-secondary text-sm">Interactive 3D view of the sidereal sky with real-time planet positions</p>
      </div>

      <div className="flex justify-center gap-3">
        <Link href="/sky" className="px-4 py-2 rounded-lg text-xs text-text-secondary border border-gold-primary/15 hover:border-gold-primary/30 transition-colors">
          2D Sky Map
        </Link>
        <button
          onClick={() => setAutoRotate(!autoRotate)}
          className={`px-4 py-2 rounded-lg text-xs transition-colors ${
            autoRotate ? 'bg-gold-primary/15 text-gold-light border border-gold-primary/30' : 'text-text-secondary border border-gold-primary/15'
          }`}
        >
          {autoRotate ? 'Auto-Rotate: ON' : 'Auto-Rotate: OFF'}
        </button>
      </div>

      <div className="rounded-2xl border border-gold-primary/15 overflow-hidden" style={{ height: 500 }}>
        <CelestialSphere autoRotate={autoRotate} />
      </div>

      <p className="text-text-secondary/60 text-xs text-center">
        Drag to rotate. Scroll to zoom. Planets shown at current sidereal positions (Lahiri ayanamsha).
      </p>
    </div>
  );
}
