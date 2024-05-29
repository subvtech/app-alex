import { eq } from 'drizzle-orm';
import { createSelectSchema } from 'drizzle-zod';
import db from '~/server/db';
import { users } from '~/server/db/schemas/users';
import { publicProcedure, router } from '~/server/trpc/trpc';

const selectUserSchema = createSelectSchema(users);

export const usersRouter = router({
  getById: publicProcedure
    .input(selectUserSchema.pick({ id: true }))
    .query(async ({ input }) => {
      return (await db.select().from(users).where(eq(users.id, input.id)))[0];
    }),
  // create: publicProcedure
  //   .input(
  //     z.object({
  //       name: z.string().min(3),
  //       bio: z.string().max(142).optional(),
  //     }),
  //   )
  //   .mutation((opts) => {
  //     const id = Date.now().toString();
  //     const user: User = { id: +id, ...opts.input };
  //     users[user.id] = user;
  //     return user;
  //   }),
});
