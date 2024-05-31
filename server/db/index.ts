import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import { accounts } from './schemas/accounts';
import { users } from './schemas/users';

const conn = postgres(process.env.DATABASE_URL!);

export default drizzle(conn, {
  logger: true,
  schema: {
    accounts,
    users,
  },
});
