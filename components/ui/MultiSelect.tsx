"use client";

import * as Popover from "@radix-ui/react-popover";
import { Command } from "cmdk";
import { useState, type ReactNode } from "react";
import { Check, ChevronDown, SearchIcon } from "./icons";
import { panelClass, triggerClass } from "./styles";

export interface MultiOption {
  value: string;
  label: string;
  count?: number;
  /** Small leading mark, e.g. a flag. */
  icon?: ReactNode;
}
export interface MultiGroup {
  heading?: string;
  options: MultiOption[];
}

/** Prefix matches rank first, then plain substrings. No "letters in order" fuzz. */
function matchLabel(value: string, search: string): number {
  const v = value.toLowerCase();
  const q = search.trim().toLowerCase();
  if (!q) return 1;
  if (v.startsWith(q)) return 1;
  return v.split(/[\s-]+/).some((w) => w.startsWith(q)) ? 0.8 : v.includes(q) ? 0.5 : 0;
}

const itemClass =
  "flex cursor-pointer items-center gap-3 rounded-lg px-2.5 py-2 text-[13px] outline-none select-none data-[selected=true]:bg-subtle";

/** Checkbox dropdown: pick any number of options; the panel stays open. */
export function MultiSelect({
  label,
  values,
  onChange,
  groups,
  searchPlaceholder,
}: {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  groups: MultiGroup[];
  /** Shows a search box when set. */
  searchPlaceholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const all = groups.flatMap((g) => g.options);
  const toggle = (v: string) =>
    onChange(values.includes(v) ? values.filter((x) => x !== v) : [...values, v]);

  const summary =
    values.length === 0
      ? label
      : values.length === 1
        ? (all.find((o) => o.value === values[0])?.label ?? values[0])
        : `${label} · ${values.length}`;

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger
        aria-label={label}
        aria-expanded={open}
        className={triggerClass(values.length > 0)}
        data-state={open ? "open" : "closed"}
      >
        <span className="truncate">{summary}</span>
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
          <Command loop filter={matchLabel}>
            {searchPlaceholder && (
              <div className="flex items-center gap-2 border-b border-border px-3">
                <SearchIcon className="shrink-0 text-muted" />
                <Command.Input
                  placeholder={searchPlaceholder}
                  aria-label={searchPlaceholder}
                  className="h-11 w-full bg-transparent text-[13px] text-text placeholder:text-muted focus:outline-none"
                />
              </div>
            )}
            <Command.List
              aria-multiselectable
              className="max-h-[300px] overflow-y-auto p-1.5"
            >
              <Command.Empty className="px-3 py-6 text-center text-[13px] text-muted">
                No matches.
              </Command.Empty>
              {groups.map((g, i) => (
                <Command.Group
                  key={g.heading ?? i}
                  heading={g.heading}
                  className="[&_[cmdk-group-heading]]:px-2.5 [&_[cmdk-group-heading]]:pt-2.5 [&_[cmdk-group-heading]]:pb-1 [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:tracking-[0.06em] [&_[cmdk-group-heading]]:text-faint [&_[cmdk-group-heading]]:uppercase"
                >
                  {g.options.map((o) => {
                    const checked = values.includes(o.value);
                    return (
                      <Command.Item
                        key={o.value}
                        value={o.label}
                        onSelect={() => toggle(o.value)}
                        className={itemClass}
                      >
                        <span
                          aria-hidden
                          className={`flex size-4 shrink-0 items-center justify-center rounded border transition-colors ${
                            checked
                              ? "border-accent bg-accent text-bg"
                              : "border-border bg-surface"
                          }`}
                        >
                          {checked && <Check className="size-3" />}
                        </span>
                        {o.icon && <span aria-hidden className="shrink-0 text-base leading-none">{o.icon}</span>}
                        <span className="min-w-0 flex-1 truncate">{o.label}</span>
                        {o.count !== undefined && (
                          <span className="shrink-0 text-xs text-muted tabular-nums">
                            {o.count}
                          </span>
                        )}
                        {checked && <span className="sr-only">selected</span>}
                      </Command.Item>
                    );
                  })}
                </Command.Group>
              ))}
            </Command.List>
            {values.length > 0 && (
              <div className="border-t border-border p-1.5">
                <button
                  type="button"
                  onClick={() => onChange([])}
                  className="w-full rounded-lg px-2.5 py-2 text-left text-[13px] text-muted transition-colors hover:bg-subtle hover:text-text"
                >
                  Clear {label.toLowerCase()}
                </button>
              </div>
            )}
          </Command>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
