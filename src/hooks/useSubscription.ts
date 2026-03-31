'use client';

import { useEffect } from 'react';
import { useSubscriptionStore } from '@/stores/subscription-store';
import { useAuthStore } from '@/stores/auth-store';

export function useSubscription() {
  const store = useSubscriptionStore();
  const user = useAuthStore(s => s.user);

  useEffect(() => {
    store.fetchSubscription();
    store.fetchUsage();
  }, [user?.id]);

  return store;
}
