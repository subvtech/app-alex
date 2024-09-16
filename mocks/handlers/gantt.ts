import { http, HttpResponse } from 'msw';

const generateRandomDate = (start: Date, end: Date) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const generateTask = (id: number, label: string, startDate: Date, endDate: Date) => ({
  id,
  type: 'task',
  label,
  startDate,
  endDate,
});

const items = [
  {
    id: 1,
    type: 'epic',
    label: 'User Authentication Module',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-02-11'),
    children: [
      {
        id: 2,
        type: 'story',
        label: 'Login Feature',
        startDate: new Date('2024-01-03'),
        endDate: new Date('2024-01-13'),
        children: [
          generateTask(3, 'Design Login Page', new Date('2024-01-04'), new Date('2024-01-06')),
          generateTask(4, 'Implement Login API', new Date('2024-01-10'), new Date('2024-01-12')),
          generateTask(20, 'Implement Password Hashing', new Date('2024-01-07'), new Date('2024-01-09')),
          generateTask(
            30,
            'Create Login Form Validation',
            generateRandomDate(new Date('2024-01-03'), new Date('2024-01-13')),
            generateRandomDate(new Date('2024-01-03'), new Date('2024-01-13')),
          ),
          generateTask(
            31,
            'Implement Remember Me Functionality',
            generateRandomDate(new Date('2024-01-03'), new Date('2024-01-13')),
            generateRandomDate(new Date('2024-01-03'), new Date('2024-01-13')),
          ),
          generateTask(
            32,
            'Add Social Login Options',
            generateRandomDate(new Date('2024-01-03'), new Date('2024-01-13')),
            generateRandomDate(new Date('2024-01-03'), new Date('2024-01-13')),
          ),
        ],
      },
      {
        id: 5,
        type: 'story',
        label: 'Registration Feature',
        startDate: new Date('2024-01-17'),
        endDate: new Date('2024-02-02'),
        children: [
          generateTask(6, 'Design Registration Page', new Date('2024-01-18'), new Date('2024-01-20')),
          generateTask(7, 'Implement Registration API', new Date('2024-01-30'), new Date('2024-02-01')),
          generateTask(21, 'Implement Email Verification', new Date('2024-01-24'), new Date('2024-01-26')),
          generateTask(
            33,
            'Create Registration Form Validation',
            generateRandomDate(new Date('2024-01-17'), new Date('2024-02-02')),
            generateRandomDate(new Date('2024-01-17'), new Date('2024-02-02')),
          ),
          generateTask(
            34,
            'Implement CAPTCHA',
            generateRandomDate(new Date('2024-01-17'), new Date('2024-02-02')),
            generateRandomDate(new Date('2024-01-17'), new Date('2024-02-02')),
          ),
          generateTask(
            35,
            'Add Terms and Conditions Acceptance',
            generateRandomDate(new Date('2024-01-17'), new Date('2024-02-02')),
            generateRandomDate(new Date('2024-01-17'), new Date('2024-02-02')),
          ),
        ],
      },
      generateTask(22, 'Set Up User Database', new Date('2024-01-15'), new Date('2024-01-17')),
      generateTask(23, 'Implement Session Management', new Date('2024-02-05'), new Date('2024-02-07')),
      generateTask(
        36,
        'Implement Password Reset Feature',
        generateRandomDate(new Date('2024-01-01'), new Date('2024-02-11')),
        generateRandomDate(new Date('2024-01-01'), new Date('2024-02-11')),
      ),
      generateTask(
        37,
        'Create User Profile Page',
        generateRandomDate(new Date('2024-01-01'), new Date('2024-02-11')),
        generateRandomDate(new Date('2024-01-01'), new Date('2024-02-11')),
      ),
      generateTask(
        38,
        'Implement Two-Factor Authentication',
        generateRandomDate(new Date('2024-01-01'), new Date('2024-02-11')),
        generateRandomDate(new Date('2024-01-01'), new Date('2024-02-11')),
      ),
    ],
  },
  {
    id: 8,
    type: 'epic',
    label: 'Payment Integration Module',
    startDate: new Date('2024-01-29'),
    endDate: new Date('2024-02-25'),
    children: [
      {
        id: 9,
        type: 'story',
        label: 'Payment Gateway Setup',
        startDate: new Date('2024-01-31'),
        endDate: new Date('2024-02-09'),
        children: [
          generateTask(10, 'Integrate Stripe API', new Date('2024-02-01'), new Date('2024-02-03')),
          generateTask(11, 'Test Payment Flow', new Date('2024-02-07'), new Date('2024-02-09')),
          generateTask(24, 'Implement Payment Form', new Date('2024-02-04'), new Date('2024-02-06')),
          generateTask(
            39,
            'Set Up Webhook Endpoints',
            generateRandomDate(new Date('2024-01-31'), new Date('2024-02-09')),
            generateRandomDate(new Date('2024-01-31'), new Date('2024-02-09')),
          ),
          generateTask(
            40,
            'Implement Error Handling for Payment Failures',
            generateRandomDate(new Date('2024-01-31'), new Date('2024-02-09')),
            generateRandomDate(new Date('2024-01-31'), new Date('2024-02-09')),
          ),
        ],
      },
      {
        id: 12,
        type: 'story',
        label: 'Transaction Notification Implementation',
        startDate: new Date('2024-02-13'),
        endDate: new Date('2024-02-23'),
        children: [
          generateTask(13, 'Implement Transaction Notification', new Date('2024-02-14'), new Date('2024-02-16')),
          generateTask(14, 'Implement Refund Process', new Date('2024-02-17'), new Date('2024-02-19')),
          generateTask(15, 'Implement Subscription Management', new Date('2024-02-20'), new Date('2024-02-22')),
          generateTask(
            41,
            'Create Email Notification System',
            generateRandomDate(new Date('2024-02-13'), new Date('2024-02-23')),
            generateRandomDate(new Date('2024-02-13'), new Date('2024-02-23')),
          ),
          generateTask(
            42,
            'Implement SMS Notifications',
            generateRandomDate(new Date('2024-02-13'), new Date('2024-02-23')),
            generateRandomDate(new Date('2024-02-13'), new Date('2024-02-23')),
          ),
        ],
      },
      generateTask(25, 'Set Up Payment Database', new Date('2024-01-29'), new Date('2024-01-31')),
      generateTask(26, 'Implement Payment Analytics', new Date('2024-02-23'), new Date('2024-02-25')),
      generateTask(
        43,
        'Implement Multi-Currency Support',
        generateRandomDate(new Date('2024-01-29'), new Date('2024-02-25')),
        generateRandomDate(new Date('2024-01-29'), new Date('2024-02-25')),
      ),
      generateTask(
        44,
        'Create Payment Dashboard for Users',
        generateRandomDate(new Date('2024-01-29'), new Date('2024-02-25')),
        generateRandomDate(new Date('2024-01-29'), new Date('2024-02-25')),
      ),
      generateTask(
        45,
        'Implement Fraud Detection System',
        generateRandomDate(new Date('2024-01-29'), new Date('2024-02-25')),
        generateRandomDate(new Date('2024-01-29'), new Date('2024-02-25')),
      ),
    ],
  },
  generateTask(27, 'Set Up Development Environment', new Date('2024-01-01'), new Date('2024-01-03')),
  generateTask(28, 'Create Project Documentation', new Date('2024-02-20'), new Date('2024-02-22')),
  generateTask(29, 'Perform Security Audit', new Date('2024-02-23'), new Date('2024-02-25')),
  generateTask(
    46,
    'Set Up Continuous Integration',
    generateRandomDate(new Date('2024-01-01'), new Date('2024-02-25')),
    generateRandomDate(new Date('2024-01-01'), new Date('2024-02-25')),
  ),
  generateTask(
    47,
    'Implement Logging System',
    generateRandomDate(new Date('2024-01-01'), new Date('2024-02-25')),
    generateRandomDate(new Date('2024-01-01'), new Date('2024-02-25')),
  ),
  generateTask(
    48,
    'Create User Manual',
    generateRandomDate(new Date('2024-01-01'), new Date('2024-02-25')),
    generateRandomDate(new Date('2024-01-01'), new Date('2024-02-25')),
  ),
  generateTask(
    49,
    'Perform Load Testing',
    generateRandomDate(new Date('2024-01-01'), new Date('2024-02-25')),
    generateRandomDate(new Date('2024-01-01'), new Date('2024-02-25')),
  ),
  generateTask(
    50,
    'Implement Backup and Recovery System',
    generateRandomDate(new Date('2024-01-01'), new Date('2024-02-25')),
    generateRandomDate(new Date('2024-01-01'), new Date('2024-02-25')),
  ),
];

