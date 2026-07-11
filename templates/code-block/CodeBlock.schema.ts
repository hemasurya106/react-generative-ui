import { z } from 'zod';

export const CodeBlockSchema = z.object({
  code: z.string(),
  language: z.string().optional(),
  filename: z.string().optional(),
});
