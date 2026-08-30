import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, LoaderCircle } from "lucide-react";
import { PhotoUploader } from "@/components/photo-uploader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { JOB_TYPES, ZONES, customerWhatsappMessage, jobTypeLabel } from "@/lib/business";
import { useQuoteDraft } from "@/lib/quote-store";
import { createQuoteRequest } from "@/lib/quotes";
import { shareQuoteToWhatsApp } from "@/lib/share-whatsapp";
import { cn } from "@/lib/utils";

const STEPS = [
  { n: 1 as const, label: "Foto" },
  { n: 2 as const, label: "Lavoro" },
  { n: 3 as const, label: "Contatto" },
];

export function QuoteWizard() {
  const navigate = useNavigate();
  const draft = useQuoteDraft();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function go(step: 1 | 2 | 3) {
    setError(null);
    draft.setDraft({ step });
  }

  function next() {
    if (draft.step === 1) {
      if (draft.photos.length < 1) {
        setError("Carica almeno una foto del lavoro.");
        return;
      }
      go(2);
      return;
    }
    if (draft.step === 2) {
      if (!draft.jobType) {
        setError("Scegli il tipo di lavoro.");
        return;
      }
      if (draft.description.trim().length < 12) {
        setError("Scrivi due righe su cosa va fatto.");
        return;
      }
      go(3);
    }
  }

  async function submit() {
    if (draft.name.trim().length < 2) {
      setError("Inserisci il tuo nome.");
      return;
    }
    if (draft.phone.replace(/\D/g, "").length < 8) {
      setError("Inserisci un numero di telefono.");
      return;
    }
    setError(null);
    setSubmitting(true);
    const photos = [...draft.photos];
    const name = draft.name.trim();
    const phone = draft.phone.trim();
    const zone = draft.zone;
    const jobType = draft.jobType;
    const description = draft.description.trim();
    try {
      const result = await createQuoteRequest({
        data: { name, phone, zone, jobType, description, photos },
      });
      await shareQuoteToWhatsApp({
        message: customerWhatsappMessage({
          id: result.id,
          name,
          zone,
          jobType,
          description,
        }),
        photos,
      });
      draft.reset();
      await navigate({ to: "/richiesta/$id", params: { id: result.id } });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Invio non riuscito. Riprova tra un attimo.",
      );
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-xl">
      <ol className="mb-8 grid grid-cols-3 gap-2">
        {STEPS.map((step) => (
          <li key={step.n} className="flex flex-col gap-2">
            <span
              className={cn(
                "h-1 rounded-full",
                draft.step >= step.n ? "bg-accent" : "bg-surface-2",
              )}
            />
            <span
              className={cn(
                "text-xs font-medium",
                draft.step === step.n ? "text-fg" : "text-subtle",
              )}
            >
              {step.n}. {step.label}
            </span>
          </li>
        ))}
      </ol>

      {draft.step === 1 && (
        <section className="space-y-5">
          <header className="space-y-2">
            <h1 className="font-display text-display tracking-tight">
              Invia una foto del lavoro
            </h1>
            <p className="text-muted">
              Una foto basta. Se puoi, aggiungine altre: quadro, soffitto, presa
              o il punto da sistemare.
            </p>
          </header>
          <PhotoUploader
            photos={draft.photos}
            onChange={(photos) => draft.setDraft({ photos })}
          />
        </section>
      )}

      {draft.step === 2 && (
        <section className="space-y-5">
          <header className="space-y-2">
            <h1 className="font-display text-display tracking-tight">
              Che lavoro ti serve?
            </h1>
            <p className="text-muted">
              Scegli la voce più vicina e descrivi cosa vuoi ottenere.
            </p>
          </header>
          <div className="flex flex-wrap gap-2">
            {JOB_TYPES.map((job) => {
              const selected = draft.jobType === job.id;
              return (
                <button
                  key={job.id}
                  type="button"
                  onClick={() => draft.setDraft({ jobType: job.id })}
                  className={cn(
                    "min-h-11 rounded-full px-3.5 text-sm font-medium transition-colors",
                    selected
                      ? "bg-accent text-accent-fg"
                      : "bg-surface-2 text-muted hover:text-fg",
                  )}
                >
                  {job.label}
                </button>
              );
            })}
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descrizione</Label>
            <Textarea
              id="description"
              value={draft.description}
              onChange={(event) =>
                draft.setDraft({ description: event.target.value })
              }
              placeholder="Vorrei aggiungere 6 faretti nel soggiorno…"
              maxLength={1200}
            />
          </div>
        </section>
      )}

      {draft.step === 3 && (
        <section className="space-y-5">
          <header className="space-y-2">
            <h1 className="font-display text-display tracking-tight">
              Dove ti ricontattiamo
            </h1>
            <p className="text-muted">
              All'invio si apre Condividi. Tocca WhatsApp, poi il contatto{" "}
              <span className="font-medium text-fg">327 459 6515</span>. Solo
              così partono anche le foto.
            </p>
          </header>
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              autoComplete="name"
              value={draft.name}
              onChange={(event) => draft.setDraft({ name: event.target.value })}
              placeholder="Mario"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Telefono</Label>
            <Input
              id="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={draft.phone}
              onChange={(event) => draft.setDraft({ phone: event.target.value })}
              placeholder="333 123 4567"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="zone">Zona</Label>
            <select
              id="zone"
              value={draft.zone}
              onChange={(event) => draft.setDraft({ zone: event.target.value })}
              className="h-12 w-full rounded-lg bg-surface-2 px-4 text-base text-fg shadow-border outline-none focus-visible:shadow-focus"
            >
              {ZONES.map((zone) => (
                <option key={zone} value={zone}>
                  {zone}
                </option>
              ))}
            </select>
          </div>
          <div className="rounded-xl bg-surface-2 p-4 text-sm text-muted">
            <p className="font-medium text-fg">Riepilogo</p>
            <p className="mt-2">
              {jobTypeLabel(draft.jobType)} · {draft.photos.length} foto ·{" "}
              {draft.zone}
            </p>
            <p className="mt-1 line-clamp-3">{draft.description}</p>
          </div>
        </section>
      )}

      {error && (
        <p className="mt-5 text-sm text-danger" role="alert">
          {error}
        </p>
      )}

      <div className="mt-8 flex gap-3">
        {draft.step > 1 ? (
          <Button
            variant="secondary"
            onClick={() => go((draft.step - 1) as 1 | 2)}
            className="flex-1"
          >
            <ArrowLeft className="size-4" />
            Indietro
          </Button>
        ) : null}
        {draft.step < 3 ? (
          <Button onClick={next} className="flex-1">
            Continua
            <ArrowRight className="size-4" />
          </Button>
        ) : (
          <Button onClick={() => void submit()} disabled={submitting} className="flex-1">
            {submitting ? (
              <>
                <LoaderCircle className="size-4 animate-spin" />
                Invio in corso
              </>
            ) : (
              "Invia su WhatsApp"
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
