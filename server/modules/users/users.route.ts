import { TRPCError } from '@trpc/server';
import { hash } from 'bcrypt';
import { z } from 'zod';

import {
  protectedProcedure,
  publicProcedure,
  router,
} from '@@/server/lib/trpc';

import {
  getVerificationTokenByToken,
  removeVerificationTokens,
} from '../verification-tokens/verification-tokens.service';
import {
  generateAndSendVerificationEmail,
  getUserBy,
  getUserByEmail,
  getUserById,
  register,
  update,
} from './users.service';
import { registerUserSchema } from './users.validator';

export const usersRouter = router({
  confirmEmail: publicProcedure
    .input(z.object({ token: z.string() }))
    .mutation(async ({ input }) => {
      const verificationToken = await getVerificationTokenByToken(input.token);

      if (!verificationToken) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'invalid_token',
        });
      }

      const user = await getUserByEmail(verificationToken.identifier);

      if (!user) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'invalid_email',
        });
      }

      await update({ id: user.id, emailVerified: new Date() });

      await removeVerificationTokens(
        verificationToken.identifier,
        'email_confirmation',
      );

      return { success: 'email_confirmed' };
    }),

  getById: protectedProcedure
    .input(z.string().optional())
    .query(({ input: id }) => (id ? getUserById(id) : null)),

  isAlreadyTaken: publicProcedure
    .input(z.object({ field: z.string(), value: z.string() }))
    .query(async ({ input }) => {
      return !!(await getUserBy(input.field as never, input.value));
    }),

  register: publicProcedure
    .input(registerUserSchema)
    .mutation(async ({ input }) => {
      const existingUser = await getUserByEmail(input.email);

      if (existingUser) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'email_already_taken',
        });
      }

      const hashed = await hash(input.password, 10);
      const user = await register({ ...input, password: hashed });

      await generateAndSendVerificationEmail(user);

      return { success: 'confirmation_email_sent' };
    }),

  sendConfirmEmail: publicProcedure
    .input(z.string())
    .mutation(async ({ input: email }) => {
      const user = await getUserByEmail(email);

      if (user) await generateAndSendVerificationEmail(user);
    }),
});
