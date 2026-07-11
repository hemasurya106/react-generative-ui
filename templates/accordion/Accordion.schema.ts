import { z } from 'zod';

export const AccordionSchema = z.object({
  items: z.array(z.object({
    title: z.string(),
    content: z.string(),
  })),
});
