import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Clock, LoaderCircle, MessageCircle, Phone } from "lucide-react";
import { Logo } from "@/components/logo";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  BUSINESS,
  customerWhatsappMessage,
  jobTypeLabel,
} from "@/lib/business";
import { getQuoteRequest } from "@/lib/quotes";
import { shareQuoteToWhatsApp } from "@/lib/share-whatsapp";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/richiesta/$id")({
  component: ConfermaPage,
  loader: async ({ params }) => {
    const quote = await getQuoteRequest({ data: { id: params.id } });
    return { quote };
  },
  head: () => ({
    meta: [{ title: "Richiesta ricevuta · Impronta Elettrica" }],
  }),
});

function ConfermaPage() {
  const { quote } = Route.useLoaderData();
  const [sharing, setSharing] = useState(false);

  if (!quote) {
    return (
      <main className="mx-auto flex min-h-dvh max-w-lg flex-col items-center justify-center px-6 text-center">
        <Logo />
        <h1 className="mt-8 font-display text-3xl">Richiesta non trovata</h1>
        <p className="mt-3 text-muted">Il codice non corrisponde a nessuna pratica.</p>
        <Link
          to="/preventivo"
          className={cn(buttonVariants({ variant: "primary" }), "mt-8")}
        >
          Invia una nuova richiesta
        </Link>
      </main>
    );
  }

  const photos = quote.photos;
  const message = customerWhatsappMessage({
    id: quote.id,
    name: quote.name,
    zone: quote.zone,
    jobType: quote.jobType,
    description: quote.description,
  });

  async function sendWhatsApp() {
    setSharing(true);
    try {
      await shareQuoteToWhatsApp({ message, photos });
    } finally {
      setSharing(false);
    }
  }

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <header className="mx-auto flex max-w-lg items-center px-4 py-5 sm:px-6">
        <Logo />
      </header>
      <main className="mx-auto max-w-lg px-4 pb-16 sm:px-6">
        <div className="mb-6 grid size-14 place-items-center rounded-2xl bg-open/15 text-open">
          <Check className="size-7" strokeWidth={2.2} />
        </div>
        <p className="text-sm font-medium tracking-wide text-open">Richiesta ricevuta</p>
        <h1 className="mt-2 font-display text-4xl tracking-tight">
          Abbiamo le tue foto.
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted">
          Un tecnico valuta il lavoro e ti ricontatta. Codice pratica{" "}
          <span className="font-medium text-fg">{quote.id}</span>.
        </p>

        <div className="mt-8 space-y-3 rounded-2xl bg-surface p-5 shadow-border">
          <p className="flex items-center gap-2 text-sm text-muted">
            <Clock className="size-4" />
            Tempo medio di risposta: {BUSINESS.responseHours} ore
          </p>
          <p className="text-sm text-muted">
            {jobTypeLabel(quote.jobType)} · {quote.zone} · {quote.photoCount} foto
          </p>
          {quote.photos.length > 0 && (
            <div
              className={cn(
                "mt-2 grid gap-2",
                quote.photos.length === 1 ? "grid-cols-1" : "grid-cols-2",
              )}
            >
              {quote.photos.map((src, index) => (
                <img
                  key={`${quote.id}-${index}`}
                  src={src}
                  alt={`Foto inviata ${index + 1}`}
                  className="aspect-[4/3] w-full rounded-xl object-cover"
                />
              ))}
            </div>
          )}
        </div>

        <div className="mt-8 space-y-3">
          <p className="text-sm font-medium text-fg">
            Invia anche le foto su WhatsApp a Cesario
          </p>
          <p className="text-sm text-muted">
            Sul telefono si apre WhatsApp con testo e foto già pronte. Scegli la
            chat e invia.
          </p>
          <Button
            variant="whatsapp"
            size="lg"
            className="w-full"
            disabled={sharing}
            onClick={() => void sendWhatsApp()}
          >
            {sharing ? (
              <LoaderCircle className="size-5 animate-spin" />
            ) : (
              <MessageCircle className="size-5" />
            )}
            Invia foto su WhatsApp
          </Button>
          <a
            href={`tel:${BUSINESS.phoneTel}`}
            className={cn(buttonVariants({ variant: "secondary", size: "lg" }), "w-full")}
          >
            <Phone className="size-5" />
            Chiama {BUSINESS.phoneDisplay}
          </a>
        </div>

        <Link to="/" className="mt-10 inline-flex min-h-11 items-center text-sm text-muted hover:text-fg">
          Torna alla home
        </Link>
      </main>
    </div>
  );
}
