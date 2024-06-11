import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import { users } from './users.schema';

export const registerUserSchema = z.object({
  cpf: z.string().length(11),
  email: z.string().min(6).max(200),
  password: z.string().min(8).max(60),
  username: z.string().min(3).max(60),
  fullname: z.string().min(3),
  isProfessor: z.boolean(),
  institution: z.string().optional(),
  address: z.string().optional(),
});

export const selectUserSchema = createSelectSchema(users);
