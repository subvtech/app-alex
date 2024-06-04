import { createVerificationToken } from '@/server/db/repository/create-verification-token';
import { removeVerificationTokensByEmail } from '@/server/db/repository/remove-verification-tokens-by-email';

const ONE_HOUR = 3600 * 1000;

export const generateVerificationToken = async (email: string) => {
  await removeVerificationTokensByEmail(email);

  return await createVerificationToken({
    identifier: email,
    token: crypto.randomUUID(),
    expires: new Date(new Date().getTime() + ONE_HOUR),
  });
};
