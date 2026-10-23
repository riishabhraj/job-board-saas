import type { Metadata } from "next";
import { connection } from "next/server";
import { Footer } from "@/components/Footer";
import { JobSearch } from "@/components/JobSearch";
import { Navbar } from "@/components/Navbar";
import { getJobs } from "@/lib/getJobs";
import { requestTime } from "@/lib/time";

export async function generateMetadata(): Promise<Metadata> {
  // Request-time only: never fetch third-party boards during `next build`.
  await connection();
  const { live } = await getJobs();
  return {
    title: "Jobs",
    description:
      "Search technology openings pulled directly from company career boards on Greenhouse, Lever and Ashby.",
    // Never let example data from an outage be indexed.
    robots: live ? undefined : { index: false },
  };
}

// Fetching ~34 company boards can take a while on a cold cache.
export const maxDuration = 60;

export default async function Jobs({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[] }>;
}) {
  await connection();
  const { q } = await searchParams;
  const initialQuery = Array.isArray(q) ? (q[0] ?? "") : (q ?? "");
  const data = await getJobs();
  // Passed down so server and client render identical freshness labels.
  const now = requestTime();

  return (
    <>
      <Navbar />
      <main id="main" className="mx-auto flex w-full max-w-[1180px] flex-col gap-8 px-8 py-10">
        <JobSearch
          jobs={data.jobs}
          now={now}
          initialQuery={initialQuery}
          live={data.live}
          fetchedAt={data.fetchedAt}
          totalCount={data.totalCount}
          companyCount={data.companyCount}
        />
      </main>
      <Footer />
    </>
  );
}
