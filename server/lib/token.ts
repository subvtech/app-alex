import {
  createVerificationToken,
  removeVerificationTokensByEmail,
} from '@/server/db/repository/verification-tokens';

const ONE_HOUR = 3600 * 1000;

export const generateVerificationToken = async (email: string) => {
  await removeVerificationTokensByEmail(email);

  return await createVerificationToken({
    identifier: email,
    token: crypto.randomUUID(),
    expires: new Date(new Date().getTime() + ONE_HOUR),
  });
};
