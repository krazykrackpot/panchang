'use client';

import { useEffect } from 'react';
import { captureUtm, getUtmParams, getReferrerContext } from '@/lib/utm';
import { trackUtmEvent } from '@/lib/analytics';

export function UtmCapture() {
  useEffect(() => {
    captureUtm();

    const utm = getUtmParams();
    const ref = getReferrerContext();
    if (utm || ref) {
      trackUtmEvent('page_view');
    }
  }, []);

  return null;
}
