import { integer, pgTable, serial, text, varchar } from 'drizzle-orm/pg-core';

export const recipes = pgTable('recipe', {
  id: serial('id').primaryKey(),
  title: varchar('title'),
  filename: text('filename'),
  ingredient_id: integer('ingredient_id'),
});
