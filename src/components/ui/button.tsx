import type { ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-[transform,background-color,color,box-shadow,opacity] duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:pointer-events-none disabled:opacity-40 active:not-disabled:scale-[0.96]",
  {
    variants: {
      variant: {
        primary:
          "bg-fg text-bg shadow-[0_0_0_1px_rgba(243,240,232,0.08)] hover:bg-accent",
        secondary:
          "bg-surface-2 text-fg shadow-[0_0_0_1px_rgba(243,240,232,0.1)] hover:bg-surface",
        ghost: "bg-transparent text-fg hover:bg-surface-2",
        whatsapp: "bg-whatsapp text-fg hover:bg-whatsapp-hover",
        outline:
          "bg-transparent text-fg shadow-[0_0_0_1px_rgba(243,240,232,0.16)] hover:bg-surface-2",
      },
      size: {
        sm: "h-10 rounded-md px-3.5 text-sm",
        md: "h-12 rounded-lg px-5 text-sm",
        lg: "h-14 rounded-xl px-6 text-base",
        icon: "size-12 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export function Button({ className, variant, size, type = "button", ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { buttonVariants };
