import { z } from 'zod';
import { publicProcedure } from '../trpc';

export const helloRouter = publicProcedure
  .input(z.object({ text: z.string().nullish() }).optional())
  .query(({ input }) => {
    return {
      greeting: `Bem-vindo ${input?.text ?? 'ALEX'}`,
    };
  });
