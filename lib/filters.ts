import { locationCountries, REGIONS } from "./geo";
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

/**
 * Every filter is a list: within one filter any selection matches (Remote OR
 * Hybrid), across filters all must match. Search terms are tags that must all
 * match, so each one narrows the list.
 */
export interface Filters {
  terms: string[];
  locations: string[];
  categories: string[];
  skills: string[];
  arrangements: string[];
  experiences: string[];
}

export const emptyFilters: Filters = {
  terms: [],
  locations: [],
  categories: [],
  skills: [],
  arrangements: [],
  experiences: [],
};

const GROUP_PARAM = {
  locations: "location",
  categories: "category",
  skills: "skill",
  arrangements: "arrangement",
  experiences: "experience",
} as const;

/** Trims stray punctuation and spaces from a search tag ("platfpr," -> "platfpr"). */
export function cleanTag(raw: string): string {
  return raw
    .replace(/^[^\p{L}\p{N}.]+|[^\p{L}\p{N}+#]+$/gu, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 60);
}

type Params = Record<string, string | string[] | undefined>;
const all = (v: string | string[] | undefined) => (Array.isArray(v) ? v : v === undefined ? [] : [v]);

/**
 * Filters from a /jobs link: ?q=engineer&q=python&location=India,Europe&
 * arrangement=remote&experience=0-2. Unknown params are ignored; the page
 * drops values that are not real options (see pruneFilters).
 */
export function filtersFromParams(params: Params): Filters {
  const list = (key: string) =>
    all(params[key])
      .flatMap((v) => v.split(","))
      .map((v) => v.trim())
      .filter(Boolean)
      .slice(0, 12);
  const terms = all(params.q).map(cleanTag).filter(Boolean).slice(0, 8);
  const out: Filters = { ...emptyFilters, terms: [...new Set(terms)] };
  for (const [group, param] of Object.entries(GROUP_PARAM)) {
    out[group as keyof typeof GROUP_PARAM] = [...new Set(list(param))];
  }
  return out;
}

/** The query string for a set of filters, so a search can be shared. */
export function filtersToParams(f: Filters): URLSearchParams {
  const qs = new URLSearchParams();
  f.terms.forEach((t) => qs.append("q", t));
  for (const [group, param] of Object.entries(GROUP_PARAM)) {
    const values = f[group as keyof typeof GROUP_PARAM];
    if (values.length > 0) qs.set(param, values.join(","));
  }
  return qs;
}

export interface FilterOption {
  value: string;
  label: string;
  count: number;
}
export type LocationOption = FilterOption;

/** Region choices above the country list. "Anywhere" is worldwide-remote only. */
export const regionOptions: { value: string; label: string }[] = [
  { value: "Anywhere", label: "Anywhere" },
  { value: "North America", label: "North America" },
  { value: "Europe", label: "Europe" },
  { value: "Latin America", label: "Latin America" },
  { value: "APAC", label: "Asia-Pacific" },
];

const isWorldwide = (j: Job) =>
  j.workArrangement === "remote" && j.eligibility === "Worldwide";

/**
 * Open to someone in the selected places. Worldwide-remote roles are open to
 * candidates anywhere, so they match any location choice.
 */
export function matchesLocation(j: Job, selected: string[]): boolean {
  if (selected.length === 0 || isWorldwide(j)) return true;
  return selected.some((v) => {
    if (v === "Anywhere") return false;
    const region = REGIONS[v];
    return region ? j.countries.some((c) => region.includes(c)) : j.countries.includes(v);
  });
}

// First match wins, so specific kinds come before the broad ones.
const CATEGORY_RULES: [string, RegExp][] = [
  ["Security", /security|appsec|infosec|cyber/i],
  ["Design", /design|\bux\b|\bui\b/i],
  ["Product & Program", /product manager|product management|program manager|\bpm\b/i],
  ["Solutions & Support", /solutions?\b|support|customer engineer|sales engineer|forward[- ]deployed|developer advocate|devrel|developer relations/i],
  ["Data & AI", /\bdata\b|machine learning|\bml\b|\bai\b|scientist|analytics|research/i],
  ["DevOps & Infrastructure", /devops|\bsre\b|site reliability|infrastructure|platform|cloud|reliability|network/i],
  ["QA & Testing", /\bqa\b|quality|\btest(?:ing)?\b|sdet/i],
];

export function categoryFromTitle(title: string): string {
  return CATEGORY_RULES.find(([, re]) => re.test(title))?.[0] ?? "Engineering";
}

/** Short forms job seekers type, mapped to how companies write the title. */
const SYNONYMS: Record<string, string[]> = {
  sde: ["software development engineer", "software engineer"],
  "sde 1": ["software development engineer", "software engineer"],
  sde1: ["software development engineer", "software engineer"],
  "sde-1": ["software development engineer", "software engineer"],
  swe: ["software engineer"],
  pm: ["product manager"],
  apm: ["associate product manager"],
  ml: ["machine learning"],
  sre: ["site reliability"],
  qa: ["quality"],
  fullstack: ["full stack", "full-stack"],
  "full stack": ["full-stack", "fullstack"],
};

function matchesTerm(haystack: string, term: string): boolean {
  const t = term.trim().toLowerCase();
  if (!t) return true;
  return [t, ...(SYNONYMS[t] ?? [])].some((alt) => haystack.includes(alt));
}

const countBy = (jobs: Job[], keys: (j: Job) => string[]): FilterOption[] => {
  const counts = new Map<string, number>();
  for (const j of jobs) for (const k of new Set(keys(j))) counts.set(k, (counts.get(k) ?? 0) + 1);
  return [...counts]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([value, count]) => ({ value, label: value, count }));
};

/** Every country that appears in the feed, with the roles open to someone there. */
export function locationOptions(jobs: Job[]): FilterOption[] {
  const seen = new Set<string>();
  for (const j of jobs) for (const c of j.countries) seen.add(c);
  return [...seen]
    .map((value) => ({ value, label: value, count: jobs.filter((j) => matchesLocation(j, [value])).length }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}

export function regionCounts(jobs: Job[]): FilterOption[] {
  return regionOptions.map((r) => ({
    ...r,
    count: jobs.filter((j) => matchesLocation(j, [r.value])).length,
  }));
}

export const categoryOptions = (jobs: Job[]) => countBy(jobs, (j) => [categoryFromTitle(j.title)]);
export const skillOptions = (jobs: Job[]) => countBy(jobs, (j) => j.skills);
export const arrangementOptions = (jobs: Job[]): FilterOption[] =>
  (Object.entries(arrangementLabels) as [string, string][]).map(([value, label]) => ({
    value,
    label,
    count: jobs.filter((j) => j.workArrangement === value).length,
  }));
export const experienceOptions = (jobs: Job[]): FilterOption[] =>
  experienceBuckets.map((b) => ({
    value: b.value,
    label: b.label,
    count: jobs.filter((j) => matchesExperience(j, b)).length,
  }));

/** Keeps only values that are real options for these jobs (links can say anything). */
export function pruneFilters(f: Filters, jobs: Job[]): Filters {
  const keep = (values: string[], options: { value: string }[]) =>
    values.filter((v) => options.some((o) => o.value === v));
  return {
    terms: f.terms,
    locations: keep(f.locations, [...regionOptions, ...locationOptions(jobs)]),
    categories: keep(f.categories, categoryOptions(jobs)),
    skills: keep(f.skills, skillOptions(jobs)),
    arrangements: keep(f.arrangements, arrangementOptions(jobs)),
    experiences: keep(f.experiences, experienceBuckets),
  };
}

const SENIOR_TITLE =
  /\b(senior|sr|staff|principal|lead|director|head of|architect|vp|vice president|distinguished|fellow|engineering manager)\b/i;
const ENTRY_TITLE =
  /\b(intern(ship)?|graduate|new[- ]?grad|junior|jr|entry[- ]level|trainee|apprentice|fresher|early[- ]career|campus|associate|sde[- ]?1|(?:engineer|developer|analyst|scientist)\s*,?\s*(?:i|1))\b/i;

/**
 * What the title says about seniority, for postings that state no years.
 * Senior wins over entry ("Senior Associate"). "unknown" is the common case.
 */
export function seniorityFromTitle(title: string): "entry" | "senior" | "unknown" {
  if (SENIOR_TITLE.test(title)) return "senior";
  if (ENTRY_TITLE.test(title)) return "entry";
  return "unknown";
}

/**
 * Stated years decide when a posting has them. Otherwise the title does: an
 * entry-level title fits 0–2, a senior one fits 6+, and anything else could
 * be 0–5 so it stays in those buckets rather than vanishing.
 */
export function matchesExperience(j: Job, bucket: ExperienceBucket): boolean {
  if (j.minYears !== null) {
    const max = j.maxYears ?? Infinity;
    return !(max < bucket.min || j.minYears > bucket.max);
  }
  switch (seniorityFromTitle(j.title)) {
    case "entry":
      return bucket.value === "0-2";
    case "senior":
      return bucket.value === "6+";
    default:
      return bucket.value !== "6+";
  }
}

/** True when the posting or its title actually points at an experience level. */
export function hasExperienceSignal(j: Job): boolean {
  return j.minYears !== null || seniorityFromTitle(j.title) !== "unknown";
}

export function filterJobs(jobs: Job[], f: Filters): Job[] {
  const buckets = experienceBuckets.filter((b) => f.experiences.includes(b.value));

  return jobs.filter((j) => {
    if (f.terms.length > 0) {
      const haystack = [j.company, j.title, j.city ?? "", ...j.skills].join(" ").toLowerCase();
      if (!f.terms.every((t) => matchesTerm(haystack, t))) return false;
    }
    if (!matchesLocation(j, f.locations)) return false;
    if (f.categories.length > 0 && !f.categories.includes(categoryFromTitle(j.title))) return false;
    if (f.skills.length > 0 && !f.skills.some((s) => j.skills.includes(s))) return false;
    if (f.arrangements.length > 0 && !f.arrangements.includes(j.workArrangement)) return false;
    if (buckets.length > 0 && !buckets.some((b) => matchesExperience(j, b))) return false;
    return true;
  });
}

export interface Relaxation {
  key: keyof Filters;
  /** For a search tag, which one. */
  term?: string;
  label: string;
  /** Matches if this one filter (or tag) were removed. */
  count: number;
}

const GROUP_NOUN: Record<Exclude<keyof Filters, "terms">, string> = {
  locations: "locations",
  categories: "categories",
  skills: "skills",
  arrangements: "work arrangements",
  experiences: "experience levels",
};

/**
 * For a thin result list: which single filter or search tag, if removed, would
 * show more roles. Biggest gain first; ones that would not help are left out.
 */
export function relaxations(jobs: Job[], f: Filters): Relaxation[] {
  const current = filterJobs(jobs, f).length;
  const out: Relaxation[] = [];

  for (const term of f.terms) {
    const count = filterJobs(jobs, { ...f, terms: f.terms.filter((t) => t !== term) }).length;
    out.push({ key: "terms", term, label: `“${term}”`, count });
  }
  for (const key of Object.keys(GROUP_NOUN) as (keyof typeof GROUP_NOUN)[]) {
    const values = f[key];
    if (values.length === 0) continue;
    const labelOf = (v: string) =>
      key === "arrangements"
        ? arrangementLabels[v as keyof typeof arrangementLabels] ?? v
        : key === "experiences"
          ? experienceBuckets.find((b) => b.value === v)?.label ?? v
          : regionOptions.find((r) => r.value === v)?.label ?? v;
    out.push({
      key,
      label: values.length === 1 ? labelOf(values[0]) : `${values.length} ${GROUP_NOUN[key]}`,
      count: filterJobs(jobs, { ...f, [key]: [] }).length,
    });
  }
  return out.filter((r) => r.count > current).sort((a, b) => b.count - a.count);
}

/** "U.S." and "United States" are the same place; show one name for it. */
function canonicalPlace(place: string): string {
  const countries = locationCountries(place);
  return countries.length === 1 ? countries[0] : place;
}

export function eligibilityLabel(j: Job): string {
  if (j.workArrangement === "remote") {
    if (j.eligibility === "Worldwide") return "Remote — Worldwide";
    if (j.eligibility === "Unspecified") {
      return "Remote — location not specified";
    }
    return `Remote — ${canonicalPlace(j.eligibility)} eligible`;
  }
  const place = j.city ?? "Location not listed";
  if (j.workArrangement === "unspecified") return place;
  const kind = arrangementLabels[j.workArrangement];
  return j.city ? `${kind} — ${j.city}` : `${kind} — location not listed`;
}

export function experienceLabel(j: Job): string {
  if (j.minYears === null) {
    return seniorityFromTitle(j.title) === "entry"
      ? "Entry level"
      : "Experience not stated";
  }
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
