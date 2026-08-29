import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

function Bolt({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 42 78"
      className={cn("h-10 w-auto text-accent sm:h-11", className)}
      aria-hidden="true"
    >
      <path
        d="M24 3 7 36h14L11 75l26-38H24L32 3Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.4"
        strokeLinejoin="miter"
        strokeLinecap="square"
      />
    </svg>
  );
}

export function Logo({
  className,
  compact = false,
  plate = false,
}: {
  className?: string;
  compact?: boolean;
  plate?: boolean;
}) {
  if (plate) {
    return (
      <Link
        to="/"
        className={cn("inline-flex", className)}
        aria-label="Impronta Elettrica, torna alla home"
      >
        <img
          src="/logo.png"
          alt="Impronta Elettrica — impianti elettrici"
          className="brand size-28 rounded-2xl sm:size-32"
        />
      </Link>
    );
  }

  return (
    <Link
      to="/"
      className={cn("inline-flex items-center gap-2.5 text-fg", className)}
      aria-label="Impronta Elettrica, torna alla home"
    >
      <Bolt />
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className="font-display text-[1.15rem] uppercase tracking-[0.08em]">
            Impronta
          </span>
          <span className="mt-0.5 font-display text-[0.7rem] uppercase tracking-[0.22em] text-accent">
            Elettrica
          </span>
        </span>
      )}
    </Link>
  );
}
