import { whatsappHref } from "@/lib/business";

export async function shareQuoteToWhatsApp(input: {
  message: string;
  photos: string[];
}): Promise<"opened"> {
  void input.photos;
  window.location.assign(whatsappHref(input.message));
  return "opened";
}
