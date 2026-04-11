'use client';

import { useState, useEffect, useCallback } from 'react';
import { Bell, BellOff, BellRing } from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '';

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  return Uint8Array.from(rawData, (char) => char.charCodeAt(0));
}

interface PushPermissionProps {
  locale: string;
}

export default function PushPermission({ locale }: PushPermissionProps) {
  const { session } = useAuthStore();
  const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>('default');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const isHi = locale !== 'en' && String(locale) !== 'ta';

  useEffect(() => {
    if (typeof window === 'undefined' || !('Notification' in window) || !('serviceWorker' in navigator)) {
      setPermission('unsupported');
      return;
    }
    setPermission(Notification.permission);

    // Check existing subscription
    navigator.serviceWorker.ready.then(reg => {
      reg.pushManager.getSubscription().then(sub => {
        setIsSubscribed(!!sub);
      });
    });
  }, []);

  const subscribe = useCallback(async () => {
    if (!session?.access_token || !VAPID_PUBLIC_KEY) return;
    setLoading(true);

    try {
      const perm = await Notification.requestPermission();
      setPermission(perm);
      if (perm !== 'granted') { setLoading(false); return; }

      const reg = await navigator.serviceWorker.ready;
      const subscription = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY) as BufferSource,
      });

      const res = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ subscription: subscription.toJSON() }),
      });

      if (res.ok) setIsSubscribed(true);
    } catch (err) {
      console.error('[PushPermission] Subscribe error:', err);
    }
    setLoading(false);
  }, [session]);

  const unsubscribe = useCallback(async () => {
    if (!session?.access_token) return;
    setLoading(true);

    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        const endpoint = sub.endpoint;
        await sub.unsubscribe();

        await fetch('/api/push/subscribe', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ endpoint }),
        });
      }
      setIsSubscribed(false);
    } catch (err) {
      console.error('[PushPermission] Unsubscribe error:', err);
    }
    setLoading(false);
  }, [session]);

  // Don't show for unsupported browsers, denied permission, or unauthenticated users
  if (permission === 'unsupported' || permission === 'denied' || !session) return null;

  if (isSubscribed) {
    return (
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
        <BellRing className="w-4 h-4 text-emerald-400 shrink-0" />
        <span className="text-emerald-300 text-xs font-medium flex-1">
          {isHi ? 'सूचनाएं सक्रिय — दैनिक पंचांग, ग्रहण, दशा अलर्ट' : 'Notifications active — daily panchang, eclipses, dasha alerts'}
        </span>
        <button
          onClick={unsubscribe}
          disabled={loading}
          className="text-text-secondary/50 hover:text-red-400 text-xs transition-colors"
        >
          <BellOff className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-[#2d1b69]/30 to-purple-900/20 border border-purple-500/20">
      <Bell className="w-4 h-4 text-gold-primary shrink-0" />
      <span className="text-text-secondary text-xs flex-1">
        {isHi ? 'दैनिक पंचांग, त्योहार और ग्रहण की सूचनाएं प्राप्त करें' : 'Get daily panchang, festival, and eclipse notifications'}
      </span>
      <button
        onClick={subscribe}
        disabled={loading}
        className="px-3 py-1 rounded-lg bg-gold-primary/15 border border-gold-primary/30 text-gold-light text-xs font-medium hover:bg-gold-primary/25 transition-colors disabled:opacity-50"
      >
        {loading ? '...' : isHi ? 'सक्रिय करें' : 'Enable'}
      </button>
    </div>
  );
}
