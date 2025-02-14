import { getFoods } from '@/repository/server/food/getFoods';
import { getIngredients } from '@/repository/server/ingredient/getIngredient';

export const getRecipe = async (yyyymmdd: string) => {
  const foods = await getFoods(yyyymmdd);
  const ingredients = await getIngredients(foods.map((f) => f.id));
  console.log(ingredients);

  return { foods, ingredients };
};
