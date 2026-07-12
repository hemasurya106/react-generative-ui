import { z } from 'zod';

export const BarChartSchema = z.object({
  title: z.string().optional(),
  data: z.array(z.record(z.string(), z.any())),
  xAxisKey: z.string(),
  series: z.array(z.object({
    key: z.string(),
    color: z.string().optional(),
    name: z.string().optional(),
  })),
});
