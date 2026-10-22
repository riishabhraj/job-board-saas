import type { ComponentProps } from "react";

type Variant = "primary" | "light" | "secondary";

const base =
  "inline-flex h-10 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-control px-5 text-sm font-semibold transition-opacity";

const variants: Record<Variant, string> = {
  primary: "bg-accent text-on-accent hover:opacity-90",
  light: "bg-text text-bg hover:opacity-90",
  secondary:
    "border border-border bg-surface font-medium text-text transition-colors hover:border-muted",
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
    <button className={`${buttonClass(variant)} ${className}`} {...props} />
  );
}
