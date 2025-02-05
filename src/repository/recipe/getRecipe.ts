import { getFoods } from '@/repository/food/getFoods';
import { getIngredients } from '@/repository/ingredient/getIngredient';

export const getRecipe = async () => {
  const foods = await getFoods();
  const ingredients = await getIngredients(foods.map((f) => f.id));
  console.log(ingredients);

  return { foods, ingredients };
};
