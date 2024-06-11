import { eq } from 'drizzle-orm';

import db from '@@/server/lib/drizzle';

import {
  VerificationToken,
  verificationTokens,
} from './verification-tokens.schema';

const ONE_HOUR = 3600 * 1000;

export const createVerificationToken = async (data: VerificationToken) => {
  return (await db.insert(verificationTokens).values(data).returning())[0];
};

export const generateVerificationToken = async (email: string) => {
  await removeVerificationTokensByEmail(email);

  return await createVerificationToken({
    identifier: email,
    token: crypto.randomUUID(),
    expires: new Date(new Date().getTime() + ONE_HOUR),
  });
};

export const getVerificationTokenByEmail = async (email: string) => {
  try {
    return await db.query.verificationTokens.findFirst({
      where: eq(verificationTokens.identifier, email),
    });
  } catch {
    return null;
  }
};

export const getVerificationTokenByToken = async (token: string) => {
  try {
    return await db.query.verificationTokens.findFirst({
      where: eq(verificationTokens.token, token),
    });
  } catch {
    return null;
  }
};

export const removeVerificationTokensByEmail = async (email: string) => {
  await db
    .delete(verificationTokens)
    .where(eq(verificationTokens.identifier, email));
};
