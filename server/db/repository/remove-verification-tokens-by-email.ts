import { eq } from 'drizzle-orm';

import db from '@/server/db';
import { verificationTokens } from '@/server/db/schemas/verification-token';

export const removeVerificationTokensByEmail = async (email: string) => {
  await db
    .delete(verificationTokens)
    .where(eq(verificationTokens.identifier, email));
};
