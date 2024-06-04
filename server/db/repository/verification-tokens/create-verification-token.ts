import db from '@/server/db';
import {
  VerificationToken,
  verificationTokens,
} from '@/server/db/schemas/verification-tokens';

export const createVerificationToken = async (data: VerificationToken) => {
  return await db.insert(verificationTokens).values(data).returning();
};
