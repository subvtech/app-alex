import Credentials from '@auth/core/providers/credentials';
import type { AuthConfig } from '@auth/core/types';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { compare } from 'bcrypt';
import { NuxtAuthHandler } from '#auth';

import db from '@/server/db';
import { getUserByEmail, setEmailVerified } from '@/server/db/repository/users';
import { LoginSchema, accounts } from '@/server/db/schemas/accounts';
import { users } from '@/server/db/schemas/users';
import { verificationTokens } from '@/server/db/schemas/verification-tokens';

const runtimeConfig = useRuntimeConfig();

export const authOptions: AuthConfig = {
  basePath: '/api/auth',
  secret: runtimeConfig.authJs?.secret || '',
  adapter: DrizzleAdapter(db, {
    accountsTable: accounts,
    usersTable: users,
    verificationTokensTable: verificationTokens,
  }),
  session: {
    strategy: 'jwt',
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const validate = LoginSchema.safeParse(credentials);
        if (!validate.success) return null;

        const { email, password } = validate.data;
        const user = await getUserByEmail(email);
        if (!user || !user.password) return null;

        const passwordMatch = await compare(password, user.password);
        if (!passwordMatch) return null;

        return user;
      },
    }),
  ],
  events: {
    async linkAccount({ user }) {
      await setEmailVerified(user.email!);
    },
  },
  callbacks: {
    async signIn({ user }) {
      const existingUser = await getUserByEmail(user.email!);

      return !!existingUser?.emailVerified;
    },
    jwt({ token, user }) {
      if (user) {
        token.email = user.email;
        token.name = user.name;
        // token.isOAuth = !!(await getAccountByUserId(user.id));
        // token.isTwoFactorEnabled = user.isTwoFactorEnabled;
        // token.role = user.role;
      }

      return token;
    },
    session({ session, token }) {
      session.user.id = token.sub!;
      // session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
      // session.user.isOAuth = token.isOAuth as boolean;
      // session.user.role = token.role as UserRole;

      return session;
    },
  },
};

export default NuxtAuthHandler(authOptions, runtimeConfig);
