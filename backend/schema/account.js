import { z } from 'zod';

export const getAccountSchema = z.object({
  userId: z.number(),
  balance: z.number(),
});
