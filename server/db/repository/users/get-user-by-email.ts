import { eq } from 'drizzle-orm';

import db from '@/server/db';
import { users } from '@/server/db/schemas/users';

export const getUserByEmail = async (email: string) => {
  try {
    return await db.query.users.findFirst({
      where: eq(users.email, email),
    });
  } catch {
    return null;
  }
};
