/**
 * Simple structured logger for API routes
 * Outputs to console in development, can be extended for production logging services
 */

type LogLevel = 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  route?: string;
  ip?: string;
  duration?: number;
  error?: string;
  meta?: Record<string, unknown>;
}

function formatLog(entry: LogEntry): string {
  const ts = new Date().toISOString();
  const parts = [`[${ts}]`, `[${entry.level.toUpperCase()}]`];
  if (entry.route) parts.push(`[${entry.route}]`);
  parts.push(entry.message);
  if (entry.duration !== undefined) parts.push(`(${entry.duration}ms)`);
  if (entry.error) parts.push(`| Error: ${entry.error}`);
  return parts.join(' ');
}

export function logInfo(message: string, meta?: Partial<LogEntry>) {
  console.log(formatLog({ level: 'info', message, ...meta }));
}

export function logWarn(message: string, meta?: Partial<LogEntry>) {
  console.warn(formatLog({ level: 'warn', message, ...meta }));
}

export function logError(message: string, meta?: Partial<LogEntry>) {
  console.error(formatLog({ level: 'error', message, ...meta }));
}

/**
 * Measure API route execution time
 */
export function withTiming<T>(fn: () => T, route: string): { result: T; duration: number } {
  const start = performance.now();
  const result = fn();
  const duration = Math.round(performance.now() - start);
  logInfo('Request processed', { route, duration });
  return { result, duration };
}
