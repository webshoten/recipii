import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { db } from '@/lib/neon';
import { recipes } from '@/lib/scheme';
import { eq } from 'drizzle-orm';

export const runtime = 'edge';

const app = new Hono().basePath('/api').get(
  '/',
  zValidator(
    'query',
    z.object({
      id: z.string(),
    }),
  ),
  async (c) => {
    const { id } = c.req.valid('query');
    const res = await db
      .select()
      .from(recipes)
      .where(eq(recipes.id, Number(id)));
    return c.json(res);
  },
);

export type AppType = typeof app;

export const GET = handle(app);
export const POST = handle(app);
