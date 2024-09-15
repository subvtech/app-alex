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
            startDate: new Date('2023-01-01'), // Updated to match story start date
            endDate: new Date('2023-01-20'),
            type: 'task',
          },
          {
            id: 'task2',
            label: 'Implement Login API',
            startDate: new Date('2023-01-15'),
            endDate: new Date('2023-02-15'), // Updated to match story end date
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
            startDate: new Date('2023-01-15'), // Updated to match story start date
            endDate: new Date('2023-02-20'),
          },
          {
            id: 'task4',
            type: 'task',
            label: 'Implement Registration API',
            startDate: new Date('2023-02-15'),
            endDate: new Date('2023-03-15'), // Updated to match story end date
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
        id: 'story4',
        type: 'story',
        label: 'Transaction Notification Implementation',
        startDate: new Date('2023-02-01'),
        endDate: new Date('2023-03-31'),
        children: [
          {
            id: 'task7',
            type: 'task',
            label: 'Implement Transaction Notification',
            startDate: new Date('2023-02-05'),
            endDate: new Date('2023-02-18'),
          },
          {
            id: 'task8',
            type: 'task',
            label: 'Implement Refund Process',
            startDate: new Date('2023-02-20'),
            endDate: new Date('2023-03-10'),
          },
          {
            id: 'task9',
            type: 'task',
            label: 'Implement Subscription Management',
            startDate: new Date('2023-03-12'),
            endDate: new Date('2023-03-25'),
          },
          {
            id: 'task10',
            type: 'task',
            label: 'Implement Payment Gateway',
            startDate: new Date('2023-03-01'),
            endDate: new Date('2023-03-20'),
          },
        ],
      },
      {
        id: 'task11',
        type: 'task',
        label: 'Develop User Authentication System',
        startDate: new Date('2023-02-10'),
        endDate: new Date('2023-03-10'),
      },
      {
        id: 'task12',
        type: 'task',
        label: 'Create Data Analytics Dashboard',
        startDate: new Date('2023-03-01'),
        endDate: new Date('2023-03-25'),
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
