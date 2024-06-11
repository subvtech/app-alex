import { integer, pgTable, serial, text } from 'drizzle-orm/pg-core';

export const siteContent = pgTable('site-content', {
  id: serial('id').primaryKey(),
  link: text('link'),
  // logo: media
  position: integer('position'),
});