const sprints = [
  {
    id: 1000,
    label: 'Sprint 1',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-01-07'),
  },
  {
    id: 1001,
    label: 'Sprint 2',
    startDate: new Date('2024-01-08'),
    endDate: new Date('2024-01-14'),
  },
  {
    id: 1002,
    label: 'Sprint 3',
    startDate: new Date('2024-01-15'),
    endDate: new Date('2024-01-21'),
  },
  {
    id: 1003,
    label: 'Sprint 4',
    startDate: new Date('2024-01-22'),
    endDate: new Date('2024-01-28'),
  },
  {
    id: 1004,
    label: 'Sprint 5',
    startDate: new Date('2024-01-29'),
    endDate: new Date('2024-02-04'),
  },
  {
    id: 1005,
    label: 'Sprint 6',
    startDate: new Date('2024-02-05'),
    endDate: new Date('2024-02-11'),
  },
  {
    id: 1006,
    label: 'Sprint 7',
    startDate: new Date('2024-02-12'),
    endDate: new Date('2024-02-18'),
  },
  {
    id: 1007,
    label: 'Sprint 8',
    startDate: new Date('2024-02-19'),
    endDate: new Date('2024-02-25'),
  },
];

export default http.get('/_/api/projects/gantt', async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return HttpResponse.json({ items, sprints });
});
