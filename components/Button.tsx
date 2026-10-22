import type { ComponentProps } from "react";

type Variant = "primary" | "secondary";

const base =
  "inline-flex h-10 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-control px-4 text-sm font-medium transition-colors";

const variants: Record<Variant, string> = {
  primary: "bg-accent text-on-accent hover:bg-accent/85",
  secondary:
    "border border-border bg-surface text-text hover:border-muted",
};

export function buttonClass(variant: Variant = "primary") {
  return `${base} ${variants[variant]}`;
}

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ComponentProps<"button"> & { variant?: Variant }) {
  return (
    <button
      className={`${buttonClass(variant)} ${className}`}
      {...props}
    />
  );
}
