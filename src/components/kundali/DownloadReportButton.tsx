'use client';

import { FileText } from 'lucide-react';

interface Props {
  birthData: {
    name: string;
    date: string;
    time: string;
    lat: number;
    lng: number;
    timezone: string;
    place?: string;
  };
  locale: string;
}

export default function DownloadReportButton({ birthData, locale }: Props) {
  const handleDownload = () => {
    const params = new URLSearchParams({
      name: birthData.name,
      date: birthData.date,
      time: birthData.time,
      lat: String(birthData.lat),
      lng: String(birthData.lng),
      timezone: birthData.timezone,
      locale,
    });
    if (birthData.place) {
      params.set('place', birthData.place);
    }
    window.open(`/api/kundali-report?${params}`, '_blank');
  };

  return (
    <button
      onClick={handleDownload}
      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-gradient-to-r from-gold-primary/15 to-amber-500/10 border border-gold-primary/40 text-gold-light hover:from-gold-primary/25 hover:to-amber-500/20 hover:border-gold-primary/60 transition-all duration-300"
      aria-label="Download full birth chart report"
    >
      <FileText className="w-4 h-4" />
      Full Report
    </button>
  );
}
