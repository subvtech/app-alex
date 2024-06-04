import { eq } from 'drizzle-orm';

import db from '@/server/db';
import { users } from '@/server/db/schemas/users';

export const getUserById = async (id: string) => {
  try {
    return await db.query.users.findFirst({
      where: eq(users.id, id),
    });
  } catch {
    return null;
  }
};
