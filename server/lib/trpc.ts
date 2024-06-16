/**
 * This is your entry point to setup the root configuration for tRPC on the server.
 * - `initTRPC` should only be used once per app.
 * - We export only the functionality that we use so we can enforce which base procedures should be used
 *
 * Learn how to create protected base procedures and other things below:
 * @see https://trpc.io/docs/server/routers
 * @see https://trpc.io/docs/server/procedures
 */
import { initTRPC, TRPCError } from '@trpc/server';

import { Context } from './trpc.context';

const t = initTRPC.context<Context>().create();

export const router = t.router;

export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(function (opts) {
  const { ctx, next } = opts;

  if (!ctx.session?.user || new Date(ctx.session.expires) < new Date()) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'unauthorized' });
  }

  return next({ ctx });
});
