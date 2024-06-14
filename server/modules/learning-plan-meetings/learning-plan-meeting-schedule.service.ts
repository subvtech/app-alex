import db from '@@/server/lib/drizzle';
import {
  learningPlanMeetingSchedule,
  LearningPlanMeetingSchedule,
} from './learning-plan-meeting-schedule.schema';

type learningPlanMeetingScheduleParams = Omit<
  LearningPlanMeetingSchedule,
  'id'
>;

export const addSchedulesToLearninplan = async (
  params: learningPlanMeetingScheduleParams,
) => {
  return await db.insert(learningPlanMeetingSchedule).values({
    classId: params.classId,
    learningPlanId: params.learningPlanId,
    name: params.name,
    interval: params.interval,
    type: params.type,
    location: params.location,
    link: params.link,
    startDate: params.startDate,
    endDate: params.endDate,
    frequency: params.frequency,
    createdAt: new Date(),
  });
};
