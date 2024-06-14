import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import { accounts } from '@@/server/modules/accounts/accounts.schema';
import { institutions } from '@@/server/modules/institutions/institutions.schema';
import { classes } from '@@/server/modules/classes-folder/classes.schema';
import { users } from '@@/server/modules/users/users.schema';
import { verificationTokens } from '@@/server/modules/verification-tokens/verification-tokens.schema';
import { learningPlans } from '../modules/learning-plans/learning-plans.schema';
import { tags } from '../modules/tags/tags.schema';

const conn = postgres(process.env.DATABASE_URL!);

export default drizzle(conn, {
  logger: true,
  schema: {
    accounts,
    users,
    verificationTokens,
    institutions,
    classes,
    learningPlans,
    tags,
  },
});
