'use server';

import { analyze5Nutrients } from '@/lib/generate5NutrientsByAI';

export const Generate5NutrientsByAI = async (jsonText: string) => {
  'use server';
  return await analyze5Nutrients(jsonText);
};
