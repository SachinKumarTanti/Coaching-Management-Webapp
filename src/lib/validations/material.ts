import { z } from 'zod';

export const materialSchema = z.object({
  course_id: z.string().uuid('Please select a valid course'),
  title: z.string().min(3, 'Material title must be at least 3 characters').max(120),
  description: z.string().max(500).optional().or(z.literal('')),
});

export type MaterialInput = z.infer<typeof materialSchema>;
