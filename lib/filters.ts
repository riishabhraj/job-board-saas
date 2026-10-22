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

/** Locations offered in the filter: every eligibility region except Worldwide. */
export function locationOptions(jobs: Job[]): string[] {
  return [
    ...new Set(
      jobs.map((j) => j.eligibility).filter((e) => e !== "Worldwide"),
    ),
  ].sort();
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
    if (bucket && (j.maxYears < bucket.min || j.minYears > bucket.max)) {
      return false;
    }
    return true;
  });
}

export function locationLabel(j: Job): string {
  return j.workArrangement === "remote"
    ? `Remote · ${j.eligibility}`
    : `${j.city} · ${arrangementLabels[j.workArrangement]}`;
}

export function experienceLabel(j: Job): string {
  return `${j.minYears}–${j.maxYears} years`;
}

export function freshnessLabel(discoveredAt: string, now: number): string {
  const hours = Math.floor((now - Date.parse(discoveredAt)) / 3_600_000);
  if (hours < 1) return "First found just now";
  if (hours < 24) return `First found ${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `First found ${days}d ago`;
}
