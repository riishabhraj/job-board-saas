import type { Metadata } from "next";
import { Comparison } from "@/components/Comparison";
import { Faq } from "@/components/Faq";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "About",
  description:
    "caniworkhere lists technology jobs taken directly from company career boards, with clear location, experience and freshness, and links to the original application.",
};

export default function About() {
  return (
    <>
      <Navbar />
      <main id="main" className="flex flex-col">
        <section className="w-full px-8 pt-[72px] pb-12">
          <div className="mx-auto flex max-w-[720px] flex-col gap-4">
            <h1 className="text-[40px] leading-[1.1] font-extrabold tracking-[-0.03em]">
              Not another recycled job board.
            </h1>
            <p className="text-[17px] leading-[1.6] text-muted">
              caniworkhere lists openings taken directly from company career boards,
              shows where each role can be worked from and when it was posted,
              and sends you to the company&apos;s own application page. No Easy
              Apply, no copies of copies.
            </p>
          </div>
        </section>
        <Comparison />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
