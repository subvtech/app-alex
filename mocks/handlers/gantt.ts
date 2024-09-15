import { http, HttpResponse } from 'msw';

const items = [
  {
    id: 'epic1',
    type: 'epic',
    label: 'Epic 1',
    startDate: new Date('2023-01-01'),
    endDate: new Date('2023-03-15'),
    children: [
      {
        id: 'story1',
        type: 'story',
        label: 'Story 1',
        startDate: new Date('2023-01-01'),
        endDate: new Date('2023-02-15'),
        children: [
          {
            id: 'task1',
            label: 'Task 1',
            startDate: new Date('2023-01-05'),
            endDate: new Date('2023-01-20'),
            type: 'task',
          },
          {
            id: 'task2',
            label: 'Task 2',
            startDate: new Date('2023-01-15'),
            endDate: new Date('2023-01-30'),
            type: 'task',
          },
        ],
      },
      {
        id: 'story2',
        type: 'story',
        label: 'Story 2',
        startDate: new Date('2023-01-15'),
        endDate: new Date('2023-03-15'),
        children: [
          {
            id: 'task3',
            type: 'task',
            label: 'Task 3',
            startDate: new Date('2023-02-05'),
            endDate: new Date('2023-02-20'),
          },
          {
            id: 'task4',
            type: 'task',
            label: 'Task 4',
            startDate: new Date('2023-02-15'),
            endDate: new Date('2023-02-28'),
          },
        ],
      },
    ],
  },
  {
    id: 'epic2',
    type: 'epic',
    label: 'Epic 2',
    startDate: new Date('2023-02-01'),
    endDate: new Date('2023-03-31'),
    children: [
      {
        id: 'story3',
        type: 'story',
        label: 'Story 3',
        startDate: new Date('2023-02-01'),
        endDate: new Date('2023-03-15'),
        children: [
          {
            id: 'task5',
            type: 'task',
            label: 'Task 5',
            startDate: new Date('2023-02-01'),
            endDate: new Date('2023-02-20'),
          },
          {
            id: 'task6',
            type: 'task',
            label: 'Task 6',
            startDate: new Date('2023-02-25'),
            endDate: new Date('2023-03-10'),
          },
        ],
      },
      {
        id: 'task7',
        type: 'task',
        label: 'Task 7',
        startDate: new Date('2023-03-05'),
        endDate: new Date('2023-03-20'),
      },
      {
        id: 'task8',
        type: 'task',
        label: 'Task 8',
        startDate: new Date('2023-03-15'),
        endDate: new Date('2023-03-30'),
      },
    ],
  },
];

const sprints = [
  {
    id: 'sprint1',
    label: 'Sprint 1',
    startDate: new Date('2023-01-01'),
    endDate: new Date('2023-01-31'),
  },
  {
    id: 'sprint2',
    label: 'Sprint 2',
    startDate: new Date('2023-02-01'),
    endDate: new Date('2023-02-28'),
  },
  {
    id: 'sprint3',
    label: 'Sprint 3',
    startDate: new Date('2023-03-01'),
    endDate: new Date('2023-03-31'),
  },
];

export default http.get('/_/api/projects/gantt', async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return HttpResponse.json({ items, sprints });
});
