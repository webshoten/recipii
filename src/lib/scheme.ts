import { integer, pgTable, serial, varchar } from 'drizzle-orm/pg-core';

export const recipes = pgTable('recipe', {
  id: serial('id').primaryKey(),
  title: varchar('title'),
  ingredient_id: integer('ingredient_id'),
});
