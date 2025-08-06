import z from 'zod';

const validationSchema = z.object({
  DATABASE_URL: z.string().url(),
  TRUSTED_ORIGINS: z.string(),
  JWT_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.string(),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

export default () => ({
  DATABASE_URL: process.env.DATABASE_URL,
  TRUSTED_ORIGINS: process.env.TRUSTED_ORIGINS,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  NODE_ENV: process.env.NODE_ENV,
});

export function validateConfig() {
  const configParsed = validationSchema.safeParse(process.env);

  if (!configParsed.success) {
    throw new Error(`Invalid environment variables: ${JSON.stringify(configParsed.error.format())}`);
  }

  return configParsed.data;
}
