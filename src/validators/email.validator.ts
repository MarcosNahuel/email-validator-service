import { z } from 'zod';

export const validateEmailSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: 'Email is required' })
      .email('Invalid email format'),
  }),
});

export const validateBulkEmailSchema = z.object({
  body: z.object({
    emails: z
      .array(z.string().email('One or more emails are invalid'), {
        required_error: 'Emails array is required',
      })
      .min(1, 'Emails array cannot be empty')
      .max(5000, 'Cannot process more than 5000 emails per request'),
  }),
});
