export type WorkArrangement = "remote" | "hybrid" | "on-site";
export type EmploymentType = "Full-time" | "Part-time" | "Contract";

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
   * Where a candidate must be based. "Worldwide" for open remote roles,
   * otherwise a country or region ("India", "Europe", ...). For hybrid and
   * on-site roles this is the country the role is located in.
   */
  eligibility: string;
  minYears: number;
  maxYears: number;
  employmentType: EmploymentType;
  skills: string[];
  /** ISO timestamp of when we first discovered the opening. */
  discoveredAt: string;
  /** Original application URL at the company's own site / ATS. */
  applyUrl: string;
}

const hoursAgo = (h: number) =>
  new Date(Date.now() - h * 60 * 60 * 1000).toISOString();

// Sample data until the ingestion pipeline and database exist.
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
    discoveredAt: hoursAgo(2),
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
    discoveredAt: hoursAgo(4),
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
    discoveredAt: hoursAgo(6),
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
    discoveredAt: hoursAgo(8),
    applyUrl: "https://example.com/plainfield/careers/full-stack-developer",
  },
];
