"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "./Button";
import { cleanTerm, trackEvent } from "@/lib/analytics";

/** One-click searches that open /jobs already filtered. */
const EXAMPLES: { label: string; href: string }[] = [
  { label: "Remote jobs open to India", href: "/jobs?location=India&arrangement=remote" },
  { label: "Entry-level engineer", href: "/jobs?q=engineer&experience=0-2" },
  { label: "Remote roles in Europe", href: "/jobs?location=Europe&arrangement=remote" },
  { label: "Data & AI jobs", href: "/jobs?category=Data+%26+AI" },
];

export function HeroSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  return (
    <section className="w-full px-8 pt-4 pb-16">
      <div className="mx-auto flex max-w-[620px] flex-col items-center gap-3.5">
        <form
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            const q = query.trim();
            if (q) trackEvent("search_submitted", { term: cleanTerm(q), from: "landing" });
            router.push(q ? `/jobs?q=${encodeURIComponent(q)}` : "/jobs");
          }}
          className="flex w-full gap-2.5 rounded-xl border border-border bg-surface-2 p-2"
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search roles or companies"
            aria-label="Search roles or companies"
            className="min-w-0 flex-1 rounded-lg bg-transparent px-3.5 py-3 text-[15px] text-text"
          />
          <Button type="submit" className="px-[22px]">
            Search jobs
          </Button>
        </form>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="text-[13px] text-muted">Try:</span>
          {EXAMPLES.map((e) => (
            <Link
              key={e.label}
              href={e.href}
              onClick={() => trackEvent("example_search_clicked", { example: e.label })}
              className="rounded-full border border-border bg-surface-2 px-3.5 py-1.5 text-[13px] text-text transition-colors hover:border-accent"
            >
              {e.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
