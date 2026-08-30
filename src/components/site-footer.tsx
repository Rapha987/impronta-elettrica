import { Link } from "@tanstack/react-router";
import { MapPin, Phone, Clock } from "lucide-react";
import { Logo } from "@/components/logo";
import { BUSINESS } from "@/lib/business";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.2fr_1fr_1fr]">
        <div className="space-y-4">
          <Logo plate />
          <p className="max-w-sm text-sm leading-relaxed text-muted">
            Impianti elettrici civili ad Andria e provincia. Preventivo da una
            foto, senza giri di chiamate.
          </p>
        </div>
        <div className="space-y-3 text-sm">
          <p className="font-medium text-fg">Studio</p>
          <a
            href={BUSINESS.mapsUrl}
            className="flex items-start gap-2 text-muted hover:text-fg"
            target="_blank"
            rel="noreferrer"
          >
            <MapPin className="mt-0.5 size-4 shrink-0" />
            {BUSINESS.fullAddress}
          </a>
          <a
            href={`tel:${BUSINESS.phoneTel}`}
            className="flex items-center gap-2 text-muted hover:text-fg"
          >
            <Phone className="size-4 shrink-0" />
            {BUSINESS.phoneDisplay}
          </a>
          <p className="flex items-center gap-2 text-muted">
            <Clock className="size-4 shrink-0" />
            Tutti i giorni {BUSINESS.hoursLabel}
          </p>
        </div>
        <div className="space-y-3 text-sm">
          <p className="font-medium text-fg">Richieste</p>
          <Link to="/preventivo" className="block text-muted hover:text-fg">
            Invia foto del lavoro
          </Link>
          <a
            href={BUSINESS.instagram}
            className="block text-muted hover:text-fg"
            target="_blank"
            rel="noreferrer"
          >
            Instagram {BUSINESS.instagramHandle}
          </a>
          <Link to="/pannello" className="block text-muted hover:text-fg">
            Pannello tecnico
          </Link>
        </div>
      </div>
      <div className="border-t border-border">
        <p className="mx-auto max-w-6xl px-4 py-4 text-xs text-subtle sm:px-6">
          {BUSINESS.legal} · Andria (BT)
        </p>
      </div>
    </footer>
  );
}
