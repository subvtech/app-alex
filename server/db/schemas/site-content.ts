import { pgTable, serial, text } from 'drizzle-orm/pg-core';

export const siteContent = pgTable('site-content', {
  id: serial('id').primaryKey(),
  content: text('content'),
});
