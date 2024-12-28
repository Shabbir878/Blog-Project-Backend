import { z } from 'zod';

const signUpValidation = z.object({
  body: z.object({
    name: z.string().min(1, { message: 'Name is required' }).trim(),
    email: z
      .string()
      .email({ message: 'Invalid email format' })
      .min(1, { message: 'Email is required' })
      .trim(),
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters long' }),
  }),
  role: z.string().optional(), // Optional role field
});

const logInValidation = z.object({
  body: z.object({
    email: z
      .string()
      .email({ message: 'Invalid email format' })
      .min(1, { message: 'Email is required' })
      .trim(),
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters long' }),
  }),
});

export const AuthValidations = {
  signUpValidation,
  logInValidation,
};
