import type { Job, WorkArrangement } from "./jobs";

export interface ExperienceBucket {
  value: string;
  label: string;
  min: number;
  max: number;
}

export const experienceBuckets: ExperienceBucket[] = [
  { value: "0-2", label: "0–2 years", min: 0, max: 2 },
  { value: "3-5", label: "3–5 years", min: 3, max: 5 },
  { value: "6+", label: "6+ years", min: 6, max: Infinity },
];

/** Arrangements a user can filter by. "unspecified" is deliberately absent. */
export const arrangementLabels: Record<
  Exclude<WorkArrangement, "unspecified">,
  string
> = {
  remote: "Remote",
  hybrid: "Hybrid",
  "on-site": "On-site",
};

export interface Filters {
  query: string;
  location: string;
  arrangement: string;
  experience: string;
}

export const emptyFilters: Filters = {
  query: "",
  location: "",
  arrangement: "",
  experience: "",
};

export interface LocationOption {
  value: string;
  label: string;
  count: number;
}

/** Every country that appears in the feed, most jobs first. */
export function locationOptions(jobs: Job[]): LocationOption[] {
  const counts = new Map<string, number>();
  for (const j of jobs) {
    for (const c of j.countries) counts.set(c, (counts.get(c) ?? 0) + 1);
  }
  return [...counts]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([value, count]) => ({ value, label: value, count }));
}

export function filterJobs(jobs: Job[], f: Filters): Job[] {
  const q = f.query.trim().toLowerCase();
  const bucket = experienceBuckets.find((b) => b.value === f.experience);

  return jobs.filter((j) => {
    if (q) {
      const haystack = [j.company, j.title, j.city ?? "", ...j.skills]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    if (f.location) {
      // Worldwide-remote roles are open to candidates anywhere.
      const open = j.workArrangement === "remote" && j.eligibility === "Worldwide";
      if (!open && !j.countries.includes(f.location)) return false;
    }
    if (f.arrangement && j.workArrangement !== f.arrangement) return false;
    if (bucket) {
      // Postings that do not state experience cannot match an experience filter.
      if (j.minYears === null) return false;
      const max = j.maxYears ?? Infinity;
      if (max < bucket.min || j.minYears > bucket.max) return false;
    }
    return true;
  });
}

export function eligibilityLabel(j: Job): string {
  if (j.workArrangement === "remote") {
    if (j.eligibility === "Worldwide") return "Remote — Worldwide";
    if (j.eligibility === "Unspecified") {
      return "Remote — location not specified";
    }
    return `Remote — ${j.eligibility} eligible`;
  }
  const place = j.city ?? "Location not listed";
  if (j.workArrangement === "unspecified") return place;
  const kind = arrangementLabels[j.workArrangement];
  return j.city ? `${kind} — ${j.city}` : `${kind} — location not listed`;
}

export function experienceLabel(j: Job): string {
  if (j.minYears === null) return "Experience not stated";
  if (j.maxYears === null) return `${j.minYears}+ yrs`;
  if (j.maxYears === j.minYears) return `${j.minYears} yrs`;
  return `${j.minYears}–${j.maxYears} yrs`;
}

/** "17m ago", "2h ago", "3d ago". */
export function ago(iso: string, now: number): string {
  const minutes = Math.max(0, Math.floor((now - Date.parse(iso)) / 60_000));
  if (minutes < 1) return "<1m ago";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

/**
 * What the company told us about the posting date. Never our own discovery
 * time: "Posted" is the company's publish date, "Updated" is its last edit.
 */
export function dateLabel(j: Job, now: number): string {
  if (j.postedAt) return `Posted ${ago(j.postedAt, now)}`;
  if (j.updatedAt) return `Updated ${ago(j.updatedAt, now)}`;
  return "Posting date not listed";
}

/** Newest first; postings with no date from the company sort last. */
export function compareNewest(a: Job, b: Job): number {
  const t = (j: Job) => Date.parse(j.postedAt ?? j.updatedAt ?? "") || 0;
  return t(b) - t(a);
}

/**
 * A few of the newest real listings for the landing page: one per company
 * (so it does not look like one board), and only ones whose location and
 * posting date are known, so the preview shows the product at its clearest.
 */
export function pickHighlights(jobs: Job[], n: number): Job[] {
  const seen = new Set<string>();
  const picks: Job[] = [];
  for (const j of [...jobs].sort(compareNewest)) {
    if (picks.length === n) break;
    if (j.isExample || !j.postedAt) continue;
    if (j.eligibility === "Unspecified" || seen.has(j.company)) continue;
    seen.add(j.company);
    picks.push(j);
  }
  return picks;
}
