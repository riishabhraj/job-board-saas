import { unstable_cache } from "next/cache";
import { companies } from "./companies";
import { fetchBoard, isTechRole, normalize } from "./greenhouse";
import { jobs as sampleJobs, type Job } from "./jobs";

const MAX_JOBS = 400;
const REVALIDATE_SECONDS = 15 * 60;

export interface JobsResult {
  jobs: Job[];
  /** false when the live fetch failed and sample data is shown instead. */
  live: boolean;
  companyCount: number;
  fetchedAt: string;
}

async function loadLiveJobs(): Promise<JobsResult> {
  const fetchedAt = new Date().toISOString();
  const settled = await Promise.allSettled(
    companies.map(async (company) => ({
      company,
      raw: await fetchBoard(company.token),
    })),
  );

  const all: Job[] = [];
  let companyCount = 0;
  for (const r of settled) {
    if (r.status === "rejected") {
      console.warn("board skipped:", r.reason?.message ?? r.reason);
      continue;
    }
    const jobs = r.value.raw
      .filter((j) => isTechRole(j.title))
      .map((j) => normalize(r.value.company, j, fetchedAt));
    if (jobs.length > 0) companyCount++;
    all.push(...jobs);
  }

  if (all.length === 0) throw new Error("no jobs fetched from any board");

  all.sort((a, b) => Date.parse(b.postedAt) - Date.parse(a.postedAt));
  return { jobs: all.slice(0, MAX_JOBS), live: true, companyCount, fetchedAt };
}

// Failures throw, so they are not cached and the next request retries.
const cachedLoad = unstable_cache(loadLiveJobs, ["live-jobs-v1"], {
  revalidate: REVALIDATE_SECONDS,
});

export async function getJobs(): Promise<JobsResult> {
  try {
    return await cachedLoad();
  } catch (err) {
    console.error("live jobs unavailable, using samples:", err);
    return {
      jobs: sampleJobs,
      live: false,
      companyCount: 0,
      fetchedAt: new Date().toISOString(),
    };
  }
}
