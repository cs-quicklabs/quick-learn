import { z } from 'zod';

export const resetPasswordFormSchema = z.object({
  newPassword: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' }),
  confirmPassword: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' }),
});
