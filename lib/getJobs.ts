import { unstable_cache } from "next/cache";
import { cache } from "react";
import { fetchAshby } from "./ashby";
import { companies, type Company } from "./companies";
import { fetchGreenhouse } from "./greenhouse";
import { fetchLever } from "./lever";
import { compareNewest } from "./filters";
import { safeUrl } from "./links";
import { isTechRole } from "./normalize";
import { jobs as sampleJobs, type Job } from "./jobs";

const MAX_JOBS = 600;
const REVALIDATE_SECONDS = 15 * 60;

export interface JobsResult {
  jobs: Job[];
  /** false when the live fetch failed and sample data is shown instead. */
  live: boolean;
  /** Companies that returned at least one technology role. */
  companyCount: number;
  /** Technology roles found before the feed cap was applied. */
  totalCount: number;
  /** When the source boards were last fetched (not when this page rendered). */
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
    // Only roles with a usable application link are listed.
    const jobs = r.value.filter(
      (j) => isTechRole(j.title) && safeUrl(j.applyUrl) !== null,
    );
    console.info(`board ok: ${ats}/${token}: ${jobs.length}/${r.value.length} tech roles`);
    if (jobs.length > 0) companyCount++;
    all.push(...jobs);
  });

  if (all.length === 0) throw new Error("no jobs fetched from any board");

  all.sort(compareNewest);
  return {
    jobs: all.slice(0, MAX_JOBS),
    live: true,
    companyCount,
    totalCount: all.length,
    fetchedAt,
  };
}

// Failures throw, so they are not cached and the next request retries.
const cachedLoad = unstable_cache(loadLiveJobs, ["live-jobs-v1"], {
  revalidate: REVALIDATE_SECONDS,
});

// Last good result seen by this server instance. If every source fails on a
// refresh we keep serving it (its fetchedAt stays honest) before resorting to
// examples.
let lastGood: JobsResult | null = null;

// React cache: the page and its metadata share one result per request.
export const getJobs = cache(async (): Promise<JobsResult> => {
  try {
    lastGood = await cachedLoad();
    return lastGood;
  } catch (err) {
    console.error("live jobs unavailable:", err);
    if (lastGood) return lastGood;
    return {
      jobs: sampleJobs,
      live: false,
      companyCount: 0,
      totalCount: 0,
      fetchedAt: new Date().toISOString(),
    };
  }
});
