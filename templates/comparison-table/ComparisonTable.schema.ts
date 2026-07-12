import { z } from 'zod';

export const ComparisonTableSchema = z.object({
  title: z.string().optional(),
  features: z.array(z.string()),
  options: z.array(z.object({
    name: z.string(),
    values: z.record(z.string(), z.union([z.string(), z.boolean()])),
  })),
});
