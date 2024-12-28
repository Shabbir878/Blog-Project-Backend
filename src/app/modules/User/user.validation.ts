import { z } from 'zod';

// Zod validation schema for creating a user
const createUserValidation = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email format').min(1, 'Email is required'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
    role: z.enum(['admin', 'user']).default('user'), // Role can only be 'admin' or 'user'
    isBlocked: z.boolean().default(false), // Default is false
  }),
});

const updateUserValidation = z.object({
  body: z.object({
    isBlocked: z.boolean().optional(),
  }),
});

export const UserValidations = {
  createUserValidation,
  updateUserValidation,
};
