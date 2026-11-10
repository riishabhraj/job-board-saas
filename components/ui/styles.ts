export const triggerClass = (active: boolean) =>
  `group inline-flex h-[45px] max-w-full min-w-0 cursor-pointer items-center justify-between gap-3 rounded-control border bg-surface py-3 pr-3 pl-3.5 text-[13px] text-text transition-colors hover:border-muted data-[state=open]:border-accent ${
    active ? "border-accent" : "border-border"
  }`;

export const panelClass =
  "z-50 overflow-hidden rounded-xl border border-border bg-surface-2 text-text shadow-[0_16px_48px_rgba(0,0,0,0.55)]";
