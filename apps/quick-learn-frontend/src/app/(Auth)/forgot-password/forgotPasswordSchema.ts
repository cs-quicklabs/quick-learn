import { en } from '@src/constants/lang/en';
import { z } from 'zod';

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, { message: en.common.fieldRequired })
    .email({ message: 'Invalid email address' }),
});
