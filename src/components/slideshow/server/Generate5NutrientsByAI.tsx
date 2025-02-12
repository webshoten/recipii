'use server';

import { analyze5Nutrients } from '@/lib/generate5NutrientsByAI';

export const Generate5NutrientsByAI = async (
  ingredients: {
    name: string;
    quantity: string | null;
  }[],
) => {
  'use server';
  return await analyze5Nutrients(ingredients);
};
