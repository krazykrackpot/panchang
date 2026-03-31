/**
 * Browser Notification System for Panchang Alerts
 * - Rahu Kaal start/end
 * - Festival reminders
 * - Eclipse warnings
 * - Muhurta windows
 */

export type AlertType = 'rahu_kaal' | 'festival' | 'eclipse' | 'muhurta' | 'general';

export interface PanchangAlert {
  id: string;
  type: AlertType;
  title: string;
  body: string;
  time: Date;
  fired?: boolean;
}

let scheduledTimers: NodeJS.Timeout[] = [];

export async function requestNotificationPermission(): Promise<boolean> {
  if (typeof window === 'undefined' || !('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;
  const result = await Notification.requestPermission();
  return result === 'granted';
}

export function isNotificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

export function getNotificationPermission(): string {
  if (!isNotificationSupported()) return 'unsupported';
  return Notification.permission;
}

export function showNotification(title: string, body: string, icon?: string) {
  if (getNotificationPermission() !== 'granted') return;
  try {
    new Notification(title, {
      body,
      icon: icon || '/icons/icon-192x192.png',
      badge: '/icons/icon-72x72.png',
      tag: `panchang-${Date.now()}`,
    });
  } catch {
    // Mobile may not support Notification constructor
  }
}

/**
 * Schedule alerts for today's panchang events
 */
export function scheduleAlerts(alerts: PanchangAlert[]) {
  // Clear previous timers
  clearAllAlerts();

  const now = Date.now();
  for (const alert of alerts) {
    const delay = alert.time.getTime() - now;
    if (delay > 0 && delay < 24 * 60 * 60 * 1000) {
      const timer = setTimeout(() => {
        showNotification(alert.title, alert.body);
      }, delay);
      scheduledTimers.push(timer);
    }
  }
}

export function clearAllAlerts() {
  scheduledTimers.forEach(t => clearTimeout(t));
  scheduledTimers = [];
}

/**
 * Generate alerts from panchang data
 */
export function generatePanchangAlerts(panchang: {
  date: string;
  rahuKaal?: { start: string; end: string };
  sunrise?: string;
}, locale: string = 'en'): PanchangAlert[] {
  const alerts: PanchangAlert[] = [];
  const dateStr = panchang.date;

  // Rahu Kaal alert (5 min before start)
  if (panchang.rahuKaal?.start) {
    const [h, m] = panchang.rahuKaal.start.split(':').map(Number);
    const rahuStart = new Date(`${dateStr}T${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`);
    const alertTime = new Date(rahuStart.getTime() - 5 * 60000);
    alerts.push({
      id: `rahu-${dateStr}`,
      type: 'rahu_kaal',
      title: locale === 'en' ? 'Rahu Kaal Starting' : 'राहु काल प्रारम्भ',
      body: locale === 'en'
        ? `Rahu Kaal begins at ${panchang.rahuKaal.start}. Avoid starting new activities.`
        : `राहु काल ${panchang.rahuKaal.start} पर शुरू। नए कार्य न करें।`,
      time: alertTime,
    });
  }

  return alerts;
}
