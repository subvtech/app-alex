import type { AuthConfig } from '@auth/core/types';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import Credentials from '@auth/core/providers/credentials';
import { NuxtAuthHandler } from '#auth';
import db from '@/server/db';
import {
  accounts,
  sessions,
  users,
  verificationTokens,
} from '@/server/db/schemas/auth';

// The #auth virtual import comes from this module. You can use it on the client
// and server side, however not every export is universal. For example do not
// use sign-in and sign-out on the server side.

const runtimeConfig = useRuntimeConfig();

// Refer to Auth.js docs for more details
export const authOptions: AuthConfig = {
  basePath: '/api/auth',
  secret: runtimeConfig.authJs?.secret || '',
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  providers: [
    Credentials({
      type: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const user = null;
        // const user = { id: '1', name: 'Djalma' };
        await console.log(credentials);

        if (!user) {
          // No user found, so this is their first attempt to login
          // meaning this is also the place you could do registration
          throw new Error('User not found.');
        }

        return user;
      },
    }),
  ],
};

export default NuxtAuthHandler(authOptions, runtimeConfig);
