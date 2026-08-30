export const BUSINESS = {
  name: "Impronta Elettrica",
  owner: "Troia Cesario",
  legal: "Impronta Elettrica di Troia Cesario",
  role: "Elettricista",
  city: "Andria",
  province: "BT",
  address: "Via Scevola Muzio, 28",
  cap: "76123",
  fullAddress: "Via Scevola Muzio, 28, 76123 Andria BT",
  phoneDisplay: "327 459 6515",
  phoneTel: "+393274596515",
  whatsapp: "393274596515",
  instagram: "https://www.instagram.com/impronta_elettrica/",
  instagramHandle: "@impronta_elettrica",
  hoursLabel: "7:00 – 21:00",
  openHour: 7,
  closeHour: 21,
  responseHours: 2,
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Via+Scevola+Muzio+28+Andria",
} as const;

export const JOB_TYPES = [
  { id: "illuminazione", label: "Illuminazione LED e faretti" },
  { id: "impianto", label: "Impianto nuovo / ristrutturazione" },
  { id: "quadro", label: "Quadro elettrico / messa a norma" },
  { id: "riparazione", label: "Presa, interruttore, guasto" },
  { id: "citofono", label: "Citofono / videocitofono" },
  { id: "sicurezza", label: "Allarme e videosorveglianza" },
  { id: "esterni", label: "Illuminazione esterna" },
  { id: "altro", label: "Altro" },
] as const;

export type JobTypeId = (typeof JOB_TYPES)[number]["id"];

export const ZONES = [
  "Andria",
  "Barletta",
  "Trani",
  "Bisceglie",
  "Corato",
  "Canosa di Puglia",
  "Minervino Murge",
  "Spinazzola",
  "Ruvo di Puglia",
  "Terlizzi",
  "Bitonto",
  "Margherita di Savoia",
  "Trinitapoli",
  "San Ferdinando di Puglia",
  "Altra zona BAT",
] as const;

export function jobTypeLabel(id: string) {
  return JOB_TYPES.find((j) => j.id === id)?.label ?? id;
}

export function isOpenNow(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Rome",
    hour: "numeric",
    minute: "numeric",
    hourCycle: "h23",
  }).formatToParts(now);
  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? 0);
  return hour >= BUSINESS.openHour && hour < BUSINESS.closeHour;
}

export function whatsappHref(text?: string) {
  const base = `https://wa.me/${BUSINESS.whatsapp}`;
  if (!text) return base;
  return `${base}?text=${encodeURIComponent(text)}`;
}

export function customerWhatsappMessage(input: {
  id: string;
  name: string;
  zone: string;
  jobType: string;
  description: string;
}) {
  return [
    "Ciao, ho inviato una richiesta preventivo dal sito.",
    "Adesso allego le foto del lavoro in questa chat.",
    "",
    `Codice: ${input.id}`,
    `Nome: ${input.name}`,
    `Zona: ${input.zone}`,
    `Lavoro: ${jobTypeLabel(input.jobType)}`,
    "",
    input.description,
  ].join("\n");
}

export function electricianWhatsappToCustomer(input: {
  name: string;
  id: string;
  phone: string;
}) {
  const digits = input.phone.replace(/\D/g, "");
  const intl = digits.startsWith("39") ? digits : `39${digits}`;
  const text = `Ciao ${input.name.split(" ")[0]}, sono Cesario di Impronta Elettrica. Ho visto la tua richiesta ${input.id} e ti contatto per il preventivo.`;
  return `https://wa.me/${intl}?text=${encodeURIComponent(text)}`;
}
