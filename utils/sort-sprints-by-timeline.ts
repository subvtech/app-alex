import { endOfDay, startOfDay } from 'date-fns';

interface SprintTimeline {
  start_at: string;
  end_at: string;
  order: number;
}

export const sortSprintsByTimeline = <T extends SprintTimeline>(sprints: T[], referenceDate = new Date()) => {
  const today = startOfDay(referenceDate).getTime();

  const getSprintDates = (sprint: SprintTimeline) => {
    const start = startOfDay(new Date(sprint.start_at)).getTime();
    const end = endOfDay(new Date(sprint.end_at)).getTime();
    const hasValidDates = Number.isFinite(start) && Number.isFinite(end);

    return {
      start,
      category: !hasValidDates ? 3 : start <= today && today <= end ? 0 : start > today ? 1 : 2,
    };
  };

  return [...sprints].sort((a, b) => {
    const sprintA = getSprintDates(a);
    const sprintB = getSprintDates(b);

    if (sprintA.category !== sprintB.category) {
      return sprintA.category - sprintB.category;
    }

    if (sprintA.category === 3) {
      return a.order - b.order;
    }

    if (sprintA.start !== sprintB.start) {
      return sprintA.category === 1 ? sprintA.start - sprintB.start : sprintB.start - sprintA.start;
    }

    return a.order - b.order;
  });
};
