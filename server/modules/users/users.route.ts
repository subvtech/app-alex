import { TRPCError } from '@trpc/server';
import { hash } from 'bcrypt';
import { z } from 'zod';

import { sendVerificationEmail } from '@@/server/lib/mail';
import {
  protectedProcedure,
  publicProcedure,
  router,
} from '@@/server/lib/trpc';

import { generateVerificationToken } from '../verification-tokens/verification-tokens.service';
import {
  getUserBy,
  getUserByEmail,
  getUserById,
  register,
} from './users.service';
import { registerUserSchema } from './users.validator';

// TODO: Reenviar email de confirmação de cadastro ao tentar fazer login sem ter confirmado antes

export const usersRouter = router({
  getById: protectedProcedure
    .input(z.string().optional())
    .query(({ input: id }) => (id ? getUserById(id) : null)),

  isAlreadyTaken: publicProcedure
    .input(z.object({ field: z.string(), value: z.string() }))
    .query(async ({ input }) => {
      return !!(await getUserBy(input.field as never, input.value));
    }),

  register: publicProcedure.input(registerUserSchema).mutation(async function ({
    input,
  }): Promise<{ error?: string; success?: string }> {
    const existingUser = await getUserByEmail(input.email);

    if (existingUser) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'email_already_taken',
      });
    }

    const hashedPassword = await hash(input.password, 10);
    await register({ ...input, password: hashedPassword });

    const verificationToken = await generateVerificationToken(
      input.email,
      'email_confirmation',
    );

    await sendVerificationEmail(
      verificationToken.identifier,
      verificationToken.token,
    );

    return { success: 'confirmation_email_sent' };
  }),
});
