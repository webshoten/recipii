import {
  foreignKey,
  integer,
  pgTable,
  primaryKey,
  serial,
  varchar,
} from 'drizzle-orm/pg-core';

export const ingredient = pgTable('ingredient', {
  id: serial().primaryKey().notNull(),
  name: varchar({ length: 255 }).notNull(),
});

export const food = pgTable('food', {
  id: serial().primaryKey().notNull(),
  name: varchar({ length: 255 }).notNull(),
  yyyymmdd: varchar({ length: 8 }),
});

export const foodIngredient = pgTable(
  'food_ingredient',
  {
    foodId: integer('food_id').notNull(),
    ingredientId: integer('ingredient_id').notNull(),
    quantity: varchar({ length: 50 }),
  },
  (table) => [
    foreignKey({
      columns: [table.foodId],
      foreignColumns: [food.id],
      name: 'food_ingredient_food_id_fkey',
    }),
    foreignKey({
      columns: [table.ingredientId],
      foreignColumns: [ingredient.id],
      name: 'food_ingredient_ingredient_id_fkey',
    }),
    primaryKey({
      columns: [table.foodId, table.ingredientId],
      name: 'food_ingredient_pkey',
    }),
  ],
);
