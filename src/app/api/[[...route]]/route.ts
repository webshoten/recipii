import { dbClient } from '@/lib/neon';
import { getPresignedGetUrl, getPresignedPutUrl, s3Client } from '@/lib/s3';
import { food, foodIngredient, ingredient } from '@/lib/scheme';
import {
  GetObjectCommandInput,
  ListObjectsCommand,
  ListObjectsCommandInput,
  PutObjectCommandInput,
  S3Client,
} from '@aws-sdk/client-s3';
import { zValidator } from '@hono/zod-validator';
import { NeonQueryFunction } from '@neondatabase/serverless';
import { eq, inArray } from 'drizzle-orm';
import { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { Context, Hono, Next } from 'hono';
import { createMiddleware } from 'hono/factory';
import { handle } from 'hono/vercel';
import _ from 'lodash';
import { z } from 'zod';
import { cors } from 'hono/cors';

export const runtime = 'edge';

type MiddlewareEnv = {
  Variables: {
    s3Client: S3Client;
    dbClient: NeonHttpDatabase<Record<string, never>> & {
      $client: NeonQueryFunction<false, false>;
    };
  };
};

const middleware = createMiddleware<MiddlewareEnv>(
  async (c: Context, next: Next) => {
    c.set('s3Client', s3Client);
    c.set('dbClient', dbClient);
    await next();
  },
);

const api = new Hono()
  .basePath('/api')
  .use(
    cors({
      origin: [
        'https://recipii.vercel.app',
        'https://nextjss3upload.s3.ap-northeast-1.amazonaws.com',
        'http://localhost:3000',
      ], // 本番と開発環境のURL
      allowHeaders: ['X-Custom-Header', 'Upgrade-Insecure-Requests'],
      allowMethods: ['POST', 'GET', 'PATCH', 'DELETE', 'OPTIONS'],
      exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
      maxAge: 600,
      credentials: true,
    }),
  )
  .use(middleware)
  /**
   * foodのs3 presigned put urlをファイル名&日付指定で生成する
   */
  .post(
    '/food/s3put',
    zValidator(
      'json',
      z.object({
        name: z.string(),
        type: z.string(),
        yyyymmdd: z.string(),
      }),
    ),
    middleware,
    async (c) => {
      const client = c.var.s3Client;
      const { yyyymmdd, name, type } = c.req.valid('json');
      const params: PutObjectCommandInput = {
        Bucket: 'nextjss3upload',
        Key: yyyymmdd + '/' + name,
        ContentType: type,
      };
      const url = await getPresignedPutUrl(client, params);
      return c.json(url);
    },
  )

  /**
   * food情報
   */
  .get(
    '/food/list',
    zValidator(
      'query',
      z.object({
        yyyymmdd: z.string(),
      }),
    ),
    middleware,
    async (c) => {
      const client = c.var.dbClient;
      const { yyyymmdd } = c.req.valid('query');
      const res = await client
        .select()
        .from(food)
        .where(eq(food.yyyymmdd, yyyymmdd));
      return c.json(res);
    },
  )

  /**
   * foodの情報をDBに登録する
   */
  .post(
    '/food',
    zValidator(
      'json',
      z.object({
        name: z.string(),
        yyyymmdd: z.string(),
      }),
    ),
    middleware,
    async (c) => {
      const client = c.var.dbClient;
      const { name, yyyymmdd } = c.req.valid('json');
      const res = await client
        .insert(food)
        .values({ name, yyyymmdd })
        .returning();
      return c.json(res);
    },
  )
  .post(
    '/food/s3get',
    zValidator(
      'json',
      z.object({
        filepath: z.string(),
      }),
    ),
    async (c) => {
      const client = c.var.s3Client;
      const { filepath } = c.req.valid('json');
      const params: GetObjectCommandInput = {
        Bucket: 'nextjss3upload',
        Key: filepath,
      };
      const url = await getPresignedGetUrl(client, params);
      return c.json(url);
    },
  )
  /**
   * foodのs3 presigned get urlを日付指定で取得する
   */
  .post(
    '/food/list/s3get',
    zValidator(
      'json',
      z.object({
        yyyymmdd: z.string(),
      }),
    ),
    middleware,
    async (c) => {
      const client = c.var.s3Client;
      const { yyyymmdd } = c.req.valid('json');

      /**
       * S3オブジェクトList
       */
      const params: ListObjectsCommandInput = {
        Bucket: 'nextjss3upload',
        Prefix: yyyymmdd,
      };
      const list = await client.send(new ListObjectsCommand(params));

      /**
       * get presigned urls
       */
      const contents = _.sortBy(list?.Contents, 'LastModified');
      const promise = contents?.map((c) => {
        const params: GetObjectCommandInput = {
          Bucket: 'nextjss3upload',
          Key: c?.Key,
        };
        return getPresignedGetUrl(client, params);
      });

      if (promise == null) {
        return c.json([]);
      }

      const urls = await Promise.all(promise);

      return c.json(urls);
    },
  ) /**
   * ingredientの情報をDBに登録する
   */
  .post(
    '/food/ingredient',
    zValidator(
      'json',
      z.object({
        food_id: z.number(),
        ingred_names: z.array(z.string()),
      }),
    ),
    middleware,
    async (c) => {
      const client = c.var.dbClient;
      const { food_id, ingred_names } = c.req.valid('json');
      const res1 = await client
        .insert(ingredient)
        .values(
          ingred_names.map((i) => {
            return { name: i };
          }),
        )
        .onConflictDoNothing()
        .returning();

      /**
       * 一旦全部消す
       */
      await client
        .delete(foodIngredient)
        .where(eq(foodIngredient.foodId, food_id));

      /**
       * 登録した内容を返す
       */
      const res3 = await client
        .insert(foodIngredient)
        .values(
          res1.map((i) => {
            return { foodId: food_id, ingredientId: i.id };
          }),
        )
        .onConflictDoNothing()
        .returning();

      return c.json(res3);
    },
  ) /**
   * ingredient情報
   */
  .get(
    '/food/ingredient',
    zValidator(
      'query',
      z.object({
        food_ids: z.array(z.string()).or(z.string()),
      }),
    ),
    middleware,
    async (c) => {
      const client = c.var.dbClient;
      const { food_ids } = c.req.valid('query');

      let whereQuery;
      if (Array.isArray(food_ids)) {
        whereQuery = inArray(
          foodIngredient.foodId,
          food_ids.map((f) => Number(f)),
        );
      } else {
        whereQuery = eq(foodIngredient.foodId, Number(food_ids));
      }

      const res1 = await client.select().from(foodIngredient).where(whereQuery);

      const grouped = _.groupBy(res1, (value) => value.foodId);

      const a = [];
      for (const i of Object.keys(grouped)) {
        const foodId = Number(i);
        const ingredIds = grouped[foodId];
        const ingreds = await client
          .select()
          .from(ingredient)
          .where(
            inArray(
              ingredient.id,
              ingredIds.map((r) => r.ingredientId),
            ),
          );
        a.push({ foodId, ingreds });
      }

      return c.json(a);
    },
  );

export type AppType = typeof api;

export const GET = handle(api);
export const POST = handle(api);
export const PATCH = handle(api);
export const DELETE = handle(api);
