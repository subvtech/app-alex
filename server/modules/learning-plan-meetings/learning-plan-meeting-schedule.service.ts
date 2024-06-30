import { eq } from 'drizzle-orm';
import {
  learningPlanMeetingSchedule,
  LearningPlanMeetingSchedule,
} from './learning-plan-meeting-schedule.schema';
import db from '@@/server/lib/drizzle';

type learningPlanMeetingScheduleParams = Omit<
  LearningPlanMeetingSchedule,
  'id'
>;

export const createLPMeetingSchedule = async (
  params: learningPlanMeetingScheduleParams,
) => {
  return await db
    .insert(learningPlanMeetingSchedule)
    .values({
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
    })
    .returning();
};

export const updateLPMeetingSchedule = async (
  id: number,
  newMeetingSchedule: learningPlanMeetingScheduleParams,
) => {
  return await db
    .update(learningPlanMeetingSchedule)
    .set({
      id,
      classId: newMeetingSchedule.classId,
      learningPlanId: newMeetingSchedule.learningPlanId,
      name: newMeetingSchedule.name,
      interval: newMeetingSchedule.interval,
      type: newMeetingSchedule.type,
      location: newMeetingSchedule.location,
      link: newMeetingSchedule.link,
      startDate: newMeetingSchedule.startDate,
      endDate: newMeetingSchedule.endDate,
      frequency: newMeetingSchedule.frequency,
    })
    .returning();
};

export const deleteLPMeetingSchedule = async (id: number) => {
  return await db
    .delete(learningPlanMeetingSchedule)
    .where(eq(learningPlanMeetingSchedule.id, id))
    .returning();
};
