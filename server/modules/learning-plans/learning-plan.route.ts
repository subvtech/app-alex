import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { findAll } from './learning-plan.service';
import {
  protectedProcedure,
  publicProcedure,
  router,
} from '@@/server/lib/trpc';

export const learningPlanRouter = router({
  me: protectedProcedure.mutation(async () => {
    const courses = await findAll();
    console.log(courses);
    return courses;
  }),
});
