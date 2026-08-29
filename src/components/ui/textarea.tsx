import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-32 w-full rounded-lg bg-surface-2 px-4 py-3 text-base text-fg shadow-border outline-none transition-[box-shadow] duration-150 placeholder:text-subtle focus-visible:shadow-focus",
        className,
      )}
      {...props}
    />
  );
}
