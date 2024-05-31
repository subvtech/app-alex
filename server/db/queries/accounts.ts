import { eq } from 'drizzle-orm';

import db from '@/server/db';
import { accounts } from '@/server/db/schemas/accounts';

export const getAccountByUserId = async (id: string) => {
  try {
    return (await db.select().from(accounts).where(eq(accounts.userId, id)))[0];
  } catch {
    return null;
  }
};
