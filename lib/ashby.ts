import type { Company } from "./companies";
import type { Job, WorkArrangement } from "./jobs";
import { htmlToText, toJob } from "./normalize";

/** The subset of the Ashby job-board API response we read. */
export interface AshbyJob {
  id: string;
  title: string;
  location?: string;
  isRemote?: boolean;
  isListed?: boolean;
  workplaceType?: string;
  employmentType?: string;
  publishedAt?: string;
  jobUrl: string;
  descriptionPlain?: string;
  descriptionHtml?: string;
}

const WORKPLACE: Record<string, WorkArrangement> = {
  remote: "remote",
  hybrid: "hybrid",
  onsite: "on-site",
  "on-site": "on-site",
};

export function normalizeAshby(
  company: Company,
  j: AshbyJob,
  checkedAt: string,
): Job {
  const stated = WORKPLACE[(j.workplaceType ?? "").toLowerCase()];
  return toJob(
    company,
    {
      id: j.id,
      title: j.title,
      url: j.jobUrl,
      postedAt: j.publishedAt,
      location: j.location ?? "",
      workplace: stated ?? (j.isRemote ? "remote" : undefined),
      employment: j.employmentType,
      text:
        j.descriptionPlain ??
        (j.descriptionHtml ? htmlToText(j.descriptionHtml) : ""),
    },
    checkedAt,
  );
}

export async function fetchAshby(
  company: Company,
  checkedAt: string,
): Promise<Job[]> {
  const res = await fetch(
    `https://api.ashbyhq.com/posting-api/job-board/${encodeURIComponent(company.token)}`,
    { cache: "no-store", signal: AbortSignal.timeout(20_000) },
  );
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const body = (await res.json()) as { jobs?: AshbyJob[] };
  return (body.jobs ?? [])
    .filter((j) => j.isListed !== false)
    .map((j) => normalizeAshby(company, j, checkedAt));
}
