import {
  boolean,
  numeric,
  pgEnum,
  pgTable,
  serial,
  text,
} from 'drizzle-orm/pg-core';

export const mediaTypeEnum = pgEnum('media_type', [
  'youtube',
  'vimeo',
  'image',
  'video',
  'file',
]);
export const medias = pgTable('medias', {
  id: serial('id').primaryKey(),
  filename: text('filename'),
  title: text('title'),
  size: numeric('size'),
  hash: text('hash'),
  ext: text('ext'),
  mime: text('ext'),
  url: text('url'),
  mediaType: mediaTypeEnum('media_type').default('file'),
  external: boolean('external').default(false),
});

export type Media = typeof medias.$inferSelect;
