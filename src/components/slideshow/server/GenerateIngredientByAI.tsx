'use server';

import { analyzeImage } from '@/lib/generateIngredientsByAI';

export const GenerateIngredientByAI = async (url: string) => {
  'use server';
  return await analyzeImage(url);
};
