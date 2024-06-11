import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import { accounts } from '@@/server/modules/accounts/accounts.schema';
import { institutions } from '@@/server/modules/institutions/institutions.schema';
import { classes } from '@@/server/modules/learning-plans/classes.schema';
import { users } from '@@/server/modules/users/users.schema';
import { verificationTokens } from '@@/server/modules/verification-tokens/verification-tokens.schema';

const conn = postgres(process.env.DATABASE_URL!);

export default drizzle(conn, {
  logger: true,
  schema: {
    accounts,
    users,
    verificationTokens,
    institutions,
    classes,
  },
});
