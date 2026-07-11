import { z } from 'zod';

export const SourceListSchema = z.object({
  title: z.string().optional(),
  sources: z.array(z.object({
    title: z.string(),
    url: z.string(),
  })),
});
