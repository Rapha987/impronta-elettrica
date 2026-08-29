export const QUOTE_STATUSES = ["nuova", "vista", "contattata", "chiusa"] as const;
export type QuoteStatus = (typeof QUOTE_STATUSES)[number];

export type QuoteSummary = {
  id: string;
  name: string;
  phone: string;
  zone: string;
  jobType: string;
  description: string;
  status: QuoteStatus;
  createdAt: string;
  photoCount: number;
  coverPhoto: string | null;
};

export type QuoteDetail = QuoteSummary & {
  photos: string[];
};

export const STATUS_LABEL: Record<QuoteStatus, string> = {
  nuova: "Nuova",
  vista: "Vista",
  contattata: "Contattata",
  chiusa: "Chiusa",
};
