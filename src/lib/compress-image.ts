const MAX_EDGE = 1280;
const MAX_CHARS = 280_000;

export async function compressImage(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close();
    throw new Error("Impossibile elaborare l'immagine");
  }
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  let quality = 0.72;
  let dataUrl = canvas.toDataURL("image/jpeg", quality);
  while (dataUrl.length > MAX_CHARS && quality > 0.38) {
    quality -= 0.08;
    dataUrl = canvas.toDataURL("image/jpeg", quality);
  }
  return dataUrl;
}

export function isAllowedImage(file: File) {
  if (!file.type) {
    return /\.(jpe?g|png|webp|gif|heic|heif|bmp)$/i.test(file.name);
  }
  return file.type.startsWith("image/");
}

