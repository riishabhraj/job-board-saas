import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { JobSearch } from "@/components/JobSearch";
import { Navbar } from "@/components/Navbar";
import { ago } from "@/lib/filters";
import { getJobs } from "@/lib/getJobs";

export const metadata: Metadata = {
  title: "Jobs — jobboard",
  description: "Search openings found directly on company career pages.",
};

// Fetching ~18 company boards can take a while on a cold cache.
export const maxDuration = 60;

export default async function Jobs({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[] }>;
}) {
  const { q } = await searchParams;
  const initialQuery = Array.isArray(q) ? (q[0] ?? "") : (q ?? "");
  const data = await getJobs();
  // Passed down so server and client render identical freshness labels.
  const now = Date.now();
  const note = data.live
    ? `${data.jobs.length} openings from ${data.companyCount} companies · updated ${ago(data.fetchedAt, now)}`
    : "Sample listings — the live feed is unavailable right now";

  return (
    <>
      <Navbar />
      <main className="mx-auto flex w-full max-w-[1180px] flex-col gap-8 px-8 py-10">
        <JobSearch
          jobs={data.jobs}
          now={now}
          initialQuery={initialQuery}
          note={note}
        />
      </main>
      <Footer />
    </>
  );
}
