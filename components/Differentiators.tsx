const items = [
  {
    title: "Eligibility intelligence",
    desc: "See whether you can actually apply — by country, timezone, or visa requirement — before you open the listing.",
  },
  {
    title: "Freshness, not noise",
    desc: "Every listing shows when it was found and when it was last verified active. No six-week-old reposts.",
  },
  {
    title: "Structured, not scraped",
    desc: "Experience, stack, and remote terms are pulled from the original posting and normalized — not buried in prose.",
  },
  {
    title: "Built for scanning",
    desc: "Dense, typography-first cards. No feature tours, no filler — just the roles that matter.",
  },
];

export function Differentiators() {
  return (
    <section className="w-full border-t border-subtle px-8 py-14">
      <div className="mx-auto grid max-w-[1180px] grid-cols-1 gap-px overflow-hidden rounded-[14px] border border-subtle bg-subtle min-[541px]:grid-cols-2 min-[901px]:grid-cols-4">
        {items.map((i) => (
          <div key={i.title} className="flex flex-col gap-2.5 bg-surface p-[26px_22px]">
            <h3 className="text-[15px] font-bold">{i.title}</h3>
            <p className="text-sm leading-[1.55] text-muted">{i.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
