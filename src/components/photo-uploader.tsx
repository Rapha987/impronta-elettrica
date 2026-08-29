import { useRef, useState } from "react";
import { Camera, ImagePlus, X } from "lucide-react";
import { compressImage, isAllowedImage } from "@/lib/compress-image";
import { cn } from "@/lib/utils";

const MAX_PHOTOS = 5;

export function PhotoUploader({
  photos,
  onChange,
}: {
  photos: string[];
  onChange: (photos: string[]) => void;
}) {
  const cameraRef = useRef<HTMLInputElement>(null);
  const libraryRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function addFiles(files: FileList | null) {
    if (!files?.length) return;
    setError(null);
    const remaining = MAX_PHOTOS - photos.length;
    if (remaining <= 0) {
      setError("Puoi caricare al massimo 5 foto.");
      return;
    }
    const next = [...photos];
    setBusy(true);
    try {
      for (const file of Array.from(files).slice(0, remaining)) {
        if (!isAllowedImage(file)) {
          setError("Usa una foto scattata o dalla galleria.");
          continue;
        }
        next.push(await compressImage(file));
      }
      onChange(next);
    } catch {
      setError("Non sono riuscito a leggere una foto. Riprova.");
    } finally {
      setBusy(false);
    }
  }

  function removeAt(index: number) {
    onChange(photos.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {photos.map((src, index) => (
          <div
            key={`${src.slice(0, 24)}-${index}`}
            className="relative aspect-[4/3] overflow-hidden rounded-xl bg-surface-2"
          >
            <img
              src={src}
              alt={`Foto del lavoro ${index + 1}`}
              className="size-full object-cover"
            />
            <button
              type="button"
              onClick={() => removeAt(index)}
              className="absolute top-2 right-2 grid size-9 place-items-center rounded-full bg-bg/85 text-fg"
              aria-label={`Rimuovi foto ${index + 1}`}
            >
              <X className="size-4" />
            </button>
          </div>
        ))}
        {photos.length < MAX_PHOTOS && (
          <button
            type="button"
            onClick={() => libraryRef.current?.click()}
            disabled={busy}
            className={cn(
              "flex aspect-[4/3] flex-col items-center justify-center gap-2 rounded-xl bg-surface-2 text-sm text-muted shadow-border transition-colors hover:bg-surface hover:text-fg",
            )}
          >
            <ImagePlus className="size-6" />
            {busy ? "Caricamento…" : "Aggiungi foto"}
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => cameraRef.current?.click()}
          className="flex min-h-12 items-center justify-center gap-2 rounded-lg bg-surface-2 text-sm font-medium shadow-border"
        >
          <Camera className="size-4" />
          Scatta
        </button>
        <button
          type="button"
          onClick={() => libraryRef.current?.click()}
          className="flex min-h-12 items-center justify-center gap-2 rounded-lg bg-surface-2 text-sm font-medium shadow-border"
        >
          <ImagePlus className="size-4" />
          Galleria
        </button>
      </div>

      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="sr-only"
        onChange={(event) => {
          void addFiles(event.target.files);
          event.target.value = "";
        }}
      />
      <input
        ref={libraryRef}
        type="file"
        accept="image/*"
        multiple
        className="sr-only"
        onChange={(event) => {
          void addFiles(event.target.files);
          event.target.value = "";
        }}
      />

      <p className="text-xs text-subtle">
        {photos.length}/{MAX_PHOTOS} foto · il quadro, il soffitto o il punto da
        sistemare vanno benissimo.
      </p>
      {error && <p className="text-sm text-danger">{error}</p>}
    </div>
  );
}
