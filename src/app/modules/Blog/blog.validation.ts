import { z } from 'zod';

// Validation schema for creating a blog
const createBlogValidation = z.object({
  body: z.object({
    title: z.string().min(1, { message: 'Title is required.' }).trim(),
    content: z.string().min(1, { message: 'Content is required.' }),
    isPublished: z.boolean().optional().default(true),
  }),
});

// Validation schema for updating a blog
const updateBlogValidation = z.object({
  body: z.object({
    title: z
      .string()
      .min(1, { message: 'Title must be at least 1 character long.' })
      .trim()
      .optional(),
    content: z
      .string()
      .min(1, { message: 'Content must be at least 1 character long.' })
      .optional(),
    isPublished: z.boolean().optional(),
  }),
});

export const BlogValidations = {
  createBlogValidation,
  updateBlogValidation,
};
