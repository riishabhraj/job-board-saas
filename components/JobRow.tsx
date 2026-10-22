import { buttonClass } from "./Button";
import {
  experienceLabel,
  freshnessLabel,
  locationLabel,
} from "@/lib/filters";
import type { Job } from "@/lib/jobs";

export function JobRow({ job, now }: { job: Job; now: number }) {
  return (
    <li className="flex flex-col gap-4 bg-surface p-5 not-first:border-t not-first:border-border sm:flex-row sm:items-center">
      <div
        aria-hidden
        className="flex size-11 shrink-0 items-center justify-center rounded-control bg-bg text-lg font-semibold"
      >
        {job.company[0]}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1 text-[13px] text-muted">
        <p>{job.company}</p>
        <h3 className="text-lg font-semibold text-text">{job.title}</h3>
        <p>
          {locationLabel(job)}
          <span className="px-2">/</span>
          {experienceLabel(job)} · {job.employmentType}
        </p>
        <p>{job.skills.join(" · ")}</p>
      </div>
      <div className="flex shrink-0 flex-row items-center justify-between gap-2 sm:flex-col sm:items-end">
        <a
          href={job.applyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonClass("secondary")}
        >
          View role ↗
        </a>
        <p className="text-[13px] text-muted">
          {freshnessLabel(job.discoveredAt, now)}
        </p>
      </div>
    </li>
  );
}
