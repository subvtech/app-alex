import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  cpf: text('name'),
  name: text('name'),
  image: text('image'),
  email: text('email').notNull(),
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  username: text('username'),
  password: text('password'),
});

export type User = typeof users.$inferSelect;

export type UserInsert = typeof users.$inferInsert;
