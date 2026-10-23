const faqs = [
  [
    "Why not just use LinkedIn or Indeed?",
    "Those boards often show copies or reposts of a company’s original posting, which can be out of date. jobboard loads each posting from the company’s own career board and links straight to the page the company published. We aren’t a replacement for those sites — we cover a smaller, curated set of companies.",
  ],
  [
    "How do you know a job is still open?",
    "Listings are fetched from each company’s board and refreshed about every 15 minutes, and every row shows when we last checked. If a role is removed from the company’s board, it disappears from our feed at the next refresh. We don’t keep a history of past listings, and a role can close between refreshes — the company’s page is always the final word.",
  ],
  [
    "How accurate are the location and experience labels?",
    "They’re read automatically from the posting text. When a posting doesn’t say — a plain “Remote”, or no years of experience — we say so instead of guessing. Check the company’s page before you apply.",
  ],
  [
    "Which jobs and companies do you cover?",
    "We currently pull technology roles, picked by job title, from a curated list of companies that publish on Greenhouse, Lever and Ashby, and show the newest few hundred. That’s a slice of what’s open, not everything. We add companies over time.",
  ],
  [
    "Do I need an account to browse?",
    "No. Search, filter and open any listing without signing up.",
  ],
  [
    "Is it free?",
    "Yes. There’s no account, and nothing to pay to browse or to apply on a company’s own page.",
  ],
];

export function Faq() {
  return (
    <section className="w-full border-t border-subtle px-8 py-[72px]">
      <div className="mx-auto max-w-[720px]">
        <h2 className="mb-8 text-center text-[28px] font-extrabold tracking-[-0.02em]">
          Frequently asked
        </h2>
        <div className="flex flex-col gap-px overflow-hidden rounded-xl border border-subtle bg-subtle">
          {faqs.map(([q, a]) => (
            <details key={q} className="bg-surface p-[18px_22px]">
              <summary className="cursor-pointer text-[15px] font-semibold">
                {q}
              </summary>
              <p className="mt-2.5 text-sm leading-[1.6] text-muted">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
