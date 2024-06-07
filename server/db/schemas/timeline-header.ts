import { pgTable, serial, text } from 'drizzle-orm/pg-core';

export const siteContent = pgTable('site-content', {
  id: serial('id').primaryKey(),
  title: text('title'),
  foretitle: text('foretitle'),
  description: text('description'),
});
