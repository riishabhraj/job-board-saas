"use client";

import * as RadixSelect from "@radix-ui/react-select";
import { Check, ChevronDown } from "./icons";

const ALL = "__all__";

export const triggerClass = (active: boolean) =>
  `group inline-flex h-[45px] max-w-full min-w-0 cursor-pointer items-center justify-between gap-3 rounded-control border bg-surface py-3 pr-3 pl-3.5 text-[13px] text-text transition-colors hover:border-muted data-[state=open]:border-accent ${
    active ? "border-accent" : "border-border"
  }`;

export const panelClass =
  "z-50 overflow-hidden rounded-xl border border-border bg-surface-2 text-text shadow-[0_16px_48px_rgba(0,0,0,0.55)]";

export const itemClass =
  "relative flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 pl-8 text-[13px] outline-none select-none data-[highlighted]:bg-subtle data-[selected=true]:bg-subtle";

/** Single-choice filter. `value` is "" when nothing is chosen. */
export function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  const selected = options.find((o) => o.value === value);

  return (
    <RadixSelect.Root
      value={value || ALL}
      onValueChange={(v) => onChange(v === ALL ? "" : v)}
    >
      <RadixSelect.Trigger aria-label={label} className={triggerClass(!!value)}>
        <RadixSelect.Value>{selected ? selected.label : label}</RadixSelect.Value>
        <RadixSelect.Icon>
          <ChevronDown className="text-muted transition-transform group-data-[state=open]:rotate-180" />
        </RadixSelect.Icon>
      </RadixSelect.Trigger>
      <RadixSelect.Portal>
        <RadixSelect.Content
          position="popper"
          sideOffset={6}
          align="start"
          className={`${panelClass} min-w-[var(--radix-select-trigger-width)] max-h-[min(320px,var(--radix-select-content-available-height))]`}
        >
          <RadixSelect.Viewport className="p-1.5">
            <RadixSelect.Item value={ALL} className={itemClass}>
              <RadixSelect.ItemIndicator className="absolute left-2.5 text-accent">
                <Check />
              </RadixSelect.ItemIndicator>
              <RadixSelect.ItemText>{label}</RadixSelect.ItemText>
            </RadixSelect.Item>
            {options.map((o) => (
              <RadixSelect.Item key={o.value} value={o.value} className={itemClass}>
                <RadixSelect.ItemIndicator className="absolute left-2.5 text-accent">
                  <Check />
                </RadixSelect.ItemIndicator>
                <RadixSelect.ItemText>{o.label}</RadixSelect.ItemText>
              </RadixSelect.Item>
            ))}
          </RadixSelect.Viewport>
        </RadixSelect.Content>
      </RadixSelect.Portal>
    </RadixSelect.Root>
  );
}
