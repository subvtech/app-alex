import { eq } from 'drizzle-orm';

import db from '@/server/db';
import { accounts } from '@/server/db/schemas/accounts';

export const getAccountByUserId = async (id: string) => {
  try {
    return await db.query.accounts.findFirst({
      where: eq(accounts.userId, id),
    });
  } catch {
    return null;
  }
};
