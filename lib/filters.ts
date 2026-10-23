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

export const arrangementLabels: Record<WorkArrangement, string> = {
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

/**
 * Locations offered in the filter: the most common eligibility values,
 * excluding Worldwide (always matched) and Unspecified.
 */
export function locationOptions(jobs: Job[], limit = 15): string[] {
  const counts = new Map<string, number>();
  for (const j of jobs) {
    if (j.eligibility === "Worldwide" || j.eligibility === "Unspecified") {
      continue;
    }
    counts.set(j.eligibility, (counts.get(j.eligibility) ?? 0) + 1);
  }
  return [...counts]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([name]) => name)
    .sort();
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
      if (!open && j.eligibility !== f.location) return false;
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
  if (j.workArrangement !== "remote") {
    return `${arrangementLabels[j.workArrangement]} — ${j.city}`;
  }
  if (j.eligibility === "Worldwide") return "Remote — Worldwide";
  if (j.eligibility === "Unspecified") return "Remote — location not specified";
  return `Remote — ${j.eligibility} eligible`;
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
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}
