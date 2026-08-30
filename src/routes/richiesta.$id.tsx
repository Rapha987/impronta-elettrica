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
        <h1 className="mt-8 font-display text-3xl">Richiesta pronta</h1>
        <p className="mt-3 text-muted">
          In WhatsApp invia il testo e allega le foto con la graffetta.
        </p>
        <Link
          to="/preventivo"
          className={cn(buttonVariants({ variant: "primary" }), "mt-8")}
        >
          Nuova richiesta
        </Link>
      </main>
    );
  }

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
      await shareQuoteToWhatsApp({ message, photos: [] });
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
        <p className="text-sm font-medium tracking-wide text-open">Chat aperta</p>
        <h1 className="mt-2 font-display text-4xl tracking-tight">
          Allega le foto in WhatsApp.
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted">
          Invia il messaggio già scritto. Poi tocca la graffetta e manda le foto
          del lavoro. Codice{" "}
          <span className="font-medium text-fg">{quote.id}</span>.
        </p>

        <div className="mt-8 space-y-3 rounded-2xl bg-surface p-5 shadow-border">
          <p className="flex items-center gap-2 text-sm text-muted">
            <Clock className="size-4" />
            Tempo medio di risposta: {BUSINESS.responseHours} ore
          </p>
          <p className="text-sm text-muted">
            {jobTypeLabel(quote.jobType)} · {quote.zone}
          </p>
        </div>

        <div className="mt-8 space-y-3">
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
            Apri di nuovo WhatsApp
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
