import { pgTable, serial, text } from 'drizzle-orm/pg-core';

export const landingPageContent = pgTable('landing-page-content', {
  id: serial('id').primaryKey(),
  content: text('content'),
  categoria: text('categoria'),
});
