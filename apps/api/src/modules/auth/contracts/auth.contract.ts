import z from 'zod';

export const signInSchema = z.object({
  email: z.string(),
  password: z.string(),
}).openapi({
  title: 'SignInSchema',
  description: 'Schema for sign in',
});

export type SignInInput = z.infer<typeof signInSchema>;

export const registerSchema = z.object({
  email: z.string(),
  username: z.string(),
  password: z.string(),
}).openapi({
  title: 'RegisterSchema',
  description: 'Schema for register',
});

export type RegisterInput = z.infer<typeof registerSchema>;
