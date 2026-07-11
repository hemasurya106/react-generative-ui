import { z } from 'zod';

export const TimelineSchema = z.object({
  title: z.string().optional(),
  items: z.array(z.object({
    date: z.string(),
    title: z.string(),
    description: z.string().optional(),
  })),
});
