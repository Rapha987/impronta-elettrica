import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/logo";
import { QuoteWizard } from "@/components/quote-wizard";

export const Route = createFileRoute("/preventivo")({
  component: PreventivoPage,
  head: () => ({
    meta: [{ title: "Chiedi un preventivo · Impronta Elettrica" }],
  }),
});

function PreventivoPage() {
  return (
    <div className="min-h-dvh bg-bg text-fg">
      <header className="mx-auto flex max-w-xl items-center justify-between px-4 py-5 sm:px-6">
        <Logo compact />
        <Link
          to="/"
          className="inline-flex min-h-11 items-center gap-2 text-sm text-muted hover:text-fg"
        >
          <ArrowLeft className="size-4" />
          Home
        </Link>
      </header>
      <main className="px-4 pb-16 sm:px-6">
        <QuoteWizard />
      </main>
    </div>
  );
}
