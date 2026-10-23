"use client";

import { useMemo, useState } from "react";
import { Button } from "./Button";
import { JobRow } from "./JobRow";
import { ListHeader } from "./ListHeader";
import {
  ago,
  arrangementLabels,
  compareNewest,
  emptyFilters,
  experienceBuckets,
  filterJobs,
  locationOptions,
  type Filters,
} from "@/lib/filters";
import type { Job } from "@/lib/jobs";
import { cleanTerm, trackEvent } from "@/lib/analytics";

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
    <label className="relative inline-flex max-w-full">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`h-[45px] max-w-full min-w-0 cursor-pointer appearance-none truncate rounded-control border bg-surface py-3 pr-10 pl-3 text-[13px] hover:border-muted ${
          value ? "border-accent text-text" : "border-border text-text"
        }`}
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
  live,
  fetchedAt,
  totalCount,
  companyCount,
}: {
  jobs: Job[];
  now: number;
  initialQuery?: string;
  live: boolean;
  fetchedAt: string;
  totalCount: number;
  companyCount: number;
}) {
  const [draft, setDraft] = useState(initialQuery);
  const [filters, setFilters] = useState<Filters>({
    ...emptyFilters,
    query: initialQuery,
  });
  const [shown, setShown] = useState(PAGE_SIZE);

  const results = useMemo(
    () => filterJobs(jobs, filters).sort(compareNewest),
    [jobs, filters],
  );
  const locations = useMemo(() => locationOptions(jobs), [jobs]);
  const filtered =
    !!filters.query || !!filters.location || !!filters.arrangement || !!filters.experience;

  const set = (patch: Partial<Filters>) => {
    setShown(PAGE_SIZE);
    setFilters((f) => ({ ...f, ...patch }));
  };
  const setFilter = (key: "location" | "arrangement" | "experience") =>
    (value: string) => {
      if (value) trackEvent("filter_used", { filter: key, value });
      set({ [key]: value });
    };
  const clear = () => {
    setDraft("");
    setShown(PAGE_SIZE);
    setFilters(emptyFilters);
  };

  const scope =
    totalCount > jobs.length
      ? `the newest ${jobs.length} of ${totalCount} technology roles`
      : `${jobs.length} technology ${jobs.length === 1 ? "role" : "roles"}`;
  const boards = `${companyCount} company ${companyCount === 1 ? "board" : "boards"}`;

  return (
    <>
      <section className="flex flex-col gap-3">
        <form
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            set({ query: draft });
            if (draft.trim()) {
              trackEvent("search_submitted", {
                term: cleanTerm(draft),
                from: "jobs",
              });
            }
          }}
          className="flex flex-col gap-3 rounded-xl border border-border bg-surface-2 p-2 focus-within:border-accent sm:flex-row sm:items-center sm:gap-4"
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
        <div className="flex flex-wrap items-center gap-2">
          <FilterSelect
            label="All locations"
            value={filters.location}
            onChange={setFilter("location")}
            options={locations.map((l) => ({ value: l, label: l }))}
          />
          <FilterSelect
            label="Work arrangement"
            value={filters.arrangement}
            onChange={setFilter("arrangement")}
            options={Object.entries(arrangementLabels).map(([value, label]) => ({
              value,
              label,
            }))}
          />
          <FilterSelect
            label="Experience"
            value={filters.experience}
            onChange={setFilter("experience")}
            options={experienceBuckets}
          />
          {filtered && (
            <button
              type="button"
              onClick={clear}
              className="rounded-control px-2 py-2 text-[13px] text-muted underline-offset-4 transition-colors hover:text-text hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      </section>

      <section id="jobs" className="flex scroll-mt-24 flex-col gap-4">
        {!live && (
          <div
            role="alert"
            className="rounded-control border border-accent bg-surface p-4 text-sm"
          >
            <p className="font-semibold text-text">
              Live listings are temporarily unavailable.
            </p>
            <p className="mt-1 text-muted">
              The rows below are examples only — they are not real openings and
              can&apos;t be applied to.{" "}
              <a
                href="/jobs"
                className="text-text underline underline-offset-4 hover:text-accent"
              >
                Reload
              </a>{" "}
              in a few minutes to see real jobs.
            </p>
          </div>
        )}
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <h2 className="flex-1 text-2xl font-semibold">Explore openings</h2>
          <p className="text-[13px] text-muted">Newest first ↓</p>
        </div>
        <p className="text-[13px] text-muted" aria-live="polite">
          {live ? (
            <>
              Showing {scope} from {boards}. Source data refreshed{" "}
              {ago(fetchedAt, now)}.
              {filtered && (
                <>
                  {" "}
                  <span className="text-text">
                    {results.length} {results.length === 1 ? "match" : "matches"}.
                  </span>
                </>
              )}
            </>
          ) : (
            "Example listings"
          )}
        </p>
        {results.length > 0 ? (
          <div className="overflow-hidden rounded-control border border-border">
            <ListHeader />
            <ul>
            {results.slice(0, shown).map((job) => (
              <JobRow key={job.id} job={job} now={now} />
            ))}
            </ul>
          </div>
        ) : (
          <div className="rounded-control border border-border bg-surface p-6 text-sm">
            <p className="font-semibold text-text">
              No openings match these filters.
            </p>
            <p className="mt-1 text-muted">
              Try a broader search or fewer filters.
            </p>
            {filtered && (
              <Button variant="secondary" className="mt-4" onClick={clear}>
                Clear filters
              </Button>
            )}
          </div>
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
      </section>
    </>
  );
}
