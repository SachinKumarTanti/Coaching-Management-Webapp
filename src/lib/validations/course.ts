import { z } from 'zod';

export const courseSchema = z.object({
  title: z.string().min(3, 'Course title must be at least 3 characters').max(100),
  description: z.string().min(10, 'Course description must be at least 10 characters').max(1000),
  category: z.string().min(2, 'Please select or enter a category'),
  is_active: z.boolean().default(true),
});

export type CourseInput = z.infer<typeof courseSchema>;
