import { TRPCError } from '@trpc/server';
import { hash } from 'bcrypt';
import { z } from 'zod';

import { publicProcedure, router } from '@@/server/lib/trpc';
import { sendVerificationEmail } from '@@/server/lib/mail';

import { generateVerificationToken } from '../verification-tokens/verification-tokens.service';
import {
  getUserBy,
  getUserByEmail,
  getUserById,
  register,
} from './users.service';
import { registerUserSchema, selectUserSchema } from './users.validator';

// TODO: Reenviar email de confirmação de cadastro ao tentar fazer login sem ter confirmado antes

export const usersRouter = router({
  getById: publicProcedure
    .input(selectUserSchema.pick({ id: true }))
    .query(({ input }) => getUserById(input.id)),

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
