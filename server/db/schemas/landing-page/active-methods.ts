import { boolean, pgTable, serial, text } from 'drizzle-orm/pg-core';

export const activeMethods = pgTable('active-methods', {
  id: serial('id').primaryKey(),
  title: text('title'),
  // image: mediaTypeEnum,
  description: text('description'),
  modal: boolean('modal').default(false),
});
