import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

function Mark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn("size-8", className)}
      aria-hidden="true"
    >
      <rect width="32" height="32" rx="8" fill="currentColor" className="text-fg" />
      <path
        d="M18.2 7.2 11 16.6h5.1l-2.4 8.2 7.6-10.2h-5.2z"
        className="text-bg"
        fill="currentColor"
      />
    </svg>
  );
}

export function Logo({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <Link
      to="/"
      className={cn("inline-flex items-center gap-2.5 text-fg", className)}
      aria-label="Impronta Elettrica, torna alla home"
    >
      <Mark />
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className="font-display text-xl tracking-tight">Impronta</span>
          <span className="mt-0.5 text-xs font-medium uppercase tracking-[0.22em] text-muted">
            Elettrica
          </span>
        </span>
      )}
    </Link>
  );
}
