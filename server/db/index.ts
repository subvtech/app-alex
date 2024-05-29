import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { accounts } from './schemas/accounts';
import { authenticators } from './schemas/authenticators';
import { sessions } from './schemas/sessions';
import { users } from './schemas/users';
import { verificationTokens } from './schemas/verification-tokens';

const conn = postgres(process.env.DATABASE_URL!);

export default drizzle(conn, {
  logger: true,
  schema: {
    accounts,
    authenticators,
    sessions,
    users,
    verificationTokens,
  },
});
