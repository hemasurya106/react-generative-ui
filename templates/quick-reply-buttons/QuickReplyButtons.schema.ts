import { z } from 'zod';

export const QuickReplyButtonsSchema = z.object({
  buttons: z.array(z.object({
    label: z.string(),
    id: z.string(),
  })),
});
