import { getGeminiModel } from '@/lib/gemini';

export type FiveNutrients = {
  name: string;
  percent: string;
}[];

// 画像を分析する関数
export async function analyze5Nutrients(
  ingredients: {
    name: string;
    quantity: string | null;
  }[],
) {
  try {
    const model = getGeminiModel();

    const jsonText = JSON.stringify(ingredients);
    const prompt = `こちらで「${jsonText}」指定された食材について、
    5大栄養素における割合（目安）をCSV形式で出力してください。
    1列目が5大栄養素名、2列目が割合としてください。ヘッダーは不要です。
    推測で構いません。`;

    const textPart = {
      text: jsonText,
    };

    const result = await model.generateContent([prompt, textPart]);
    const response = await result.response;
    const items = response.text().trim().split(`\n`);
    const nutrients = items.map((a) => {
      return {
        name: a.split(',')[0],
        percent: a.split(',')[1],
      };
    });
    return nutrients as FiveNutrients;
  } catch (error) {
    console.error(`分析中にエラーが発生しました`, error);
    return [];
  }
}
