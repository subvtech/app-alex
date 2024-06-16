import { and, eq } from 'drizzle-orm';

import db from '@@/server/lib/drizzle';

import {
  VerificationToken,
  verificationTokens,
} from './verification-tokens.schema';

// TODO: Verificar se vale a pena colocar um tempo de expiração para confirmação de cadastro.
// TODO: Colocar como variável de ambiente (ao menos o do reset de senha).
const ONE_HOUR = 3600 * 1000;

export const createVerificationToken = async (data: VerificationToken) => {
  return (await db.insert(verificationTokens).values(data).returning())[0];
};

export const generateVerificationToken = async (
  email: string,
  type: VerificationToken['type'],
) => {
  await removeVerificationTokens(email, type);

  return await createVerificationToken({
    type,
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

export const removeVerificationTokens = async (
  email: string,
  type: VerificationToken['type'],
) => {
  await db
    .delete(verificationTokens)
    .where(
      and(
        eq(verificationTokens.identifier, email),
        eq(verificationTokens.type, type),
      ),
    );
};
