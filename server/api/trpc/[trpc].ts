/**
 * This is the API-handler of your app that contains all your API routes.
 * On a bigger app, you will probably want to split this file up into multiple files.
 */
import { createNuxtApiHandler } from 'trpc-nuxt';

import { router } from '@/server/lib/trpc';
import { usersRouter } from '@/server/modules/users/users.route';

export const appRouter = router({
  users: usersRouter,
});

export type AppRouter = typeof appRouter;

export default createNuxtApiHandler({
  router: appRouter,
  createContext: () => ({}),
});
