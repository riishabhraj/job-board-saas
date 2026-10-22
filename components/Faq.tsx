const faqs = [
  [
    "Why not just use LinkedIn or Indeed?",
    "Because the listing you see there is usually a copy — sometimes weeks old, sometimes already filled. We index the original company posting directly, so what you see is what’s actually open.",
  ],
  [
    "How do you verify a job is still active?",
    "We periodically revisit the original source. If a role disappears from the company’s career page or ATS, it’s marked inactive here within hours, not months.",
  ],
  [
    "Do I need an account to browse?",
    "No. Search, filter, and open any listing without signing up. An account is only needed for saved searches or alerts.",
  ],
  [
    "Is it free for candidates?",
    "Yes, and it stays that way. Companies pay to promote listings later on — browsing and applying never costs you anything.",
  ],
  [
    "Which companies do you track?",
    "We start with a curated set of startups and technology companies on Greenhouse, Lever, and Ashby, and expand from there.",
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
