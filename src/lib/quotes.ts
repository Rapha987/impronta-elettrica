import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getSql } from "@/lib/db";
import { JOB_TYPES, ZONES } from "@/lib/business";
import type { QuoteDetail, QuoteStatus, QuoteSummary } from "@/lib/quote-types";

const WORKSHOP_PIN = "andria28";
const JOB_IDS = JOB_TYPES.map((j) => j.id) as [string, ...string[]];
const ZONE_LIST = [...ZONES] as [string, ...string[]];

const photoSchema = z
  .string()
  .min(8)
  .max(400_000)
  .refine(
    (value) =>
      value.startsWith("data:image/") ||
      value.startsWith("/") ||
      value.startsWith("https://"),
    "Formato foto non valido",
  );

const createSchema = z.object({
  name: z.string().trim().min(2, "Inserisci il nome").max(80),
  phone: z
    .string()
    .trim()
    .min(8, "Inserisci un telefono valido")
    .max(22)
    .regex(/^[+\d\s().-]{8,22}$/, "Telefono non valido"),
  zone: z.enum(ZONE_LIST),
  jobType: z.enum(JOB_IDS),
  description: z
    .string()
    .trim()
    .min(12, "Descrivi il lavoro in almeno due frasi")
    .max(1200),
  photos: z.array(photoSchema).min(1, "Carica almeno una foto").max(5),
});

const pinSchema = z.object({
  pin: z.string().min(1).max(40),
});

function assertPin(pin: string) {
  if (pin.trim().toLowerCase() !== WORKSHOP_PIN) {
    throw new Error("Codice non valido");
  }
}

function makeId() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let id = "IE-";
  for (let i = 0; i < 6; i += 1) {
    id += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return id;
}

function parsePhotos(raw: string): string[] {
  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === "string")
      : [];
  } catch {
    return [];
  }
}

function asStatus(value: string): QuoteStatus {
  if (
    value === "nuova" ||
    value === "vista" ||
    value === "contattata" ||
    value === "chiusa"
  ) {
    return value;
  }
  return "nuova";
}

type QuoteRow = {
  id: string;
  name: string;
  phone: string;
  zone: string;
  job_type: string;
  description: string;
  status: string;
  created_at: string;
  photos_json: string;
};

function toDetail(row: QuoteRow): QuoteDetail {
  const photos = parsePhotos(row.photos_json);
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    zone: row.zone,
    jobType: row.job_type,
    description: row.description,
    status: asStatus(row.status),
    createdAt: row.created_at,
    photos,
    photoCount: photos.length,
    coverPhoto: photos[0] ?? null,
  };
}

export const createQuoteRequest = createServerFn({ method: "POST" })
  .validator(createSchema)
  .handler(async ({ data }) => {
    const sql = await getSql();
    const id = makeId();
    await sql`
      insert into quote_requests
        (id, name, phone, zone, job_type, description, photos_json, status)
      values
        (
          ${id},
          ${data.name},
          ${data.phone},
          ${data.zone},
          ${data.jobType},
          ${data.description},
          ${JSON.stringify(data.photos)},
          ${"nuova"}
        )
    `;
    return { id };
  });

export const getQuoteRequest = createServerFn({ method: "GET" })
  .validator(z.object({ id: z.string().min(4).max(16) }))
  .handler(async ({ data }) => {
    const sql = await getSql();
    const rows = await sql<QuoteRow>`
      select id, name, phone, zone, job_type, description, status, created_at, photos_json
      from quote_requests
      where id = ${data.id}
      limit 1
    `;
    const row = rows[0];
    if (!row) return null;
    return toDetail(row);
  });

export const unlockWorkshop = createServerFn({ method: "POST" })
  .validator(pinSchema)
  .handler(async ({ data }) => {
    assertPin(data.pin);
    return { ok: true as const };
  });

export const listQuoteRequests = createServerFn({ method: "POST" })
  .validator(pinSchema)
  .handler(async ({ data }) => {
    assertPin(data.pin);
    const sql = await getSql();
    const rows = await sql<{
      id: string;
      name: string;
      phone: string;
      zone: string;
      job_type: string;
      description: string;
      status: string;
      created_at: string;
      photo_count: number;
      cover_photo: string | null;
    }>`
      select
        id,
        name,
        phone,
        zone,
        job_type,
        left(description, 220) as description,
        status,
        created_at,
        jsonb_array_length(photos_json::jsonb) as photo_count,
        photos_json::jsonb ->> 0 as cover_photo
      from quote_requests
      order by created_at desc
      limit 80
    `;
    return rows.map(
      (row): QuoteSummary => ({
        id: row.id,
        name: row.name,
        phone: row.phone,
        zone: row.zone,
        jobType: row.job_type,
        description: row.description,
        status: asStatus(row.status),
        createdAt: row.created_at,
        photoCount: Number(row.photo_count) || 0,
        coverPhoto: row.cover_photo,
      }),
    );
  });

export const getWorkshopQuote = createServerFn({ method: "POST" })
  .validator(z.object({ pin: z.string().min(1).max(40), id: z.string().min(4).max(16) }))
  .handler(async ({ data }) => {
    assertPin(data.pin);
    const sql = await getSql();
    const rows = await sql<QuoteRow>`
      select id, name, phone, zone, job_type, description, status, created_at, photos_json
      from quote_requests
      where id = ${data.id}
      limit 1
    `;
    const row = rows[0];
    if (!row) return null;
    if (row.status === "nuova") {
      await sql`
        update quote_requests set status = ${"vista"} where id = ${row.id} and status = ${"nuova"}
      `;
      row.status = "vista";
    }
    return toDetail(row);
  });

export const updateQuoteStatus = createServerFn({ method: "POST" })
  .validator(
    z.object({
      pin: z.string().min(1).max(40),
      id: z.string().min(4).max(16),
      status: z.enum(["nuova", "vista", "contattata", "chiusa"]),
    }),
  )
  .handler(async ({ data }) => {
    assertPin(data.pin);
    const sql = await getSql();
    await sql`
      update quote_requests
      set status = ${data.status}
      where id = ${data.id}
    `;
    return { ok: true as const };
  });
