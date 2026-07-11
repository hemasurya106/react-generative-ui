import { z } from 'zod';

export const BadgeSchema = z.object({
  label: z.string(),
  variant: z.enum(['default', 'success', 'warning', 'danger', 'info']).optional(),
});
