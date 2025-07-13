import z from 'zod';

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
}).openapi({
  title: 'SignInSchema',
  description: 'Schema for sign in',
});

export type SignInInput = z.infer<typeof signInSchema>;

export const registerSchema = z.object({
  email: z.string().email('invalid_email'),
  username: z.string().min(3, { message: 'username_must_be_at_least_3_characters_long' }),
  password: z.string().min(8, { message: 'password_must_be_at_least_8_characters_long' }),
}).openapi({
  title: 'RegisterSchema',
  description: 'Schema for register',
});

export type RegisterInput = z.infer<typeof registerSchema>;
