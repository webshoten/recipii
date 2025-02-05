import { relations } from "drizzle-orm/relations";
import { food, foodIngredient, ingredient } from "./schema";

export const foodIngredientRelations = relations(foodIngredient, ({one}) => ({
	food: one(food, {
		fields: [foodIngredient.foodId],
		references: [food.id]
	}),
	ingredient: one(ingredient, {
		fields: [foodIngredient.ingredientId],
		references: [ingredient.id]
	}),
}));

export const foodRelations = relations(food, ({many}) => ({
	foodIngredients: many(foodIngredient),
}));

export const ingredientRelations = relations(ingredient, ({many}) => ({
	foodIngredients: many(foodIngredient),
}));