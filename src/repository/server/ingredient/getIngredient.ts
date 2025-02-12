import { client } from '@/lib/honoServerSide';

export const getIngredients = async (foodIds: number[]) => {
  if (foodIds.length === 0) {
    return [];
  }
  const res = await client.api.food.ingredient.$get({
    query: {
      food_ids: foodIds.map((f) => f.toString()),
    },
  });
  const ingred = await res.json();
  return ingred;
};
