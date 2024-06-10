import { pgTable, serial, text } from 'drizzle-orm/pg-core';

export const contentMenu = pgTable('content-menu', {
  id: serial('id').primaryKey(),
  text: text('text'),
});
