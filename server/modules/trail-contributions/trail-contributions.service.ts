import { eq } from 'drizzle-orm';
import {
  trailContributions,
  TrailContributions,
} from './trail-contributions.schema';
import db from '@@/server/lib/drizzle';

type trailContribution = Omit<TrailContributions, 'id'>;

export const createTrailContribution = async (params: trailContribution) => {
  return await db.insert(trailContributions).values({
    trailId: params.trailId,
    studentMember: params.studentMember,
    title: params.title,
    contribution: params.contribution,
    highlighted: params.highlighted,
    highlightedOrder: params.highlightedOrder,
    blocked: params.blocked,
  });
};

export const updateContribution = async (
  id: number,
  title: string,
  contribution: JSON,
) => {
  return await db
    .update(trailContributions)
    .set({
      title,
      contribution,
    })
    .where(eq(trailContributions.id, id));
};

export const updateHighlight = async (
  id: number,
  highlighted: boolean,
  highlightedOrder: number,
  blocked: boolean,
) => {
  return await db
    .update(trailContributions)
    .set({
      highlighted,
      highlightedOrder,
      blocked,
    })
    .where(eq(trailContributions.id, id))
    .returning();
};

export const findByHighlight = async (id: number) => {
  return await db.query.trailContributions.findMany({
    where: (trailContributions, { and, eq }) =>
      and(
        eq(trailContributions.id, id),
        eq(trailContributions.highlighted, true),
      ),
  });
};

export const deleteTrailContribution = async (id: number) => {
  return await db
    .delete(trailContributions)
    .where(eq(trailContributions.id, id))
    .returning();
};
