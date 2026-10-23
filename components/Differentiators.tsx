const items = [
  {
    title: "Eligibility, spelled out",
    desc: "Where you can work from, as the posting states it — Remote — Worldwide, Remote — India eligible, or a city — before you open the listing.",
  },
  {
    title: "Freshness, not noise",
    desc: "Every listing shows when the company posted it and when we last checked. Roles removed from a company's board drop out of the feed on the next refresh.",
  },
  {
    title: "Structured, not buried",
    desc: "Experience, tech stack and employment type are read from the original posting and shown in one format — or marked “not stated” when the posting doesn't say.",
  },
  {
    title: "Built for scanning",
    desc: "Dense, typography-first rows. No feature tours, no filler — just the roles that matter.",
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
