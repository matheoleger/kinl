import z from 'zod';

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
}).openapi({
  title: 'SignInSchema',
  description: 'Schema for sign in',
});

export type SignInInput = z.infer<typeof signInSchema>;

const passwordSchema = z
  .string()
  .min(8, { message: 'password_must_be_at_least_8_characters_long' })
  .refine(password => /[A-Z]/.test(password), {
    message: 'password_must_contain_at_least_one_uppercase_letter',
  })
  .refine(password => /[a-z]/.test(password), {
    message: 'password_must_contain_at_least_one_lowercase_letter',
  })
  .refine(password => /\d/.test(password), { message: 'password_must_contain_at_least_one_digit' })
  .refine(password => /[!@#$%^&*]/.test(password), {
    message: 'password_must_contain_at_least_one_special_character',
  });

export const registerSchema = z.object({
  email: z.string().email('invalid_email'),
  username: z.string().min(3, { message: 'username_must_be_at_least_3_characters_long' }),
  password: passwordSchema,
}).openapi({
  title: 'RegisterSchema',
  description: 'Schema for register',
});

export type RegisterInput = z.infer<typeof registerSchema>;
