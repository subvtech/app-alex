import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import { users } from './users.schema';

export const registerUserSchema = z.object({
  cpf: z.string().length(11),
  name: z.string().min(3),
  email: z.string().min(6).max(200),
  address: z.string().optional(),
  institution: z.string().optional(),
  isProfessor: z.boolean(),
  username: z.string().min(3).max(60),
  password: z.string().min(8).max(60),
});

export const selectUserSchema = createSelectSchema(users);
