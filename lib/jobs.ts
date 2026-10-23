/** "unspecified" when the posting gives a place but not how the role is worked. */
export type WorkArrangement = "remote" | "hybrid" | "on-site" | "unspecified";
export type EmploymentType =
  | "Full-time"
  | "Part-time"
  | "Contract"
  | "Internship";
export type JobSource = "Greenhouse" | "Lever" | "Ashby" | "Company careers";

/**
 * Normalized job shape (see product spec §10). Only the fields the landing
 * page needs are modelled for now; ingestion will fill in the rest.
 */
export interface Job {
  id: string;
  company: string;
  title: string;
  /** City for hybrid / on-site roles. */
  city?: string;
  workArrangement: WorkArrangement;
  /**
   * Where a candidate must be based. "Worldwide" for open remote roles, a
   * country or region ("India", "Europe", ...) when stated, and "Unspecified"
   * when a remote posting does not say. For hybrid and on-site roles this is
   * the raw location.
   */
  eligibility: string;
  /** Years of experience asked for; null when the posting does not say. */
  minYears: number | null;
  /** null with a non-null minYears means open-ended ("5+ years"). */
  maxYears: number | null;
  employmentType: EmploymentType;
  skills: string[];
  /** ISO timestamp the company says it published the opening, if it says. */
  postedAt: string | null;
  /** ISO timestamp the company last edited the posting, if it says. */
  updatedAt: string | null;
  /** Where the opening was found. */
  source: JobSource;
  /** True for the built-in sample jobs, which are not real openings. */
  isExample?: boolean;
  /** ISO timestamp the source was last fetched (feed cache is ~15 minutes). */
  lastVerifiedAt: string;
  /** Original application URL at the company's own site / ATS. */
  applyUrl: string;
}

const minutesAgo = (m: number) =>
  new Date(Date.now() - m * 60 * 1000).toISOString();
const hoursAgo = (h: number) => minutesAgo(h * 60);

// Fallback examples shown only when no live source can be reached. They are
// not real openings and the UI labels them as such.
export const jobs: Job[] = [
  {
    id: "northstar-frontend-engineer",
    company: "Northstar",
    title: "Frontend Engineer",
    workArrangement: "remote",
    eligibility: "India",
    minYears: 2,
    maxYears: 4,
    employmentType: "Full-time",
    skills: ["React", "TypeScript"],
    postedAt: hoursAgo(2),
    updatedAt: null,
    isExample: true,
    source: "Greenhouse",
    lastVerifiedAt: minutesAgo(17),
    applyUrl: "https://example.com/northstar/careers/frontend-engineer",
  },
  {
    id: "forma-product-designer",
    company: "Forma",
    title: "Product Designer",
    city: "Bengaluru",
    workArrangement: "hybrid",
    eligibility: "India",
    minYears: 3,
    maxYears: 5,
    employmentType: "Full-time",
    skills: ["Figma", "Product design"],
    postedAt: hoursAgo(4),
    updatedAt: null,
    isExample: true,
    source: "Ashby",
    lastVerifiedAt: minutesAgo(28),
    applyUrl: "https://example.com/forma/careers/product-designer",
  },
  {
    id: "arcwell-backend-engineer",
    company: "Arcwell",
    title: "Backend Engineer",
    workArrangement: "remote",
    eligibility: "Worldwide",
    minYears: 3,
    maxYears: 6,
    employmentType: "Full-time",
    skills: ["Node.js", "PostgreSQL"],
    postedAt: hoursAgo(6),
    updatedAt: null,
    isExample: true,
    source: "Lever",
    lastVerifiedAt: minutesAgo(41),
    applyUrl: "https://example.com/arcwell/careers/backend-engineer",
  },
  {
    id: "plainfield-full-stack-developer",
    company: "Plainfield",
    title: "Full Stack Developer",
    city: "Pune",
    workArrangement: "on-site",
    eligibility: "India",
    minYears: 1,
    maxYears: 3,
    employmentType: "Full-time",
    skills: ["React", "Python"],
    postedAt: hoursAgo(8),
    updatedAt: null,
    isExample: true,
    source: "Company careers",
    lastVerifiedAt: minutesAgo(95),
    applyUrl: "https://example.com/plainfield/careers/full-stack-developer",
  },
];
