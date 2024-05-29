import 'dotenv/config';

import type { Config } from 'drizzle-kit';

const { DATABASE_URL = '' } = process.env;

export default {
  dbCredentials: { url: DATABASE_URL },
  dialect: 'postgresql',
  schema: './server/db/schemas/*',
  out: './server/db/migrations',
  strict: true,
  verbose: true,
  migrations: {
    // table: 'migrations', // default `__drizzle_migrations`,
    schema: 'public', // used in PostgreSQL only and default to `drizzle`
  },
} satisfies Config;
