import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Camera,
  Check,
  Clock,
  Lightbulb,
  MapPin,
  MessageCircle,
  Phone,
  Shield,
  Sparkles,
  Wrench,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { BUSINESS, isOpenNow, whatsappHref } from "@/lib/business";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  component: Home,
});

const WORKS = [
  { src: "/works/soggiorno.jpg", alt: "Soggiorno con faretti LED e luce perimetrale", label: "Soggiorno · Andria" },
  { src: "/works/esterno.jpg", alt: "Illuminazione facciata al crepuscolo", label: "Esterno" },
  { src: "/works/cucina.jpg", alt: "Cucina con strisce LED sotto pensili", label: "Cucina" },
  { src: "/works/quadro.jpg", alt: "Quadro elettrico messo a norma", label: "Quadro" },
  { src: "/works/bagno.jpg", alt: "Bagno con specchio LED", label: "Bagno" },
];

const SERVICES = [
  { icon: Lightbulb, title: "Illuminazione", text: "Faretti, LED perimetrali, plafoniere, esterni." },
  { icon: Shield, title: "Messa a norma", text: "Quadri, differenziali, certificazioni per ristrutturazioni." },
  { icon: Wrench, title: "Guasti e urgenze", text: "Prese, interruttori, corti, citofoni." },
  { icon: Sparkles, title: "Impianti nuovi", text: "Dal tracciato al collaudo, civile e residenziale." },
];

const STEPS = [
  { n: "01", title: "Invii le foto", text: "Dal telefono, anche dal cantiere o dal salotto." },
  { n: "02", title: "Valutiamo il lavoro", text: "Un tecnico guarda le immagini e la zona." },
  { n: "03", title: "Ti richiamiamo", text: "Preventivo chiaro, senza giri di messaggi." },
];

const TOWNS = [
  "Andria",
  "Barletta",
  "Trani",
  "Bisceglie",
  "Corato",
  "Canosa",
  "Ruvo",
  "Terlizzi",
];

const FAQS = [
  {
    q: "Il preventivo è a pagamento?",
    a: "No. Invia le foto, ti diciamo se il lavoro è fattibile e quanto costa.",
  },
  {
    q: "Devo mandarvi le foto su WhatsApp?",
    a: "Caricale qui: partono ordinate, con zona e recapito. All'invio si apre WhatsApp con le foto già allegate da mandare a Cesario.",
  },
  {
    q: "In quanto rispondete?",
    a: `In media ${BUSINESS.responseHours} ore, tutti i giorni dalle ${BUSINESS.hoursLabel.replace("–", "alle")}.`,
  },
  {
    q: "Uscite solo ad Andria?",
    a: "Andria è la base. Copriamo Barletta-Andria-Trani e i paesi vicini.",
  },
];

