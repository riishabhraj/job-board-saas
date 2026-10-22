import Link from "next/link";

const sampleCards = [
  {
    company: "Vercel",
    role: "Senior Frontend Engineer",
    remote: "Remote — Worldwide",
    meta: "4–7 yrs · React · TypeScript",
    freshness: "Found 2h ago · Verified active",
  },
  {
    company: "Supabase",
    role: "Backend Engineer",
    remote: "Remote — India eligible",
    meta: "2–5 yrs · Node.js · Postgres",
    freshness: "Found today · Verified active",
  },
  {
    company: "Datadog",
    role: "DevOps Engineer",
    remote: "Hybrid — Bengaluru",
    meta: "3–6 yrs · Kubernetes · AWS",
    freshness: "Verified active 28m ago",
  },
];

export function ProductPreview() {
  return (
    <section className="w-full px-8 pt-4 pb-14">
      <div className="mx-auto max-w-[820px]">
        <p className="mb-3.5 text-center text-xs font-semibold tracking-[0.06em] text-[#6e6e76] uppercase">
          Illustrative preview — full feed lives on the jobs page
        </p>
        <ul className="overflow-hidden rounded-[14px] border border-border bg-surface">
          {sampleCards.map((c) => (
            <li
              key={c.role}
              className="grid items-center gap-x-4 gap-y-1.5 border-b border-subtle p-5 py-[18px] last:border-b-0 min-[721px]:grid-cols-[1.4fr_1fr_1fr_auto]"
            >
              <div className="flex min-w-0 flex-col gap-[3px]">
                <p className="text-[15px] font-bold">{c.role}</p>
                <p className="text-[13px] text-muted">{c.company}</p>
              </div>
              <p className="text-[13px] text-[#c7c7cc]">{c.remote}</p>
              <p className="text-[13px] text-dim">{c.meta}</p>
              <div className="flex flex-col gap-1.5 whitespace-nowrap min-[721px]:items-end">
                <p className="text-xs font-semibold text-accent">
                  {c.freshness}
                </p>
                <Link href="/jobs" className="text-[13px] font-semibold">
                  View role ↗
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
