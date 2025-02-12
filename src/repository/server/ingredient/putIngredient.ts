import { client } from '@/lib/honoClientSide';

export type PutIngredientResponse = {
  foodId: number;
  ingredientId: number;
  quantity: string | null;
  ingredientName: string | undefined;
}[];

export const putIngredient = async (input: {
  food_id: number;
  ingreds: { name: string; quantity: string | null }[];
}) => {
  const res = await client.api.food.ingredient.$post({
    json: input,
  });
  return await res.json();
};
