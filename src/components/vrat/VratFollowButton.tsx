'use client';

import { Bell, BellRing } from 'lucide-react';
import { useVratTrackingStore } from '@/stores/vrat-tracking-store';
import { requestNotificationPermission } from '@/lib/notifications/panchang-alerts';

interface VratFollowButtonProps {
  slug: string;
  name: string;
  size?: 'sm' | 'md';
}

export default function VratFollowButton({ slug, name, size = 'md' }: VratFollowButtonProps) {
  const { followedVrats, followVrat, unfollowVrat } = useVratTrackingStore();
  const isFollowing = followedVrats.includes(slug);

  const handleClick = async () => {
    if (isFollowing) {
      unfollowVrat(slug);
      return;
    }

    // First follow — prompt for notification permission if not yet granted
    if (followedVrats.length === 0) {
      try {
        await requestNotificationPermission();
      } catch (err) {
        console.warn('[VratFollow] Notification permission request failed:', err);
        // Continue with follow even if notification permission denied —
        // the vrat calendar still works without push notifications
      }
    }

    followVrat(slug);
  };

  const iconSize = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4';
  const padding = size === 'sm' ? 'px-2 py-1 text-xs' : 'px-3 py-1.5 text-sm';

  return (
    <button
      onClick={handleClick}
      title={isFollowing ? `Unfollow ${name}` : `Follow ${name}`}
      aria-label={isFollowing ? `Unfollow ${name}` : `Follow ${name}`}
      aria-pressed={isFollowing}
      className={`inline-flex items-center gap-1.5 rounded-lg font-medium transition-all duration-200 ${padding} ${
        isFollowing
          ? 'bg-gold-primary/20 text-gold-light border border-gold-primary/40 hover:bg-gold-primary/10'
          : 'bg-bg-secondary/60 text-text-secondary border border-gold-primary/10 hover:text-gold-light hover:border-gold-primary/30 hover:bg-gold-primary/5'
      }`}
    >
      {isFollowing ? (
        <BellRing className={`${iconSize} text-gold-primary`} />
      ) : (
        <Bell className={iconSize} />
      )}
      {isFollowing ? 'Following' : 'Follow'}
    </button>
  );
}
