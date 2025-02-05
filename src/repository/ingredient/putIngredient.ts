import { client } from '@/lib/honoClientSide';

export const putIngredient = async (input: {
  food_id: number;
  ingred_names: string[];
}) => {
  const res = await client.api.food.ingredient.$post({
    json: input,
  });
  return await res.json();
};
