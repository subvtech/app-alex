import db from '@@/server/lib/drizzle';
import {
  trailContributions,
  TrailContributions,
} from './trail-contributions.schema';

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
