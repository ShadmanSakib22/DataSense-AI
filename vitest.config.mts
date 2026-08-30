import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
  },
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'src'),
      'sql-guardrails': path.resolve(import.meta.dirname, 'packages/sql-guardrails/src'),
    },
  },
});
