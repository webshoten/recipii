import { getApiKey, getGeminiModel } from '@/lib/gemini';
import { readImageFileBuffer } from '@/lib/picture';

// 画像を分析する関数
export async function analyzeImage(imagePath: string) {
  const apiKey = getApiKey();
  try {
    const model = getGeminiModel(apiKey);
    const { data: base64, mimeType } = await readImageFileBuffer(imagePath);

    const prompt = `こちらに表示されている画像の中の料理で使用している食材と量をカンマ区切りで書き出してください。
    例えば出力は「食材A|Aの量g,食材B|Bの量g」だけでお願いします。
    個数などの場合でも必ずグラム(g)表記に置き換えてください。
    例えば1個⇒10gなどです。
    推測で構いません。料理じゃなかった場合は「判断できません」のみで問題ありません。`;
    const imagePart = {
      inlineData: {
        data: base64,
        mimeType: mimeType,
      },
    };

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const items = response.text().trim().split(',');
    if (items[0] === '判断できません') {
      return [{ name: '', quantity: '' }];
    }
    const ingredients = items.map((a) => {
      return {
        name: a.split('|')[0],
        quantity: a.split('|')[1].replace('g', ''),
      };
    });
    return ingredients;
  } catch (error) {
    console.error(`画像の分析中にエラーが発生しました: ${imagePath}`, error);
    return [];
  }
}
