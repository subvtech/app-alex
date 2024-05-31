import type { User as AlexUser } from '@/server/db/schemas/users';

declare module '@auth/core/types' {
  interface User extends AlexUser {}
}

export {};
