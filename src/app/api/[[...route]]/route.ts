import { Hono } from 'hono';
import { handle } from 'hono/vercel';

export const runtime = 'edge';

const app = new Hono().basePath('/api').post('/', async (c) => {
  return c.json({ test: 'xxx' });
});

export type AppType = typeof app;

export const GET = handle(app);
export const POST = handle(app);
