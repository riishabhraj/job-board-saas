import Link from "next/link";

// Fictional companies and roles: this block only shows the row format.
const exampleRows = [
  {
    company: "Northstar",
    role: "Senior Frontend Engineer",
    remote: "Remote — Worldwide",
    meta: "4–7 yrs · React · TypeScript",
    date: "Posted 2h ago",
    source: "Source: Greenhouse · active at last check",
  },
  {
    company: "Arcwell",
    role: "Backend Engineer",
    remote: "Remote — India eligible",
    meta: "2–5 yrs · Node.js · PostgreSQL",
    date: "Posted 1d ago",
    source: "Source: Ashby · active at last check",
  },
  {
    company: "Forma",
    role: "DevOps Engineer",
    remote: "Hybrid — Bengaluru",
    meta: "3–6 yrs · Kubernetes · AWS",
    date: "Posted 3d ago",
    source: "Source: Lever · active at last check",
  },
];

export function ProductPreview() {
  return (
    <section className="w-full px-8 pt-4 pb-14">
      <div className="mx-auto max-w-[820px]">
        <p className="mb-3.5 text-center text-xs font-semibold tracking-[0.06em] text-faint uppercase">
          Example listings — the format, not real openings
        </p>
        <ul
          aria-label="Example listings, not real openings"
          className="overflow-hidden rounded-[14px] border border-border bg-surface"
        >
          {exampleRows.map((c) => (
            <li
              key={c.role}
              className="grid items-center gap-x-4 gap-y-1.5 border-b border-subtle p-5 py-[18px] last:border-b-0 min-[721px]:grid-cols-[1.4fr_1fr_1fr_250px]"
            >
              <div className="flex min-w-0 flex-col gap-[3px]">
                <p className="text-[15px] font-bold break-words">{c.role}</p>
                <p className="flex items-center gap-2 text-[13px] text-muted">
                  {c.company}
                  <span className="rounded border border-border px-1.5 py-px text-[10px] font-semibold tracking-wide text-faint uppercase">
                    Example
                  </span>
                </p>
              </div>
              <p className="text-[13px] text-[#c7c7cc]">{c.remote}</p>
              <p className="text-[13px] text-dim">{c.meta}</p>
              <div className="flex flex-col gap-1 min-[721px]:items-end min-[721px]:text-right">
                <p className="text-xs font-semibold text-accent">{c.date}</p>
                <p className="text-xs text-dim">{c.source}</p>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-center text-[13px] text-faint">
          Real listings are on the{" "}
          <Link
            href="/jobs"
            className="text-text underline underline-offset-4 hover:text-accent"
          >
            jobs page →
          </Link>
        </p>
      </div>
    </section>
  );
}
