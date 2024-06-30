import { eq } from 'drizzle-orm';
import { classes } from './classes.schema';
import db from '@@/server/lib/drizzle';

interface createClassParams {
  learningPlanId: number;
  name: string;
  inChargeMemberId: number;
  learningPlanMember: number;
}

export const createClass = async (params: createClassParams) => {
  return await db
    .insert(classes)
    .values({
      learningPlanId: params.learningPlanId,
      name: params.name,
      inChargeMemberId: params.inChargeMemberId,
      // learning_plan_members: params.learningPlanMember,
      createdAt: new Date(),
    })
    .returning()
    .onConflictDoNothing();
};

export const updateClass = async (
  id: number,
  name: string,
  inChargeMemberId: number,
) => {
  return await db
    .update(classes)
    .set({
      name,
      inChargeMemberId,
    })
    .where(eq(classes.id, id))
    .returning();
};

export const deleteClass = async (id: number) => {
  return await db.delete(classes).where(eq(classes.id, id)).returning();
};
