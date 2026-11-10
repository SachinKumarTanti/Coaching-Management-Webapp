import { z } from 'zod';

export const announcementSchema = z.object({
  title: z.string().min(3, 'Notice title must be at least 3 characters').max(150),
  content: z.string().min(10, 'Notice content must be at least 10 characters').max(2000),
  is_published: z.boolean().default(true),
});

export type AnnouncementInput = z.infer<typeof announcementSchema>;
