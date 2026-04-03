'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Bell, TrendingUp, Globe, Calendar, AlertTriangle, LayoutDashboard, Info, Check } from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import { getSupabase } from '@/lib/supabase/client';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Notification {
  id: string;
  type: string;
  title: string;
  body: string;
  metadata: Record<string, unknown>;
  read: boolean;
  created_at: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function timeAgo(dateStr: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

const TYPE_ICONS: Record<string, { icon: typeof Bell; color: string }> = {
  dasha_transition: { icon: TrendingUp, color: 'text-gold-primary' },
  transit_alert: { icon: Globe, color: 'text-amber-400' },
  festival_reminder: { icon: Calendar, color: 'text-emerald-400' },
  sade_sati: { icon: AlertTriangle, color: 'text-red-400' },
  weekly_digest: { icon: LayoutDashboard, color: 'text-blue-400' },
  system: { icon: Info, color: 'text-text-secondary' },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function NotificationBell() {
  const { session } = useAuthStore();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const authFailedRef = useRef(false);

  // ---- Fetch notifications ----
  const fetchNotifications = useCallback(async () => {
    if (authFailedRef.current) return;
    const token = session?.access_token;
    if (!token) return;

    try {
      const res = await fetch('/api/notifications', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        authFailedRef.current = true;
        setNotifications([]);
        setUnreadCount(0);
        return;
      }
      if (!res.ok) return;
      const data = await res.json();
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch {
      // Silently fail — non-critical UI feature
    }
  }, [session?.access_token]);

  // Fetch on mount and poll every 60 seconds — only when authenticated
  useEffect(() => {
    authFailedRef.current = false; // reset on new session
    if (!session?.access_token) return;
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60_000);
    return () => clearInterval(interval);
  }, [fetchNotifications, session?.access_token]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ---- Actions ----
  const markRead = async (id: string) => {
    const token = session?.access_token;
    if (!token) return;

    // Optimistic update
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
    setUnreadCount((c) => Math.max(0, c - 1));

    try {
      await fetch('/api/notifications', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'mark_read', id }),
      });
    } catch {
      // Revert on failure
      fetchNotifications();
    }
  };

  const markAllRead = async () => {
    const token = session?.access_token;
    if (!token) return;

    setLoading(true);

    // Optimistic update
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);

    try {
      await fetch('/api/notifications', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'mark_all_read' }),
      });
    } catch {
      fetchNotifications();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div ref={ref} className="relative">
      {/* Bell button */}
      <button
        onClick={() => setOpen(!open)}
        className="relative text-text-secondary hover:text-gold-light transition-colors p-1.5 rounded-lg hover:bg-gold-primary/10"
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
        aria-expanded={open}
        aria-haspopup="true"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 flex items-center justify-center px-1 text-[10px] font-bold bg-red-500 text-white rounded-full leading-none">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute top-full right-0 mt-2 w-80 sm:w-96 bg-bg-primary/95 backdrop-blur-xl border border-gold-primary/20 rounded-xl shadow-2xl shadow-black/40 z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gold-primary/10">
            <h3 className="text-sm font-semibold text-text-primary">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                disabled={loading}
                className="flex items-center gap-1 text-xs text-gold-primary hover:text-gold-light transition-colors disabled:opacity-50"
              >
                <Check className="w-3 h-3" />
                Mark all read
              </button>
            )}
          </div>

          {/* Notification list */}
          <div className="max-h-[400px] overflow-y-auto overscroll-contain">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-text-secondary text-sm">
                No notifications yet
              </div>
            ) : (
              notifications.map((notif) => {
                const typeConfig = TYPE_ICONS[notif.type] || TYPE_ICONS.system;
                const IconComponent = typeConfig.icon;

                return (
                  <button
                    key={notif.id}
                    onClick={() => {
                      if (!notif.read) markRead(notif.id);
                    }}
                    className={`w-full text-left px-4 py-3 flex gap-3 transition-colors hover:bg-gold-primary/5 border-b border-gold-primary/5 last:border-b-0 ${
                      notif.read ? 'opacity-60' : ''
                    }`}
                  >
                    {/* Icon */}
                    <div className={`shrink-0 mt-0.5 ${typeConfig.color}`}>
                      <IconComponent className="w-4 h-4" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-sm leading-tight ${notif.read ? 'text-text-secondary' : 'text-text-primary font-medium'}`}>
                          {notif.title}
                        </p>
                        {!notif.read && (
                          <span className="shrink-0 w-2 h-2 mt-1.5 rounded-full bg-gold-primary" />
                        )}
                      </div>
                      <p className="text-xs text-text-secondary mt-0.5 line-clamp-2 leading-relaxed">
                        {notif.body}
                      </p>
                      <p className="text-[10px] text-text-secondary/60 mt-1">
                        {timeAgo(notif.created_at)}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
