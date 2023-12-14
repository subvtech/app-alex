// vitest.config.ts
import { defineVitestConfig } from 'nuxt-vitest/config';

export default defineVitestConfig({
  // @ts-ignore
  test: {
    environment: 'nuxt',
    globals: true,
  },
});
