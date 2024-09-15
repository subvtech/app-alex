import { http, HttpResponse } from 'msw';

const items = [
  {
    id: 'epic1',
    type: 'epic',
    label: 'User Authentication Module',
    startDate: new Date('2023-01-01'),
    endDate: new Date('2023-03-15'),
    children: [
      {
        id: 'story1',
        type: 'story',
        label: 'Login Feature',
        startDate: new Date('2023-01-01'),
        endDate: new Date('2023-02-15'),
        children: [
          {
            id: 'task1',
            label: 'Design Login Page',
            startDate: new Date('2023-01-05'),
            endDate: new Date('2023-01-20'),
            type: 'task',
          },
          {
            id: 'task2',
            label: 'Implement Login API',
            startDate: new Date('2023-01-15'),
            endDate: new Date('2023-01-30'),
            type: 'task',
          },
        ],
      },
      {
        id: 'story2',
        type: 'story',
        label: 'Registration Feature',
        startDate: new Date('2023-01-15'),
        endDate: new Date('2023-03-15'),
        children: [
          {
            id: 'task3',
            type: 'task',
            label: 'Design Registration Page',
            startDate: new Date('2023-02-05'),
            endDate: new Date('2023-02-20'),
          },
          {
            id: 'task4',
            type: 'task',
            label: 'Implement Registration API',
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
    label: 'Payment Integration Module',
    startDate: new Date('2023-02-01'),
    endDate: new Date('2023-03-31'),
    children: [
      {
        id: 'story3',
        type: 'story',
        label: 'Payment Gateway Setup',
        startDate: new Date('2023-02-01'),
        endDate: new Date('2023-03-15'),
        children: [
          {
            id: 'task5',
            type: 'task',
            label: 'Integrate Stripe API',
            startDate: new Date('2023-02-01'),
            endDate: new Date('2023-02-20'),
          },
          {
            id: 'task6',
            type: 'task',
            label: 'Test Payment Flow',
            startDate: new Date('2023-02-25'),
            endDate: new Date('2023-03-10'),
          },
        ],
      },
      {
        id: 'task7',
        type: 'task',
        label: 'Setup Payment Notifications',
        startDate: new Date('2023-03-05'),
        endDate: new Date('2023-03-20'),
      },
      {
        id: 'task8',
        type: 'task',
        label: 'Implement Refund Process',
        startDate: new Date('2023-03-15'),
        endDate: new Date('2023-03-30'),
      },
    ],
  },
];

const sprints = [
  {
    id: 'sprint1',
    label: 'Sprint 1: Initial Setup',
    startDate: new Date('2023-01-01'),
    endDate: new Date('2023-01-31'),
  },
  {
    id: 'sprint2',
    label: 'Sprint 2: Core Features',
    startDate: new Date('2023-02-01'),
    endDate: new Date('2023-02-28'),
  },
  {
    id: 'sprint3',
    label: 'Sprint 3: Final Touches',
    startDate: new Date('2023-03-01'),
    endDate: new Date('2023-03-31'),
  },
];

export default http.get('/_/api/projects/gantt', async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return HttpResponse.json({ items, sprints });
});
