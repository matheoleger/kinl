import z from 'zod';

export const userSchema = z.object({
  id: z.string(),
  email: z.string(),
  username: z.string(),
  password: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
}).openapi({
  title: 'UserSchema',
  description: 'Schema for user item',
});

export type User = z.infer<typeof userSchema>;

export const createUserSchema = z.object({
  email: z.string(),
  username: z.string(),
  password: z.string(),
}).openapi({
  title: 'CreateUserSchema',
  description: 'Schema for create user item',
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
