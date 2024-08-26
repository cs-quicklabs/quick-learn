import { onlyAlphabeticValidation } from '@src/utils/helpers';
import { z } from 'zod';

const baseSchema = {
  first_name: z
    .string({
      required_error: 'This field is required',
    })
    .trim()
    .min(1, { message: 'This field is required' })
    .max(30, { message: 'This field should be less than or equal to 30' })
    .refine(onlyAlphabeticValidation, {
      message: 'First name should only contain alphabetic characters',
    }),
  last_name: z
    .string({
      required_error: 'This field is required',
    })
    .trim()
    .min(1, { message: 'This field is required' })
    .max(30, { message: 'This field should be less than or equal to 30' })
    .refine(onlyAlphabeticValidation, {
      message: 'Last name should only contain alphabetic characters',
    }),
  user_type_id: z
    .string({
      required_error: 'This field is required',
    })
    .min(1, { message: 'This field is required' }),
  email: z
    .string({
      required_error: 'This field is required',
    })
    .trim()
    .min(1, { message: 'This field is required' })
    .email({ message: 'Invalid email address' }),
  skill_id: z
    .string({
      required_error: 'This field is required',
    })
    .min(1, { message: 'This field is required' }),
};

export const addMemberFormSchema = z
  .object({
    ...baseSchema,
    password: z
      .string({
        required_error: 'This field is required',
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
      required_error: 'This field is required',
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
