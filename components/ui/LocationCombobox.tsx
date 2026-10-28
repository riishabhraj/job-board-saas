"use client";

import * as Popover from "@radix-ui/react-popover";
import { Command } from "cmdk";
import { useState } from "react";
import { Check, ChevronDown, SearchIcon } from "./icons";
import { itemClass, panelClass, triggerClass } from "./Select";
import type { LocationOption } from "@/lib/filters";

/** Prefix matches rank first, then plain substrings. No "letters in order" fuzz. */
function matchCountry(value: string, search: string): number {
  const v = value.toLowerCase();
  const q = search.trim().toLowerCase();
  if (!q) return 1;
  if (v.startsWith(q)) return 1;
  return v.split(/[\s-]+/).some((w) => w.startsWith(q)) ? 0.8 : v.includes(q) ? 0.5 : 0;
}

/** Searchable country picker, since the feed spans dozens of countries. */
export function LocationCombobox({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: LocationOption[];
}) {
  const [open, setOpen] = useState(false);
  const pick = (v: string) => {
    onChange(v);
    setOpen(false);
  };

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger
        aria-label={label}
        role="combobox"
        aria-expanded={open}
        className={triggerClass(!!value)}
        data-state={open ? "open" : "closed"}
      >
        <span className="truncate">{value || label}</span>
        <ChevronDown
          className={`shrink-0 text-muted transition-transform ${open ? "rotate-180" : ""}`}
        />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={6}
          className={`${panelClass} w-[min(320px,calc(100vw-2rem))]`}
          onOpenAutoFocus={(e) => {
            // cmdk focuses its input; keep Radix from stealing focus first.
            e.preventDefault();
            (e.currentTarget as HTMLElement)
              .querySelector<HTMLInputElement>("[cmdk-input]")
              ?.focus();
          }}
        >
          <Command loop filter={matchCountry}>
            <div className="flex items-center gap-2 border-b border-border px-3">
              <SearchIcon className="shrink-0 text-muted" />
              <Command.Input
                placeholder="Search countries…"
                aria-label="Search countries"
                className="h-11 w-full bg-transparent text-[13px] text-text placeholder:text-muted focus:outline-none"
              />
            </div>
            <Command.List className="max-h-[280px] overflow-y-auto p-1.5">
              <Command.Empty className="px-3 py-6 text-center text-[13px] text-muted">
                No matching country.
              </Command.Empty>
              <Command.Item
                value="all locations"
                onSelect={() => pick("")}
                className={itemClass}
              >
                {!value && <Check className="absolute left-2.5 text-accent" />}
                <span>{label}</span>
              </Command.Item>
              {options.map((o) => (
                <Command.Item
                  key={o.value}
                  value={o.label}
                  onSelect={() => pick(o.value)}
                  className={`${itemClass} justify-between`}
                >
                  {value === o.value && (
                    <Check className="absolute left-2.5 text-accent" />
                  )}
                  <span className="truncate">{o.label}</span>
                  <span className="shrink-0 text-xs text-muted tabular-nums">
                    {o.count}
                  </span>
                </Command.Item>
              ))}
            </Command.List>
          </Command>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
