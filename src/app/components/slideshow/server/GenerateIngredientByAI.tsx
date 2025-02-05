'use server';

import { generateIngredientsByAI } from '@/lib/generateIngredientsByAI';

export const GenerateIngredientByAI = async (url: string) => {
  'use server';
  return await generateIngredientsByAI(url);
};
