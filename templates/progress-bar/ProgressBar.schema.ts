import { z } from 'zod';

export const ProgressBarSchema = z.object({
  label: z.string().optional(),
  value: z.number().min(0).max(100),
  color: z.string().optional(),
});
