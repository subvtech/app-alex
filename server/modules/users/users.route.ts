import { TRPCError } from '@trpc/server';
import { hash } from 'bcrypt';
import { z } from 'zod';

import { sendConfirmationEmail, sendResetPasswordEmail } from '../../lib/mail';
import { protectedProcedure, publicProcedure, router } from '../../lib/trpc';

import {
  generateVerificationToken,
  getVerificationToken,
  removeVerificationTokens,
} from '../verification-tokens/verification-tokens.service';
import {
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
      const vToken = await getVerificationToken(input.token);

      if (!vToken) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'invalid_token',
        });
      }

      const user = await getUserByEmail(vToken.identifier);

      if (!user) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'invalid_email',
        });
      }

      await update({ id: user.id, emailVerified: new Date() });
      await removeVerificationTokens(user.email, 'email_confirmation');

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
      if (await getUserByEmail(input.email)) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'email_already_taken',
        });
      }

      const hashed = await hash(input.password, 10);
      const user = await register({ ...input, password: hashed });

      const { token } = await generateVerificationToken({
        email: user.email,
        type: 'email_confirmation',
      });

      await sendConfirmationEmail({ email: user.email, token, user });

      return { success: 'confirmation_email_sent' };
    }),

  resetPassword: publicProcedure
    .input(
      z.object({
        password: z.string(),
        passwordConfirm: z.string(),
        token: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const vToken = await getVerificationToken(input.token);

      if (!vToken || new Date(vToken.expires) < new Date()) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'invalid_token',
        });
      }

      const user = await getUserByEmail(vToken.identifier);

      if (!user) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'invalid_email',
        });
      }

      if (input.password !== input.passwordConfirm) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'passwords_do_not_match',
        });
      }

      // TODO: Fazer blacklist de senhas utilizadas?
      const hashed = await hash(input.password, 10);
      await update({ id: user.id, password: hashed });
      await removeVerificationTokens(user.email, 'reset_password');

      return { success: 'password_updated' };
    }),

  sendConfirmEmail: publicProcedure
    .input(z.string())
    .mutation(async ({ input: email }) => {
      const user = await getUserByEmail(email);

      if (user) {
        const { token } = await generateVerificationToken({
          email: user.email,
          type: 'email_confirmation',
        });

        await sendConfirmationEmail({ email: user.email, token, user });
      }
    }),

  sendResetPasswordEmail: publicProcedure
    .input(z.string())
    .mutation(async ({ input: email }) => {
      const user = await getUserByEmail(email);

      if (!user) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'invalid_email',
        });
      }

      const { token } = await generateVerificationToken({
        email: user.email,
        type: 'reset_password',
      });

      await sendResetPasswordEmail({ email: user.email, token });

      return { success: 'reset_password_email_sent' };
    }),
});
