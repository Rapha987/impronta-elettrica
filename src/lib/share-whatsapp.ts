import { whatsappHref } from "@/lib/business";

export async function shareQuoteToWhatsApp(input: {
  message: string;
  photos: string[];
}): Promise<"opened"> {
  void input.photos;
  const url = whatsappHref(input.message);
  window.location.assign(url);
  return "opened";
}
