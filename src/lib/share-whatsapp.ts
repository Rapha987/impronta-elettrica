import { whatsappHref } from "@/lib/business";

async function toFile(src: string, index: number): Promise<File | null> {
  try {
    const response = await fetch(src);
    const blob = await response.blob();
    const type = blob.type || "image/jpeg";
    const ext = type.includes("png") ? "png" : type.includes("webp") ? "webp" : "jpg";
    return new File([blob], `lavoro-${index + 1}.${ext}`, { type });
  } catch {
    return null;
  }
}

export async function photosToFiles(photos: string[]) {
  const files: File[] = [];
  for (let i = 0; i < photos.length; i += 1) {
    const file = await toFile(photos[i], i);
    if (file) files.push(file);
  }
  return files;
}

export function canShareFiles(files: File[]) {
  return (
    files.length > 0 &&
    typeof navigator !== "undefined" &&
    typeof navigator.canShare === "function" &&
    navigator.canShare({ files })
  );
}

export async function shareQuoteToWhatsApp(input: {
  message: string;
  photos: string[];
}): Promise<"shared" | "opened" | "cancelled"> {
  const files = await photosToFiles(input.photos);
  if (canShareFiles(files)) {
    try {
      await navigator.share({
        title: "Preventivo Impronta Elettrica",
        text: input.message,
        files,
      });
      return "shared";
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        return "cancelled";
      }
    }
  }
  window.open(whatsappHref(input.message), "_blank", "noopener,noreferrer");
  return "opened";
}
