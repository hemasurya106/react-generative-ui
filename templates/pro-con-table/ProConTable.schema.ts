import { z } from 'zod';

export const ProConTableSchema = z.object({
  title: z.string().optional(),
  pros: z.array(z.string()),
  cons: z.array(z.string()),
});
