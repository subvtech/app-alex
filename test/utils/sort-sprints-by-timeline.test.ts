import { describe, expect, it } from 'vitest';
import { sortSprintsByTimeline } from '~/utils/sort-sprints-by-timeline';

describe('sortSprintsByTimeline', () => {
  const referenceDate = new Date(2025, 0, 15, 12);
  const sprint = (id: number, startAt: string, endAt: string, order = id) => ({
    id,
    start_at: startAt,
    end_at: endAt,
    order,
  });

  it('puts the current sprint first, upcoming sprints chronologically, and past sprints after them', () => {
    const sprints = [
      sprint(1, '2025-02-01', '2025-02-07'),
      sprint(2, '2025-01-15', '2025-01-21'),
      sprint(3, '2025-01-01', '2025-01-07'),
      sprint(4, '2025-01-22', '2025-01-28'),
      sprint(5, '2025-01-08', '2025-01-14'),
    ];

    expect(sortSprintsByTimeline(sprints, referenceDate).map(({ id }) => id)).toEqual([2, 4, 1, 5, 3]);
    expect(sprints.map(({ id }) => id)).toEqual([1, 2, 3, 4, 5]);
  });

  it('starts with the nearest upcoming sprint when no sprint is current', () => {
    const sprints = [
      sprint(1, '2025-02-01', '2025-02-07'),
      sprint(2, '2025-01-22', '2025-01-28'),
      sprint(3, '2025-01-01', '2025-01-07'),
    ];

    expect(sortSprintsByTimeline(sprints, referenceDate).map(({ id }) => id)).toEqual([2, 1, 3]);
  });

  it('keeps sprints with invalid dates after dated sprints, ordered by their manual position', () => {
    const sprints = [
      sprint(1, 'invalid', 'invalid', 2),
      sprint(2, '2025-01-22', '2025-01-28'),
      sprint(3, 'invalid', 'invalid', 1),
    ];

    expect(sortSprintsByTimeline(sprints, referenceDate).map(({ id }) => id)).toEqual([2, 3, 1]);
  });
});
