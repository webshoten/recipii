import { getGeminiModel } from '@/lib/gemini';
import { FiveNutrients } from '@/lib/generate5NutrientsByAI';

// 画像を分析する関数
export async function generateAdvice(nutrients: FiveNutrients) {
  try {
    const model = getGeminiModel();

    const prompt = `こちら5大栄養素の割合(%)を確認した上で、
    それを補うような栄養バランスが良さそうな料理をおすすめしてください。
    具体的な料理名と、その理由のみで大丈夫です。
    200文字以内でお願いします。`;

    const jsonText = JSON.stringify(nutrients);
    const textPart = {
      text: jsonText,
    };

    const result = await model.generateContent([prompt, textPart]);
    const response = await result.response;
    const text = response.text();
    return text;
  } catch (error) {
    console.error(`分析中にエラーが発生しました`, error);
    return 'エラー';
  }
}
