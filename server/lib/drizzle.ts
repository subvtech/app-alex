import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import { accounts } from '../modules/accounts/accounts.schema';
import { classes } from '../modules/classes/classes.schema';
import { institutions } from '../modules/institutions/institutions.schema';
import { learningPlans } from '../modules/learning-plans/learning-plans.schema';
import { tags } from '../modules/tags/tags.schema';
import { trailContributions } from '../modules/trail-contributions/trail-contributions.schema';
import { trails } from '../modules/trails/trails.schema';
import { users } from '../modules/users/users.schema';
import { verificationTokens } from '../modules/verification-tokens/verification-tokens.schema';

const conn = postgres(process.env.DATABASE_URL!);

// TODO: Adicionar o restante dos schemas
export default drizzle(conn, {
  logger: true,
  schema: {
    accounts,
    classes,
    institutions,
    learningPlans,
    tags,
    trailContributions,
    trails,
    users,
    verificationTokens,
  },
});
