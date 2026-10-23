import { Comparison } from "@/components/Comparison";
import { Differentiators } from "@/components/Differentiators";
import { Faq } from "@/components/Faq";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { HeroSearch } from "@/components/HeroSearch";
import { LatestJobs } from "@/components/LatestJobs";
import { Navbar } from "@/components/Navbar";
import { pickHighlights } from "@/lib/filters";
import { getJobs } from "@/lib/getJobs";
import { requestTime } from "@/lib/time";
import { connection } from "next/server";

export default async function Home() {
  // Rendered per request so "posted x ago" labels are accurate; the job feed
  // itself is cached for ~15 minutes.
  await connection();
  const data = await getJobs();
  const now = requestTime();
  // Never show sample jobs here: if the live feed is down, the section hides.
  const latest = data.live ? pickHighlights(data.jobs, 4) : [];

  return (
    <>
      <Navbar />
      <main id="main" className="flex min-h-screen flex-col">
        <Hero />
        <LatestJobs jobs={latest} total={data.totalCount} now={now} />
        <HeroSearch />
        <Differentiators />
        <Comparison />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
