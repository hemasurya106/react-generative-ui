import { z } from 'zod';

export const AlertBoxSchema = z.object({
  type: z.enum(['info', 'success', 'warning', 'error']),
  title: z.string().optional(),
  message: z.string(),
});
