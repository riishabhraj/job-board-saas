import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "About — jobboard",
  description:
    "Jobs found directly on company career pages, with clear remote eligibility and freshness.",
};

const comparison = [
  ["Source", "Copied from other job boards", "Original company career page"],
  ["Remote label", 'Just "Remote"', "Explicit: Worldwide, India, US-only…"],
  ["Freshness", "Often stale or reposted", "Found time and last-checked time"],
  ["Duplicates", "Same role listed 5–6 times", "One canonical listing"],
  ["Applying", "Through the board or Easy Apply", "Directly at the source"],
];

const faqs = [
  [
    "Why not just use LinkedIn or Indeed?",
    "The listing there is usually a copy, sometimes weeks old and sometimes already filled. We read the original company posting directly, so what you see is what the company published.",
  ],
  [
    "How do you verify a job is still active?",
    "We revisit the original source. If a role disappears from the company's career page or ATS, it is marked inactive here.",
  ],
  [
    "Do I need an account to browse?",
    "No. Search, filter and open any listing without signing up.",
  ],
  [
    "Is it free for candidates?",
    "Yes. Browsing and applying never cost anything.",
  ],
  [
    "Which companies do you track?",
    "We start with a curated set of startups and technology companies on Greenhouse, Lever and Ashby, and expand from there.",
  ],
];

export default function About() {
  return (
    <>
      <Navbar />
      <main className="mx-auto flex w-full max-w-[1200px] flex-col gap-12 px-5 py-10 md:px-20">
        <section className="flex max-w-[640px] flex-col gap-4">
          <h1 className="text-[40px] leading-[1.1] font-semibold tracking-[-0.035em]">
            Not another recycled job board.
          </h1>
          <p className="text-base text-muted">
            jobboard finds openings directly on company career pages, explains
            where you can actually work from, and sends you to the original
            application. No Easy Apply, no copies of copies.
          </p>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-2xl font-semibold">How it compares</h2>
          <div className="overflow-x-auto rounded-control border border-border">
            <table className="w-full min-w-[640px] border-collapse text-left text-sm">
              <thead className="bg-surface text-[13px] text-muted">
                <tr>
                  <th className="p-4 font-medium">Feature</th>
                  <th className="p-4 font-medium">LinkedIn / Indeed</th>
                  <th className="p-4 font-medium text-text">jobboard</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map(([feature, others, us]) => (
                  <tr key={feature} className="border-t border-border">
                    <th className="p-4 font-medium">{feature}</th>
                    <td className="p-4 text-muted">{others}</td>
                    <td className="p-4">{us}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="flex max-w-[720px] flex-col gap-4">
          <h2 className="text-2xl font-semibold">Frequently asked</h2>
          <div className="overflow-hidden rounded-control border border-border">
            {faqs.map(([q, a]) => (
              <details
                key={q}
                className="bg-surface p-4 not-first:border-t not-first:border-border"
              >
                <summary className="cursor-pointer text-[15px] font-semibold">
                  {q}
                </summary>
                <p className="mt-2 text-sm text-muted">{a}</p>
              </details>
            ))}
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
