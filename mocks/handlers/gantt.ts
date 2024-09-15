import { http, HttpResponse } from 'msw';

const items = [
  {
    id: 1,
    type: 'epic',
    label: 'User Authentication Module',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-03-15'),
    children: [
      {
        id: 2,
        type: 'story',
        label: 'Login Feature',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-02-15'),
        children: [
          {
            id: 3,
            label: 'Design Login Page',
            startDate: new Date('2024-01-01'),
            endDate: new Date('2024-01-20'),
            type: 'task',
          },
          {
            id: 4,
            label: 'Implement Login API',
            startDate: new Date('2024-01-15'),
            endDate: new Date('2024-02-15'),
            type: 'task',
          },
        ],
      },
      {
        id: 5,
        type: 'story',
        label: 'Registration Feature',
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-03-15'),
        children: [
          {
            id: 6,
            type: 'task',
            label: 'Design Registration Page',
            startDate: new Date('2024-01-15'),
            endDate: new Date('2024-02-20'),
          },
          {
            id: 7,
            type: 'task',
            label: 'Implement Registration API',
            startDate: new Date('2024-02-15'),
            endDate: new Date('2024-03-15'),
          },
        ],
      },
    ],
  },
  {
    id: 8,
    type: 'epic',
    label: 'Payment Integration Module',
    startDate: new Date('2024-02-01'),
    endDate: new Date('2024-03-31'),
    children: [
      {
        id: 9,
        type: 'story',
        label: 'Payment Gateway Setup',
        startDate: new Date('2024-02-01'),
        endDate: new Date('2024-03-15'),
        children: [
          {
            id: 10,
            type: 'task',
            label: 'Integrate Stripe API',
            startDate: new Date('2024-02-01'),
            endDate: new Date('2024-02-20'),
          },
          {
            id: 11,
            type: 'task',
            label: 'Test Payment Flow',
            startDate: new Date('2024-02-25'),
            endDate: new Date('2024-03-10'),
          },
        ],
      },
      {
        id: 12,
        type: 'story',
        label: 'Transaction Notification Implementation',
        startDate: new Date('2024-02-01'),
        endDate: new Date('2024-03-31'),
        children: [
          {
            id: 13,
            type: 'task',
            label: 'Implement Transaction Notification',
            startDate: new Date('2024-02-05'),
            endDate: new Date('2024-02-18'),
          },
          {
            id: 14,
            type: 'task',
            label: 'Implement Refund Process',
            startDate: new Date('2024-02-20'),
            endDate: new Date('2024-03-10'),
          },
          {
            id: 15,
            type: 'task',
            label: 'Implement Subscription Management',
            startDate: new Date('2024-03-12'),
            endDate: new Date('2024-03-25'),
          },
          {
            id: 16,
            type: 'task',
            label: 'Implement Payment Gateway',
            startDate: new Date('2024-03-01'),
            endDate: new Date('2024-03-20'),
          },
        ],
      },
      {
        id: 17,
        type: 'task',
        label: 'Develop User Authentication System',
        startDate: new Date('2024-02-10'),
        endDate: new Date('2024-03-10'),
      },
      {
        id: 18,
        type: 'task',
        label: 'Create Data Analytics Dashboard',
        startDate: new Date('2024-03-01'),
        endDate: new Date('2024-03-25'),
      },
    ],
  },
];

const sprints = [
  {
    id: 19,
    label: 'Sprint 1: Initial Setup',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-01-31'),
  },
  {
    id: 20,
    label: 'Sprint 2: Core Features',
    startDate: new Date('2024-02-01'),
    endDate: new Date('2024-02-28'),
  },
  {
    id: 21,
    label: 'Sprint 3: Final Touches',
    startDate: new Date('2024-03-01'),
    endDate: new Date('2024-03-31'),
  },
];

export default http.get('/_/api/projects/gantt', async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return HttpResponse.json({ items, sprints });
});
