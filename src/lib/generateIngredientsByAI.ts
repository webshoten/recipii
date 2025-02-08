import { GoogleGenerativeAI } from '@google/generative-ai';
import { url } from 'inspector';

// Geminiモデルを初期化する関数
function initializeGeminiModel(apiKey: string) {
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });
}

// 環境変数からAPIキーを取得し、検証する関数
function getApiKey(): string {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
  if (!apiKey) {
    console.error('GCP_API_KEY 環境変数が設定されていません。');
    process.exit(1);
  }
  return apiKey;
}

// ローカルの画像ファイルを読み込み、Base64エンコードする関数
async function readImageFile(
  filePath: string,
): Promise<{ data: string; mimeType: string }> {
  try {
    const res = await fetch(filePath);
    const arrayBuffer = await res.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');
    const mimeType = res.headers.get('content-type') || '';
    return { data: base64, mimeType };
  } catch (error) {
    console.error(`画像ファイルの読み込みに失敗しました: ${filePath}`, error);
    throw error;
  }
}

// 画像を分析する関数
async function analyzeImage(imagePath: string) {
  const apiKey = getApiKey();
  try {
    const model = initializeGeminiModel(apiKey);
    const { data: base64, mimeType } = await readImageFile(imagePath);

    const prompt = `こちらのURL(${url})で表示されている画像の中の料理で使用している食材のみをカンマ区切りで書き出してください。
    出力は「食材A,材料B」のようにお願いします。
    料理じゃなかった場合は空文字のみで問題ありません。`;
    const imagePart = {
      inlineData: {
        data: base64,
        mimeType: mimeType,
      },
    };

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const ingredients = response.text().trim().split(',');
    return ingredients;
  } catch (error) {
    console.error(`画像の分析中にエラーが発生しました: ${imagePath}`, error);
  }
}

export async function generateIngredientsByAI(url: string) {
  return await analyzeImage(url);
}
