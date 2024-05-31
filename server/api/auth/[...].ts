import Credentials from '@auth/core/providers/credentials';
import type { AuthConfig } from '@auth/core/types';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { compare } from 'bcrypt';
import { NuxtAuthHandler } from '#auth';

import db from '@/server/db';
import { getUserByEmail, getUserById } from '@/server/db/queries/users';
import { LoginSchema } from '@/server/db/schemas/accounts';

const runtimeConfig = useRuntimeConfig();

export const authOptions: AuthConfig = {
  basePath: '/api/auth',
  secret: runtimeConfig.authJs?.secret || '',
  adapter: DrizzleAdapter(db),
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
  callbacks: {
    async jwt({ token }) {
      if (!token.sub) return token;

      const user = await getUserById(token.sub);
      if (!user) return token;

      // token.isOAuth = !!(await getAccountByUserId(user.id));
      token.name = user.name;
      token.email = user.email;
      // token.role = user.role;
      // token.isTwoFactorEnabled = user.isTwoFactorEnabled;

      return token;
    },
    session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub!;
        // session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
        // session.user.role = token.role as UserRole;
        // session.user.isOAuth = token.isOAuth as boolean;
      }

      return session;
    },
  },
};

export default NuxtAuthHandler(authOptions, runtimeConfig);
