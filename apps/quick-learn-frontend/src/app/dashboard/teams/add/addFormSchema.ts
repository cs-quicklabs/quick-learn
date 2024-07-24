import { z } from "zod";

export const addMemberFormSchema = z.object({
  first_name: z
    .string({
      required_error: 'This field is required'
    })
    .min(1, { message: 'This field is required' })
    .max(30, { message: 'This field should be less than or equal to 30' }),
  last_name: z
    .string({
      required_error: 'This field is required'
    })
    .min(1, { message: 'This field is required' })
    .max(30, { message: 'This field should be less than or equal to 30' }),
  user_type_id: z
    .string({
      required_error: 'This field is required'
    })
    .min(1, { message: 'This field is required' }),
  email: z
    .string({
      required_error: 'This field is required'
    })
    .min(1, { message: 'This field is required' })
    .email({ message: 'Invalid email address' }),
  password: z
    .string({
      required_error: 'This field is required'
    })
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
  confirm_password: z
    .string({
      required_error: 'This field is required'
    }),
  skill_id: z
    .string({
      required_error: 'This field is required'
    })
    .min(1, { message: 'This field is required' })
}).refine((data) => data.password === data.confirm_password, {
  message: "Passwords don't match",
  path: ['confirm_password'],
});