function Home() {
  const open = isOpenNow();

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <SiteHeader />
      <main>
        <section className="mx-auto max-w-6xl px-4 pt-10 pb-16 sm:px-6 sm:pt-16">
          <div className="stagger-in max-w-2xl space-y-6">
            <Badge tone={open ? "open" : "neutral"}>
              <span className={cn("size-1.5 rounded-full", open ? "bg-open" : "bg-muted")} />
              {BUSINESS.role}, {BUSINESS.city} · {open ? "Aperto" : "Chiuso ora"}
            </Badge>
            <h1 className="font-display text-hero leading-tight tracking-tight">
              Hai bisogno di un elettricista?
            </h1>
            <p className="max-w-lg text-lg leading-relaxed text-muted">
              Invia una foto del lavoro. Un tecnico valuta e ti ricontatta con il
              preventivo — senza il classico “mandami le foto su WhatsApp”.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                to="/preventivo"
                className={cn(buttonVariants({ variant: "primary", size: "lg" }), "w-full sm:w-auto")}
              >
                <Camera className="size-5" />
                Invia una foto del lavoro
              </Link>
              <a
                href={whatsappHref()}
                target="_blank"
                rel="noreferrer"
                className={cn(buttonVariants({ variant: "secondary", size: "lg" }), "w-full sm:w-auto")}
              >
                <MessageCircle className="size-5" />
                WhatsApp
              </a>
            </div>
            <p className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-subtle">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="size-3.5" />
                Risposta media {BUSINESS.responseHours} ore
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="size-3.5" />
                {BUSINESS.address}
              </span>
            </p>
          </div>

          <div className="mt-12 grid grid-cols-3 gap-3 sm:mt-16 sm:gap-4">
            <img
              src={WORKS[0].src}
              alt={WORKS[0].alt}
              className="col-span-2 aspect-[4/3] h-full w-full rounded-2xl object-cover sm:rounded-3xl"
            />
            <img
              src={WORKS[1].src}
              alt={WORKS[1].alt}
              className="col-span-1 aspect-[3/4] h-full w-full rounded-2xl object-cover sm:rounded-3xl"
            />
          </div>
        </section>

        <section className="border-y border-border bg-surface">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:px-6 md:grid-cols-3 md:gap-10">
            {STEPS.map((step) => (
              <div key={step.n} className="space-y-3">
                <p className="font-display text-3xl text-subtle">{step.n}</p>
                <h2 className="text-lg font-medium">{step.title}</h2>
                <p className="text-sm leading-relaxed text-muted">{step.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <p className="text-sm font-medium tracking-wide text-muted">Lavori</p>
          <h2 className="mt-2 max-w-xl font-display text-3xl tracking-tight sm:text-4xl">
            Impianti puliti, luce che si vede.
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {SERVICES.map((service) => (
              <div
                key={service.title}
                className="flex gap-4 rounded-2xl bg-surface p-5 shadow-border"
              >
                <service.icon className="mt-0.5 size-5 shrink-0 text-accent" />
                <div>
                  <h3 className="font-medium">{service.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{service.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {WORKS.slice(1).map((work) => (
              <figure key={work.src} className="space-y-2">
                <img
                  src={work.src}
                  alt={work.alt}
                  className="aspect-[4/3] w-full rounded-xl object-cover sm:rounded-2xl"
                />
                <figcaption className="text-xs text-subtle">{work.label}</figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className="border-y border-border bg-surface">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-[1.1fr_1fr] md:items-center">
            <div>
              <p className="text-sm font-medium tracking-wide text-muted">Zona</p>
              <h2 className="mt-2 font-display text-3xl tracking-tight sm:text-4xl">
                Andria e provincia BAT
              </h2>
              <p className="mt-4 max-w-md text-muted">
                Base in {BUSINESS.address}. Usciamo nei comuni vicini per impianti,
                ristrutturazioni e urgenze.
              </p>
              <a
                href={BUSINESS.mapsUrl}
                target="_blank"
                rel="noreferrer"
                className={cn(buttonVariants({ variant: "outline" }), "mt-6")}
              >
                <MapPin className="size-4" />
                Indicazioni
              </a>
            </div>
            <ul className="grid grid-cols-2 gap-2">
              {TOWNS.map((town) => (
                <li
                  key={town}
                  className={cn(
                    "rounded-xl px-4 py-3 text-sm",
                    town === "Andria"
                      ? "bg-accent text-accent-fg"
                      : "bg-surface-2 text-muted",
                  )}
                >
                  {town}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="font-display text-3xl tracking-tight">Domande frequenti</h2>
          <dl className="mt-8 divide-y divide-border">
            {FAQS.map((item) => (
              <div key={item.q} className="grid gap-2 py-5 md:grid-cols-2 md:gap-10">
                <dt className="font-medium">{item.q}</dt>
                <dd className="text-sm leading-relaxed text-muted">{item.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="px-4 pb-16 sm:px-6">
          <div className="mx-auto max-w-6xl rounded-3xl bg-surface px-6 py-12 shadow-border sm:px-12">
            <h2 className="max-w-lg font-display text-3xl tracking-tight sm:text-4xl">
              Hai già le foto? Invia la richiesta ora.
            </h2>
            <p className="mt-4 max-w-md text-muted">
              La pratica arriva in ordine: foto, zona, recapito. Cesario ti richiama.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-muted">
              <li className="flex items-center gap-2">
                <Check className="size-4 text-open" /> Preventivo gratuito
              </li>
              <li className="flex items-center gap-2">
                <Check className="size-4 text-open" /> Fino a 5 foto
              </li>
              <li className="flex items-center gap-2">
                <Check className="size-4 text-open" /> Risposta media {BUSINESS.responseHours} ore
              </li>
            </ul>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/preventivo"
                className={cn(buttonVariants({ variant: "primary", size: "lg" }))}
              >
                Invia una foto del lavoro
                <ArrowRight className="size-4" />
              </Link>
              <a
                href={`tel:${BUSINESS.phoneTel}`}
                className={cn(buttonVariants({ variant: "secondary", size: "lg" }))}
              >
                <Phone className="size-4" />
                {BUSINESS.phoneDisplay}
              </a>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
