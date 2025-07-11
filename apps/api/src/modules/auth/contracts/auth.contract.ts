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
  email: z.string().email('Invalid email. Please enter a valid email.'),
  username: z.string().min(3, { message: 'Username must be at least 3 characters long' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
}).openapi({
  title: 'RegisterSchema',
  description: 'Schema for register',
});

export type RegisterInput = z.infer<typeof registerSchema>;
