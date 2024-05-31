import { eq } from 'drizzle-orm';

import db from '@/server/db';
import { users } from '@/server/db/schemas/users';

export const getUserByEmail = async (email: string) => {
  try {
    return (await db.select().from(users).where(eq(users.email, email)))[0];
  } catch {
    return null;
  }
};

export const getUserById = async (id: string) => {
  try {
    return (await db.select().from(users).where(eq(users.email, id)))[0];
  } catch {
    return null;
  }
};
