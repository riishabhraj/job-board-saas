import Link from "next/link";
import { buttonClass } from "@/components/Button";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main
        id="main"
        className="flex min-h-[50vh] w-full flex-col items-center justify-center gap-4 px-8 py-20 text-center"
      >
        <h1 className="text-[32px] font-extrabold tracking-[-0.02em]">
          Page not found
        </h1>
        <p className="text-[15px] text-muted">
          That page doesn&apos;t exist. Try the job listings instead.
        </p>
        <Link href="/jobs" className={buttonClass("primary")}>
          Browse jobs
        </Link>
      </main>
      <Footer />
    </>
  );
}
