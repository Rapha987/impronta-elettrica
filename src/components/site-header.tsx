import { Link } from "@tanstack/react-router";
import { Phone } from "lucide-react";
import { Logo } from "@/components/logo";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BUSINESS, isOpenNow } from "@/lib/business";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const open = isOpenNow();

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-bg/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <Logo />
          <Badge tone={open ? "open" : "neutral"} className="hidden sm:inline-flex">
            <span
              className={cn("size-1.5 rounded-full", open ? "bg-open" : "bg-muted")}
            />
            {open ? "Aperto" : "Chiuso"}
          </Badge>
        </div>
        <nav className="flex items-center gap-2">
          <a
            href={`tel:${BUSINESS.phoneTel}`}
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "hidden min-h-11 sm:inline-flex",
            )}
          >
            <Phone className="size-4" />
            {BUSINESS.phoneDisplay}
          </a>
          <Link
            to="/preventivo"
            className={cn(buttonVariants({ variant: "primary", size: "sm" }), "min-h-11")}
          >
            Preventivo
          </Link>
        </nav>
      </div>
    </header>
  );
}
