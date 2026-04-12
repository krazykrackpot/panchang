'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';

const EclipseAlert = dynamic(() => import('@/components/dashboard/EclipseAlert'), { ssr: false });
const TransitForecastWidget = dynamic(() => import('@/components/panchang/TransitForecastWidget'), { ssr: false });
const TodayPanchangWidget = dynamic(() => import('@/components/panchang/TodayPanchangWidget'), { ssr: false });

export default function HomeClientWidgets({ locale }: { locale: string }) {
  return (
    <>
      <Suspense fallback={<div className="text-center py-12 text-text-secondary">Loading panchang...</div>}>
        <TodayPanchangWidget />
      </Suspense>
      <div className="mt-6">
        <Suspense fallback={<div className="text-center py-8 text-text-secondary">Loading transits...</div>}>
          <TransitForecastWidget locale={locale} />
        </Suspense>
      </div>
      <div className="mt-6">
        <Suspense fallback={null}>
          <EclipseAlert />
        </Suspense>
      </div>
    </>
  );
}
