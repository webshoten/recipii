import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import { db } from '@/lib/neon';
import { recipes } from '@/lib/scheme';

export const runtime = 'edge';

const app = new Hono().basePath('/api').post('/', async (c) => {
  const res = await db.select().from(recipes);
  return c.json(res);
});

export type AppType = typeof app;

export const GET = handle(app);
export const POST = handle(app);
