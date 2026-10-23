import { unstable_cache } from "next/cache";
import { fetchAshby } from "./ashby";
import { companies, type Company } from "./companies";
import { fetchGreenhouse } from "./greenhouse";
import { fetchLever } from "./lever";
import { isTechRole } from "./normalize";
import { jobs as sampleJobs, type Job } from "./jobs";

const MAX_JOBS = 600;
const REVALIDATE_SECONDS = 15 * 60;

export interface JobsResult {
  jobs: Job[];
  /** false when the live fetch failed and sample data is shown instead. */
  live: boolean;
  companyCount: number;
  fetchedAt: string;
}

const FETCHERS: Record<
  Company["ats"],
  (company: Company, checkedAt: string) => Promise<Job[]>
> = {
  greenhouse: fetchGreenhouse,
  lever: fetchLever,
  ashby: fetchAshby,
};

async function loadLiveJobs(): Promise<JobsResult> {
  const fetchedAt = new Date().toISOString();
  const settled = await Promise.allSettled(
    companies.map((company) => FETCHERS[company.ats](company, fetchedAt)),
  );

  const all: Job[] = [];
  let companyCount = 0;
  settled.forEach((r, i) => {
    const { ats, token } = companies[i];
    if (r.status === "rejected") {
      console.warn(`board skipped: ${ats}/${token}: ${r.reason?.message ?? r.reason}`);
      return;
    }
    const jobs = r.value.filter((j) => isTechRole(j.title));
    console.info(`board ok: ${ats}/${token}: ${jobs.length}/${r.value.length} tech roles`);
    if (jobs.length > 0) companyCount++;
    all.push(...jobs);
  });

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
