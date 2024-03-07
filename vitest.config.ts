// vitest.config.ts
import { defineVitestConfig } from '@nuxt/test-utils/config';
export default defineVitestConfig({
  // @ts-ignore
  test: {
    environment: 'nuxt',
    globals: true,
  },
});
