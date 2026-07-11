import { z } from 'zod';

export const DataTableSchema = z.object({
  title: z.string().optional(),
  headers: z.array(z.string()),
  rows: z.array(z.record(z.any())),
});
