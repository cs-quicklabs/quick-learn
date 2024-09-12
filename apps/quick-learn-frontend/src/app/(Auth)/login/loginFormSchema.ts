import { en } from '@src/constants/lang/en';
import { z } from 'zod';

export const loginFormSchema = z.object({
  email: z
    .string()
    .min(1, { message: en.common.fieldRequired })
    .email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' }),
  rememberMe: z.boolean(),
});
