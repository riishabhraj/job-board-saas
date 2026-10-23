import { buttonClass } from "./Button";
import { ago, eligibilityLabel, experienceLabel } from "@/lib/filters";
import type { Job } from "@/lib/jobs";

export function JobRow({ job, now }: { job: Job; now: number }) {
  return (
    <li className="grid gap-x-4 gap-y-3 bg-surface p-5 not-first:border-t not-first:border-border md:grid-cols-[1.3fr_1fr_1fr_280px] md:items-center">
      <div className="flex min-w-0 flex-col gap-1">
        <p className="text-[13px] text-muted">{job.company}</p>
        <h3 className="text-lg font-semibold">{job.title}</h3>
      </div>
      <p className="text-[13px] text-text">{eligibilityLabel(job)}</p>
      <div className="flex flex-col gap-1 text-[13px] text-muted">
        <p>
          {experienceLabel(job)} · {job.employmentType}
        </p>
        <p>{job.skills.join(" · ")}</p>
      </div>
      <div className="flex items-center justify-between gap-4 md:flex-col md:items-end md:gap-2">
        <div className="flex flex-col gap-1 text-[13px] text-muted md:items-end">
          <p className="text-text">
            Posted {ago(job.postedAt, now)} · Verified active
          </p>
          <p>
            Source: {job.source} · Checked {ago(job.lastVerifiedAt, now)}
          </p>
        </div>
        <a
          href={job.applyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonClass("secondary")}
        >
          View role ↗
        </a>
      </div>
    </li>
  );
}
