import { eq } from 'drizzle-orm';

import db from '@/server/db';
import { verificationTokens } from '@/server/db/schemas/verification-tokens';

export const getVerificationTokenByEmail = async (email: string) => {
  try {
    return await db.query.verificationTokens.findFirst({
      where: eq(verificationTokens.identifier, email),
    });
  } catch {
    return null;
  }
};
