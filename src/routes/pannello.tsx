import { useEffect, useMemo, useState, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { formatDistanceToNow } from "date-fns";
import { it } from "date-fns/locale";
import {
  ArrowLeft,
  Camera,
  LoaderCircle,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";
import { Logo } from "@/components/logo";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  electricianWhatsappToCustomer,
  jobTypeLabel,
} from "@/lib/business";
import type { QuoteDetail, QuoteStatus, QuoteSummary } from "@/lib/quote-types";
import { STATUS_LABEL } from "@/lib/quote-types";
import {
  getWorkshopQuote,
  listQuoteRequests,
  unlockWorkshop,
  updateQuoteStatus,
} from "@/lib/quotes";
import { cn } from "@/lib/utils";

const PIN_KEY = "ie-workshop-pin";

export const Route = createFileRoute("/pannello")({
  component: PannelloPage,
  head: () => ({
    meta: [{ title: "Pannello tecnico · Impronta Elettrica" }],
  }),
});

function statusTone(status: QuoteStatus) {
  if (status === "nuova") return "warn" as const;
  if (status === "contattata") return "open" as const;
  if (status === "chiusa") return "neutral" as const;
  return "accent" as const;
}

function PannelloPage() {
  const [pin, setPin] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quotes, setQuotes] = useState<QuoteSummary[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<QuoteDetail | null>(null);
  const [filter, setFilter] = useState<"tutte" | QuoteStatus>("tutte");

  async function loadList(currentPin: string) {
    const rows = await listQuoteRequests({ data: { pin: currentPin } });
    setQuotes(rows);
    return rows;
  }

  useEffect(() => {
    const stored = sessionStorage.getItem(PIN_KEY);
    if (!stored) return;
    setBusy(true);
    void loadList(stored)
      .then(() => {
        setPin(stored);
        setUnlocked(true);
      })
      .catch(() => {
        sessionStorage.removeItem(PIN_KEY);
      })
      .finally(() => setBusy(false));
  }, []);

  async function handleUnlock(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await unlockWorkshop({ data: { pin } });
      sessionStorage.setItem(PIN_KEY, pin);
      await loadList(pin);
      setUnlocked(true);
    } catch {
      setError("Codice non valido.");
    } finally {
      setBusy(false);
    }
  }

  async function openQuote(id: string) {
    setSelectedId(id);
    setDetail(null);
    try {
      const row = await getWorkshopQuote({ data: { pin, id } });
      setDetail(row);
      setQuotes((current) =>
        current.map((item) =>
          item.id === id && item.status === "nuova"
            ? { ...item, status: "vista" }
            : item,
        ),
      );
    } catch {
      setError("Impossibile aprire la pratica.");
    }
  }

  async function setStatus(status: QuoteStatus) {
    if (!selectedId) return;
    await updateQuoteStatus({ data: { pin, id: selectedId, status } });
    setQuotes((current) =>
      current.map((item) => (item.id === selectedId ? { ...item, status } : item)),
    );
    setDetail((current) => (current ? { ...current, status } : current));
  }

  const visible = useMemo(
    () => (filter === "tutte" ? quotes : quotes.filter((item) => item.status === filter)),
    [quotes, filter],
  );
  const nuovaCount = quotes.filter((item) => item.status === "nuova").length;

  if (!unlocked) {
    return (
      <main className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center px-6">
        <Logo />
        <h1 className="mt-8 font-display text-3xl">Pannello tecnico</h1>
        <p className="mt-2 text-sm text-muted">
          Accesso riservato all'elettricista. Inserisci il codice laboratorio.
        </p>
        <form onSubmit={(event) => void handleUnlock(event)} className="mt-8 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pin">Codice</Label>
            <Input
              id="pin"
              type="password"
              autoComplete="current-password"
              value={pin}
              onChange={(event) => setPin(event.target.value)}
            />
          </div>
          {error && <p className="text-sm text-danger">{error}</p>}
          <Button type="submit" className="w-full" disabled={busy}>
            {busy ? <LoaderCircle className="size-4 animate-spin" /> : "Entra"}
          </Button>
        </form>
        <Link to="/" className="mt-8 text-sm text-muted hover:text-fg">
          Torna al sito
        </Link>
      </main>
    );
  }

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Logo compact />
            <div>
              <p className="text-sm font-medium">Richieste preventivo</p>
              <p className="text-xs text-subtle">
                {nuovaCount} {nuovaCount === 1 ? "nuova" : "nuove"}
              </p>
            </div>
          </div>
          <Link
            to="/"
            className="inline-flex min-h-11 items-center gap-2 text-sm text-muted hover:text-fg"
          >
            <ArrowLeft className="size-4" />
            Sito
          </Link>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl lg:grid-cols-2">
        <section
          className={cn(
            "border-b border-border lg:border-r lg:border-b-0",
            detail && "max-lg:hidden",
          )}
        >
          <div className="flex gap-2 overflow-x-auto px-4 py-4 sm:px-6">
            {(["tutte", "nuova", "vista", "contattata", "chiusa"] as const).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setFilter(item)}
                className={cn(
                  "min-h-10 shrink-0 rounded-full px-3 text-sm",
                  filter === item ? "bg-accent text-accent-fg" : "bg-surface-2 text-muted",
                )}
              >
                {item === "tutte" ? "Tutte" : STATUS_LABEL[item]}
              </button>
            ))}
          </div>
          <ul className="divide-y divide-border">
            {visible.length === 0 && (
              <li className="px-6 py-12 text-sm text-muted">Nessuna richiesta qui.</li>
            )}
            {visible.map((quote) => (
              <li key={quote.id}>
                <button
                  type="button"
                  onClick={() => void openQuote(quote.id)}
                  className={cn(
                    "flex w-full gap-3 px-4 py-4 text-left hover:bg-surface sm:px-6",
                    selectedId === quote.id && "bg-surface",
                  )}
                >
                  {quote.coverPhoto ? (
                    <img
                      src={quote.coverPhoto}
                      alt=""
                      className="size-16 shrink-0 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="grid size-16 shrink-0 place-items-center rounded-lg bg-surface-2 text-subtle">
                      <Camera className="size-5" />
                    </div>
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2">
                      <span className="truncate font-medium">{quote.name}</span>
                      <Badge tone={statusTone(quote.status)}>{STATUS_LABEL[quote.status]}</Badge>
                    </span>
                    <span className="mt-1 flex items-center gap-1 text-xs text-muted">
                      <MapPin className="size-3" />
                      {quote.zone} · {jobTypeLabel(quote.jobType)}
                    </span>
                    <span className="mt-1 line-clamp-2 text-sm text-muted">
                      {quote.description}
                    </span>
                    <span className="mt-1 text-xs text-subtle">
                      {quote.photoCount} foto ·{" "}
                      {formatDistanceToNow(new Date(quote.createdAt), {
                        addSuffix: true,
                        locale: it,
                      })}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section className={cn("px-4 py-6 sm:px-6", !detail && "max-lg:hidden")}>
          {!detail && (
            <div className="hidden min-h-80 place-items-center text-sm text-muted lg:grid">
              Apri una richiesta per vedere le foto e ricontattare.
            </div>
          )}
          {detail && (
            <article className="space-y-5">
              <button
                type="button"
                onClick={() => {
                  setSelectedId(null);
                  setDetail(null);
                }}
                className="inline-flex min-h-11 items-center gap-2 text-sm text-muted hover:text-fg lg:hidden"
              >
                <ArrowLeft className="size-4" />
                Elenco
              </button>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs tracking-wide text-subtle">{detail.id}</p>
                  <h1 className="mt-1 font-display text-3xl">{detail.name}</h1>
                  <p className="mt-1 text-sm text-muted">
                    {detail.zone} · {jobTypeLabel(detail.jobType)}
                  </p>
                </div>
                <Badge tone={statusTone(detail.status)}>{STATUS_LABEL[detail.status]}</Badge>
              </div>

              <p className="leading-relaxed text-muted">{detail.description}</p>

              <div
                className={cn(
                  "grid gap-2",
                  detail.photos.length === 1 ? "grid-cols-1" : "grid-cols-2",
                )}
              >
                {detail.photos.map((src, index) => (
                  <img
                    key={`${detail.id}-${index}`}
                    src={src}
                    alt={`Foto ${index + 1} della richiesta`}
                    className="aspect-[4/3] w-full rounded-xl object-cover"
                  />
                ))}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <a
                  href={`tel:${detail.phone}`}
                  className={cn(buttonVariants({ variant: "primary" }), "flex-1")}
                >
                  <Phone className="size-4" />
                  Chiama {detail.phone}
                </a>
                <a
                  href={electricianWhatsappToCustomer(detail)}
                  target="_blank"
                  rel="noreferrer"
                  className={cn(buttonVariants({ variant: "whatsapp" }), "flex-1")}
                >
                  <MessageCircle className="size-4" />
                  WhatsApp
                </a>
              </div>

              <div className="flex flex-wrap gap-2">
                {(["vista", "contattata", "chiusa"] as const).map((status) => (
                  <Button
                    key={status}
                    size="sm"
                    variant={detail.status === status ? "primary" : "secondary"}
                    onClick={() => void setStatus(status)}
                  >
                    {STATUS_LABEL[status]}
                  </Button>
                ))}
              </div>
            </article>
          )}
        </section>
      </div>
    </div>
  );
}
