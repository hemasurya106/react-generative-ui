import { z } from 'zod';

export const KeyValueListSchema = z.object({
  title: z.string().optional(),
  items: z.array(z.object({
    label: z.string(),
    value: z.union([z.string(), z.number()]),
  })),
});
