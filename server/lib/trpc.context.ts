import { inferAsyncReturnType } from '@trpc/server';
import { H3Event } from 'h3';
import { getServerSession, getServerToken } from '#auth';

import { authOptions } from '@/server/api/auth/[...]';

export async function createContext(event: H3Event) {
  const jwt = await getServerToken(event, authOptions, useRuntimeConfig());
  const session = await getServerSession(event, authOptions);

  return { jwt, session };
}

export type Context = inferAsyncReturnType<typeof createContext>;
