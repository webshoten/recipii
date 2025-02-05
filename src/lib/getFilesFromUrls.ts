export async function getFilesFromUrls(imageUrls: string[]): Promise<File[]> {
  const files: File[] = [];

  for (const imageUrl of imageUrls) {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const fileName = getFileNameFromUrl(imageUrl); // URLからファイル名を抽出
      const file = new File([blob], fileName, { type: blob.type });
      files.push(file);
    } catch (error) {
      console.error(`Error fetching image from ${imageUrl}:`, error);
      // エラー処理: ファイルの取得に失敗した場合の処理
    }
  }

  return files;
}

function getFileNameFromUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const fileName = decodeURI(
      pathname.substring(pathname.lastIndexOf('/') + 1),
    );
    return fileName;
  } catch (error) {
    console.error('Error parsing URL:', error);
    return 'image.jpg'; // デフォルトのファイル名
  }
}
