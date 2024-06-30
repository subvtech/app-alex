import { eq } from 'drizzle-orm';
import { Trails, trails } from './trails.schema';
import db from '@@/server/lib/drizzle';

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

export const findTrailById = async (id: number) => {
  return await db.query.trails.findFirst({
    where: eq(trails.id, id),
    with: {
      coverImage: true,
    },
  });
};

export const updateTrailHidden = async (id: number, isHidden: boolean) => {
  return await db
    .update(trails)
    .set({
      hidden: isHidden,
    })
    .where(eq(trails.id, id));
};

export const deleteTrail = async (id: number) => {
  return await db.delete(trails).where(eq(trails.id, id));
};
