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

export function eligibilityLabel(j: Job): string {
  if (j.workArrangement !== "remote") {
    return `${arrangementLabels[j.workArrangement]} — ${j.city}`;
  }
  return j.eligibility === "Worldwide"
    ? "Remote — Worldwide"
    : `Remote — ${j.eligibility} eligible`;
}

export function experienceLabel(j: Job): string {
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
