import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx', 'tests/**/*.test.ts'],
    exclude: [
      'node_modules', '.next', 'e2e',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'text-summary', 'html', 'json-summary'],
      reportsDirectory: './test-results/coverage',
      include: [
        'src/lib/astronomy/**',
        'src/lib/panchang/**',
        'src/lib/kundali/**',
        'src/lib/matching/**',
        'src/lib/calendar/**',
        'src/lib/varshaphal/**',
        'src/lib/kp/**',
        'src/lib/prashna/**',
        'src/lib/jaimini/**',
        'src/lib/muhurta/**',
        'src/lib/utils/**',
      ],
    },
    testTimeout: 30000,
  },
});
