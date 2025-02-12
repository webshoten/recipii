import { getFoods } from '@/repository/server/food/getFoods';
import { getIngredients } from '@/repository/server/ingredient/getIngredient';

export const getRecipe = async () => {
  const foods = await getFoods();
  const ingredients = await getIngredients(foods.map((f) => f.id));
  console.log(ingredients);

  return { foods, ingredients };
};
