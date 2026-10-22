import { AlertSignup } from "@/components/AlertSignup";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { JobSearch } from "@/components/JobSearch";
import { Navbar } from "@/components/Navbar";
import { jobs } from "@/lib/jobs";

export default function Home() {
  // Passed down so server and client render identical freshness labels.
  const now = Date.now();

  return (
    <>
      <Navbar />
      <main className="mx-auto flex w-full max-w-[1200px] flex-col gap-8 px-5 py-10 md:px-20">
        <Hero />
        <JobSearch jobs={jobs} now={now} />
        <AlertSignup />
        <Footer />
      </main>
    </>
  );
}
