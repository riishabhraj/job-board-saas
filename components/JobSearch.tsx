"use client";

import { useMemo, useState } from "react";
import { Button } from "./Button";
import { JobRow } from "./JobRow";
import { ListHeader } from "./ListHeader";
import { MultiSelect } from "./ui/MultiSelect";
import { SearchIcon } from "./ui/icons";
import {
  ago,
  arrangementOptions,
  categoryOptions,
  compareNewest,
  emptyFilters,
  experienceOptions,
  filterJobs,
  hasExperienceSignal,
  locationOptions,
  regionCounts,
  relaxations,
  skillOptions,
  type Filters,
  type Relaxation,
} from "@/lib/filters";
import { flagEmoji } from "@/lib/geo";
import type { Job } from "@/lib/jobs";
import { cleanTerm, trackEvent } from "@/lib/analytics";

const PAGE_SIZE = 50;
const REGION_ICON: Record<string, string> = {
  Anywhere: "🌐",
  "North America": "🌎",
  Europe: "🌍",
  "Latin America": "🌎",
  APAC: "🌏",
};

type GroupKey = Exclude<keyof Filters, "terms">;
/** Names recorded in analytics for each filter. */
const EVENT_NAME: Record<GroupKey, string> = {
  locations: "location",
  categories: "category",
  skills: "skill",
  arrangements: "arrangement",
  experiences: "experience",
};

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
  const [filters, setFilters] = useState<Filters>({
    ...emptyFilters,
    terms: initialQuery.trim() ? [initialQuery.trim()] : [],
  });
  const [draft, setDraft] = useState("");
  const [shown, setShown] = useState(PAGE_SIZE);

  // Typing does not touch the list: only a committed tag (Enter) filters.
  const effective = filters;

  const results = useMemo(
    () =>
      filterJobs(jobs, effective).sort((a, b) =>
        // With an experience filter on, roles that point at that level come
        // before ones that merely do not rule it out.
        effective.experiences.length > 0
          ? Number(hasExperienceSignal(b)) - Number(hasExperienceSignal(a)) ||
            compareNewest(a, b)
          : compareNewest(a, b),
      ),
    [jobs, effective],
  );

  const options = useMemo(
    () => ({
      regions: regionCounts(jobs),
      countries: locationOptions(jobs),
      categories: categoryOptions(jobs),
      skills: skillOptions(jobs),
      arrangements: arrangementOptions(jobs),
      experiences: experienceOptions(jobs),
    }),
    [jobs],
  );

  const filtered =
    effective.terms.length > 0 ||
    (Object.keys(EVENT_NAME) as GroupKey[]).some((k) => effective[k].length > 0);

  // When few roles match, say which single filter or tag would show more.
  const thin = filtered && results.length < 5;
  const relax = useMemo(
    () => (thin ? relaxations(jobs, effective) : []),
    [thin, jobs, effective],
  );

  const resetPaging = () => setShown(PAGE_SIZE);
  const addTag = () => {
    const t = draft.trim();
    if (!t) return;
    setDraft("");
    resetPaging();
    if (filters.terms.some((x) => x.toLowerCase() === t.toLowerCase())) return;
    setFilters((f) => ({ ...f, terms: [...f.terms, t] }));
    trackEvent("search_submitted", { term: cleanTerm(t), from: "jobs" });
  };
  const removeTag = (term: string) => {
    resetPaging();
    setFilters((f) => ({ ...f, terms: f.terms.filter((t) => t !== term) }));
  };
  const setGroup = (key: GroupKey) => (values: string[]) => {
    resetPaging();
    for (const v of values) {
      if (!filters[key].includes(v)) trackEvent("filter_used", { filter: EVENT_NAME[key], value: v });
    }
    setFilters((f) => ({ ...f, [key]: values }));
  };
  const drop = (r: Relaxation) => {
    if (r.key === "terms") {
      removeTag(r.term ?? "");
    } else {
      setGroup(r.key)([]);
    }
  };
  const clear = () => {
    setDraft("");
    resetPaging();
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
            addTag();
          }}
          className="flex items-center gap-3 rounded-xl border border-border bg-surface-2 px-4 focus-within:border-accent"
        >
          <SearchIcon className="shrink-0 text-muted" />
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              // Backspace in an empty box takes the last tag back out.
              if (e.key === "Backspace" && !draft && filters.terms.length > 0) {
                removeTag(filters.terms[filters.terms.length - 1]);
              }
            }}
            placeholder="Search roles, skills or companies"
            aria-label="Search roles, skills or companies"
            enterKeyHint="search"
            autoComplete="off"
            className="min-w-0 flex-1 bg-transparent py-4 text-[15px] text-text focus:outline-none"
          />
          {draft.trim() && (
            <span
              aria-hidden
              className="hidden shrink-0 rounded-md border border-border px-2 py-1 text-[11px] text-muted sm:block"
            >
              Press Enter to search
            </span>
          )}
        </form>

        {filters.terms.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold tracking-[0.06em] text-faint uppercase">
              Search tags
            </span>
            {filters.terms.map((t) => (
              <span
                key={t}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-2 py-1.5 pr-2 pl-3.5 text-[13px] text-text"
              >
                {t}
                <button
                  type="button"
                  onClick={() => removeTag(t)}
                  aria-label={`Remove ${t}`}
                  className="flex size-5 items-center justify-center rounded-full text-muted transition-colors hover:bg-subtle hover:text-text"
                >
                  <svg aria-hidden viewBox="0 0 12 12" width="10" height="10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                    <path d="m2.5 2.5 7 7m0-7-7 7" />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2">
          <MultiSelect
            label="Location"
            values={filters.locations}
            onChange={setGroup("locations")}
            searchPlaceholder="Search locations…"
            groups={[
              {
                heading: "Regions",
                options: options.regions.map((r) => ({ ...r, icon: REGION_ICON[r.value] })),
              },
              {
                heading: "Countries",
                options: options.countries.map((c) => ({ ...c, icon: flagEmoji(c.value) ?? "🏳️" })),
              },
            ]}
          />
          <MultiSelect
            label="Category"
            values={filters.categories}
            onChange={setGroup("categories")}
            searchPlaceholder="Search categories…"
            groups={[{ options: options.categories }]}
          />
          <MultiSelect
            label="Skill"
            values={filters.skills}
            onChange={setGroup("skills")}
            searchPlaceholder="Search skills…"
            groups={[{ options: options.skills }]}
          />
          <MultiSelect
            label="Work arrangement"
            values={filters.arrangements}
            onChange={setGroup("arrangements")}
            groups={[{ options: options.arrangements }]}
          />
          <MultiSelect
            label="Experience"
            values={filters.experiences}
            onChange={setGroup("experiences")}
            groups={[{ options: options.experiences }]}
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
              Showing {scope} from {boards}. Updated{" "}
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
        {thin && relax.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 text-[13px] text-muted">
            <span>
              {results.length === 0
                ? "No matches."
                : `Only ${results.length} ${results.length === 1 ? "match" : "matches"}.`}{" "}
              See more by removing:
            </span>
            {relax.map((r) => (
              <button
                key={`${r.key}-${r.term ?? ''}`}
                type="button"
                onClick={() => drop(r)}
                className="rounded-control border border-border bg-surface-2 px-2.5 py-1 text-text transition-colors hover:border-accent"
              >
                {r.label} <span className="text-muted">→ {r.count} roles</span>
              </button>
            ))}
          </div>
        )}
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
              Try a broader search or fewer filters. We list technology roles
              only — engineering, data, security, product and design.
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
