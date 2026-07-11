import { z } from 'zod';

export const ConfirmationCardSchema = z.object({
  id: z.string(),
  title: z.string(),
  message: z.string(),
});
