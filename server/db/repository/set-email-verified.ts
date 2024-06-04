import { eq } from 'drizzle-orm';

import db from '@/server/db';
import { users } from '@/server/db/schemas/users';

export const setEmailVerified = async (email: string) => {
  await db
    .update(users)
    .set({ emailVerified: new Date() })
    .where(eq(users.email, email));
};
