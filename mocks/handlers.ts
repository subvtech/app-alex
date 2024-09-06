import { http } from 'msw';
import { clone } from './clone';

export const handlers = [
  http.get(`/_/api/learningplans`, ({ request }) => {
    return clone({ request });
  }),
];
