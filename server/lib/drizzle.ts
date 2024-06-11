import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import { accounts } from '@@/server/modules/accounts/accounts.schema';
import { users } from '@@/server/modules/users/users.schema';
import { verificationTokens } from '@@/server/modules/verification-tokens/verification-tokens.schema';

const conn = postgres(process.env.DATABASE_URL!);

export default drizzle(conn, {
  logger: true,
  schema: {
    accounts,
    users,
    verificationTokens,
  },
});
