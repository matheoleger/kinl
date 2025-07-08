import { join } from 'node:path';
import dotenvx from '@dotenvx/dotenvx';
import z from 'zod';

const nodeEnv = process.env.NODE_ENV || 'development';

if (nodeEnv === 'test') {
  dotenvx.config({ path: join(process.cwd(), '.env.test') });
}
else {
  dotenvx.config();
}

const validationSchema = z.object({
  DATABASE_URL: z.string().url(),
  TRUSTED_ORIGINS: z.string(),
  JWT_SECRET: z.string(),
});

const configParsed = validationSchema.safeParse(process.env);

if (!configParsed.success) {
  throw new Error(`Invalid environment variables: ${JSON.stringify(configParsed.error.format())}`);
}

export const config = {
  DATABASE_URL: configParsed.data.DATABASE_URL,
  TRUSTED_ORIGINS: configParsed.data.TRUSTED_ORIGINS,
  JWT_SECRET: configParsed.data.JWT_SECRET,
};
