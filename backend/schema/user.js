import { z } from 'zod';

export const createUserSchema = z.object({
  email: z.string({
    required_error: 'Username is required',
  }).email(),
  password: z.string().min(6),
  firstName: z.string(),
  lastName: z.string(),
});

export const signInUserSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const updateUserSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  password: z.string(),
});
