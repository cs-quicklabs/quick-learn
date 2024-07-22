import { z } from 'zod';

export const loginFormSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'This field is required' })
    .email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' }),
  rememberMe: z.boolean().optional(),
});
