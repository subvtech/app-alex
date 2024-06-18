import db from '@@/server/lib/drizzle';
import { Trails, trails } from './trails.schema';

type trail = Omit<Trails, 'id'>;

export const createTrail = async (params: trail) => {
  return await db
    .insert(trails)
    .values({
      learningStructureId: params.learningStructureId,
      title: params.title,
      order: params.order,
      hidden: params.hidden,
      description: params.description,
      coverImageId: params.coverImageId,
      createdAt: new Date(),
    })
    .onConflictDoNothing();
};
