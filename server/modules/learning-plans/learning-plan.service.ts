import { eq } from 'drizzle-orm';
import { LearningPlan, learningPlans } from './learning-plans.schema';
import db from '@@/server/lib/drizzle';

type learningPlanParams = Omit<LearningPlan, 'id'>;

export const createLearningPlan = async (params: learningPlanParams) => {
  return await db
    .insert(learningPlans)
    .values({
      title: params.title,
      description: params.description,
      startDate: params.startDate,
      endDate: params.endDate,
      archivedAt: null,
      type: params.type,
      slug: params.slug,
      className: params.className,
      inviteEnabled: true,
      invitationDuration: params.invitationDuration,
      hidden: false,
      details: params.details,
      message: params.message,
      createdAt: new Date(),
    })
    .returning()
    .onConflictDoNothing();
};

export const findOneLearningPlan = async (id: number) => {
  return await db.query.learningPlans.findFirst({
    where: eq(learningPlans.id, id),
  });
};

export const findLearningPlanBySlug = async (slug: string) => {
  return await db.query.learningPlans.findFirst({
    where: eq(learningPlans.slug, slug),
  });
};

export const updateDescription = async (id: number, newDescription: string) => {
  return await db
    .update(learningPlans)
    .set({
      description: newDescription,
    })
    .where(eq(learningPlans.id, id))
    .returning();
};

export const updateArchivedAt = async (id: number) => {
  return await db
    .update(learningPlans)
    .set({
      archivedAt: new Date(),
    })
    .where(eq(learningPlans.id, id))
    .returning();
};

export const updateHidden = async (id: number, isHidden: boolean) => {
  return await db
    .update(learningPlans)
    .set({
      hidden: isHidden,
    })
    .where(eq(learningPlans.id, id))
    .returning();
};

export const updateInviteEnable = async (
  id: number,
  inviteEnabled: boolean,
) => {
  return await db
    .update(learningPlans)
    .set({
      inviteEnabled,
    })
    .where(eq(learningPlans.id, id))
    .returning();
};

export const updateInvitationDuration = async (
  id: number,
  invitationDuration: number,
) => {
  return await db
    .update(learningPlans)
    .set({
      invitationDuration,
    })
    .where(eq(learningPlans.id, id))
    .returning();
};

export const updateMessage = async (id: number, message: string) => {
  return await db
    .update(learningPlans)
    .set({
      message,
    })
    .where(eq(learningPlans.id, id))
    .returning();
};
