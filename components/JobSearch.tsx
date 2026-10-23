"use client";

import { useMemo, useState } from "react";
import { Button } from "./Button";
import { JobRow } from "./JobRow";
import {
  arrangementLabels,
  emptyFilters,
  experienceBuckets,
  filterJobs,
  locationOptions,
  type Filters,
} from "@/lib/filters";
import type { Job } from "@/lib/jobs";

const PAGE_SIZE = 50;

function FilterSelect({
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
  return (
    <label className="relative inline-flex">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-[45px] cursor-pointer appearance-none rounded-control border border-border bg-surface py-3 pr-10 pl-3 text-[13px] text-text hover:border-muted"
      >
        <option value="">{label}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <span
        aria-hidden
        className="pointer-events-none absolute top-3 right-3 text-[13px] text-muted"
      >
        ⌄
      </span>
    </label>
  );
}

export function JobSearch({
  jobs,
  now,
  initialQuery = "",
  note,
}: {
  jobs: Job[];
  now: number;
  initialQuery?: string;
  note: string;
}) {
  const [draft, setDraft] = useState(initialQuery);
  const [filters, setFilters] = useState<Filters>({
    ...emptyFilters,
    query: initialQuery,
  });

  const results = useMemo(
    () =>
      filterJobs(jobs, filters).sort(
        (a, b) => Date.parse(b.postedAt) - Date.parse(a.postedAt),
      ),
    [jobs, filters],
  );
  const [shown, setShown] = useState(PAGE_SIZE);
  const set = (patch: Partial<Filters>) => {
    setShown(PAGE_SIZE);
    setFilters((f) => ({ ...f, ...patch }));
  };

  return (
    <>
      <section className="flex flex-col gap-3">
        <form
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            set({ query: draft });
          }}
          className="flex flex-col gap-3 rounded-xl border border-border bg-surface-2 p-2 focus-within:border-muted sm:flex-row sm:items-center sm:gap-4"
        >
          <input
            type="search"
            value={draft}
            onChange={(e) => {
              setDraft(e.target.value);
              set({ query: e.target.value });
            }}
            placeholder="Search roles or companies"
            aria-label="Search roles or companies"
            className="min-w-0 flex-1 bg-transparent px-3.5 py-3 text-[15px] text-text focus:outline-none"
          />
          <Button type="submit" className="w-full sm:w-auto">
            Search jobs
          </Button>
        </form>
        <div className="flex flex-wrap gap-2">
          <FilterSelect
            label="All locations"
            value={filters.location}
            onChange={(location) => set({ location })}
            options={locationOptions(jobs).map((l) => ({ value: l, label: l }))}
          />
          <FilterSelect
            label="Work arrangement"
            value={filters.arrangement}
            onChange={(arrangement) => set({ arrangement })}
            options={Object.entries(arrangementLabels).map(([value, label]) => ({
              value,
              label,
            }))}
          />
          <FilterSelect
            label="Experience"
            value={filters.experience}
            onChange={(experience) => set({ experience })}
            options={experienceBuckets}
          />
        </div>
      </section>

      <section id="jobs" className="flex scroll-mt-6 flex-col gap-4">
        <div className="flex items-center gap-4">
          <h2 className="flex-1 text-2xl font-semibold">Explore openings</h2>
          <p className="text-[13px] text-muted">Newest first ↓</p>
        </div>
        {results.length > 0 ? (
          <ul className="overflow-hidden rounded-control border border-border">
            {results.slice(0, shown).map((job) => (
              <JobRow key={job.id} job={job} now={now} />
            ))}
          </ul>
        ) : (
          <p className="rounded-control border border-border bg-surface p-5 text-[13px] text-muted">
            No openings match these filters.
          </p>
        )}
        {results.length > shown && (
          <Button
            variant="secondary"
            className="self-center"
            onClick={() => setShown((n) => n + PAGE_SIZE)}
          >
            Show more ({results.length - shown} remaining)
          </Button>
        )}
        <p className="text-[13px] text-muted">{note}</p>
      </section>
    </>
  );
}
