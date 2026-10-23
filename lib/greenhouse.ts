import type { Company } from "./companies";
import type { Job } from "./jobs";
import { htmlToText, toJob } from "./normalize";

/** The subset of the Greenhouse job-board API response we read. */
export interface GreenhouseJob {
  id: number;
  title: string;
  absolute_url: string;
  updated_at?: string;
  first_published?: string;
  location?: { name?: string };
  content?: string;
}

async function fetchBoard(token: string): Promise<GreenhouseJob[]> {
  const res = await fetch(
    `https://boards-api.greenhouse.io/v1/boards/${encodeURIComponent(token)}/jobs?content=true`,
    { cache: "no-store", signal: AbortSignal.timeout(20_000) },
  );
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const body = (await res.json()) as { jobs?: GreenhouseJob[] };
  return body.jobs ?? [];
}

export function normalize(
  company: Company,
  j: GreenhouseJob,
  checkedAt: string,
): Job {
  return toJob(
    company,
    {
      id: String(j.id),
      title: j.title,
      url: j.absolute_url,
      postedAt: j.first_published ?? j.updated_at,
      location: j.location?.name ?? "",
      // Greenhouse returns the description as escaped HTML.
      text: j.content ? htmlToText(j.content) : "",
    },
    checkedAt,
  );
}

export async function fetchGreenhouse(
  company: Company,
  checkedAt: string,
): Promise<Job[]> {
  const raw = await fetchBoard(company.token);
  return raw.map((j) => normalize(company, j, checkedAt));
}
