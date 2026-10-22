import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { JobSearch } from "@/components/JobSearch";
import { Navbar } from "@/components/Navbar";
import { jobs } from "@/lib/jobs";

export const metadata: Metadata = {
  title: "Jobs — jobboard",
  description: "Search openings found directly on company career pages.",
};

export default async function Jobs({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[] }>;
}) {
  const { q } = await searchParams;
  const initialQuery = Array.isArray(q) ? (q[0] ?? "") : (q ?? "");
  // Passed down so server and client render identical freshness labels.
  const now = Date.now();

  return (
    <>
      <Navbar />
      <main className="mx-auto flex w-full max-w-[1180px] flex-col gap-8 px-8 py-10">
        <JobSearch jobs={jobs} now={now} initialQuery={initialQuery} />
      </main>
      <Footer />
    </>
  );
}
