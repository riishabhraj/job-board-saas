import Link from "next/link";
import { JobRow } from "./JobRow";
import { ListHeader } from "./ListHeader";
import type { Job } from "@/lib/jobs";

/** The newest real listings. Rendered only when the live feed is available. */
export function LatestJobs({
  jobs,
  total,
  now,
}: {
  jobs: Job[];
  total: number;
  now: number;
}) {
  if (jobs.length === 0) return null;

  return (
    <section className="w-full px-8 pt-4 pb-14">
      <div className="mx-auto max-w-[1040px]">
        <p className="mb-3.5 text-center text-xs font-semibold tracking-[0.06em] text-faint uppercase">
          Latest openings
        </p>
        <div className="overflow-hidden rounded-[14px] border border-border">
          <ListHeader />
          <ul>
            {jobs.map((job) => (
              <JobRow key={job.id} job={job} now={now} />
            ))}
          </ul>
        </div>
        <p className="mt-4 text-center text-[13px] text-faint">
          <Link
            href="/jobs"
            className="text-text underline underline-offset-4 hover:text-accent"
          >
            See all {total.toLocaleString("en-US")} openings →
          </Link>
        </p>
      </div>
    </section>
  );
}
