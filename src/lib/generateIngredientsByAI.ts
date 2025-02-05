import { GoogleGenerativeAI } from '@google/generative-ai';
const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

export async function generateIngredientsByAI(url: string) {
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
  });

  const generationConfig = {
    temperature: 0.9,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: 'text/plain',
  };

  const chatSession = model.startChat({
    generationConfig,
  });

  const result = await chatSession.sendMessage(
    `こちらのURL(${url})で表示されている画像の中の料理で使用している食材のみをカンマ区切りで書き出してください。
    出力は「食材A,材料B」のようにお願いします。
    料理じゃなかった場合は空文字のみで問題ありません。`,
  );
  const ingredientsStr = result.response.text();
  const ingredients = ingredientsStr.trim().split(',');

  return ingredients;
}
