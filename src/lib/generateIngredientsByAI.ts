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
    console.error('NEXT_PUBLIC_GEMINI_API_KEY 環境変数が設定されていません。');
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
export async function analyzeImage(imagePath: string) {
  const apiKey = getApiKey();
  try {
    const model = initializeGeminiModel(apiKey);
    const { data: base64, mimeType } = await readImageFile(imagePath);

    const prompt = `こちらのURL(${url})で表示されている画像の中の料理で使用している食材と量をカンマ区切りで書き出してください。
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
