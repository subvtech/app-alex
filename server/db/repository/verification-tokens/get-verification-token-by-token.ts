import { eq } from 'drizzle-orm';

import db from '@/server/db';
import { verificationTokens } from '@/server/db/schemas/verification-tokens';

export const getVerificationTokenByToken = async (token: string) => {
  try {
    return await db.query.verificationTokens.findFirst({
      where: eq(verificationTokens.token, token),
    });
  } catch {
    return null;
  }
};
