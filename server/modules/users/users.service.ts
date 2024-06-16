import { eq } from 'drizzle-orm';

import db from '@@/server/lib/drizzle';
import { curry } from '@@/utils/curry';
import { sendVerificationEmail } from '@@/server/lib/mail';

import { generateVerificationToken } from '../verification-tokens/verification-tokens.service';
import { User, UserInsert, users } from './users.schema';

// TODO: Limitar o envio de e-mails por X horas.
export async function generateAndSendVerificationEmail(user: User) {
  const verificationToken = await generateVerificationToken(
    user.email,
    'email_confirmation',
  );

  await sendVerificationEmail({
    email: verificationToken.identifier,
    token: verificationToken.token,
    user: user!,
  });
}

export const getUserBy = curry(async (field: keyof User, value: string) => {
  try {
    return await db.query.users.findFirst({ where: eq(users[field], value) });
  } catch {
    return null;
  }
});

export const getUserByEmail = getUserBy('email');

export const getUserById = getUserBy('id');

export async function register(data: UserInsert) {
  return (await db.insert(users).values(data).returning())[0];
}

export async function update(data: Partial<User>) {
  return (
    await db
      .update(users)
      .set(data)
      .where(eq(users[data.id ? 'id' : 'email'], (data.id || data.email)!))
      .returning()
  )[0];
}
