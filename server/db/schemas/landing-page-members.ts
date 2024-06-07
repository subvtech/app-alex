import { integer, pgEnum, pgTable, serial, text } from 'drizzle-orm/pg-core';

export const roleEnum = pgEnum('role', ['researcher', 'leader', 'developer']);

export const landingPageMembers = pgTable('landing_page-members', {
  id: serial('id').primaryKey(),
  function: text('function'),
  // photo: media
  instagram: integer('instagram'),
  facebook: integer('facebook'),
  website: integer('website'),
  linkedin: integer('linkedin'),
  role: roleEnum('role'),
});
