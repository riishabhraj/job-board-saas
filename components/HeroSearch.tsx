"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "./Button";

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
        <p className="text-[13px] text-faint">
          Indexing from Greenhouse · Lever · Ashby · direct career pages
        </p>
      </div>
    </section>
  );
}
