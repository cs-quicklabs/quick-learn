import { en } from '@src/constants/lang/en';
import { onlyAlphabeticValidation } from '@src/utils/helpers';
import { z } from 'zod';

const baseSchema = {
  first_name: z
    .string({
      required_error: en.common.fieldRequired,
    })
    .trim()
    .min(1, { message: en.common.fieldRequired })
    .max(30, { message: 'The value should not exceed 30 character' })
    .refine(onlyAlphabeticValidation, {
      message: 'First name should only contain alphabetic characters',
    }),
  last_name: z
    .string({
      required_error: en.common.fieldRequired,
    })
    .trim()
    .min(1, { message: en.common.fieldRequired })
    .max(30, { message: 'The value should not exceed 30 character' })
    .refine(onlyAlphabeticValidation, {
      message: 'Last name should only contain alphabetic characters',
    }),
  user_type_id: z
    .string({
      required_error: en.common.fieldRequired,
    })
    .min(1, { message: en.common.fieldRequired }),
  email: z
    .string({
      required_error: en.common.fieldRequired,
    })
    .trim()
    .min(1, { message: en.common.fieldRequired })
    .email({ message: 'Invalid email address' }),
  skill_id: z
    .string({
      required_error: en.common.fieldRequired,
    })
    .min(1, { message: en.common.fieldRequired }),
};

export const addMemberFormSchema = z
  .object({
    ...baseSchema,
    password: z
      .string({
        required_error: en.common.fieldRequired,
      })
      .trim()
      .min(8, { message: 'Password must be at least 8 characters long' })
      .regex(/[A-Z]/, {
        message: 'Password must contain at least one uppercase letter',
      })
      .regex(/[a-z]/, {
        message: 'Password must contain at least one lowercase letter',
      })
      .regex(/[0-9]/, { message: 'Password must contain at least one number' })
      .regex(/[^A-Za-z0-9]/, {
        message: 'Password must contain at least one special character',
      }),
    confirm_password: z.string({
      required_error: en.common.fieldRequired,
    }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords don't match",
    path: ['confirm_password'],
  });

export const editMemberFormSchema = z.object({
  ...baseSchema,
  active: z.string({ message: 'Invalid value' }),
});
