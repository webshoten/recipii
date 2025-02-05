import * as dotenv from 'dotenv';
import { defineConfig } from 'drizzle-kit';

dotenv.config();

export default defineConfig({
  schema: './src/lib/schema.ts',
  out: './neon/drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || '',
  },
  verbose: true,
  strict: true,
});
