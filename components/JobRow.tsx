import { buttonClass } from "./Button";
import {
  ago,
  dateLabel,
  eligibilityLabel,
  experienceLabel,
} from "@/lib/filters";
import type { Job } from "@/lib/jobs";
import { LIST_COLUMNS } from "./ListHeader";
import { trackEvent } from "@/lib/analytics";
import { safeUrl } from "@/lib/links";

export function JobRow({ job, now }: { job: Job; now: number }) {
  const href = job.isExample ? null : safeUrl(job.applyUrl);

  return (
    <li className={`grid gap-x-4 gap-y-3 bg-surface p-5 not-first:border-t not-first:border-border md:items-center ${LIST_COLUMNS}`}>
      <div className="flex min-w-0 flex-col gap-1">
        <p className="text-[13px] break-words text-muted">{job.company}</p>
        <h3 className="text-lg leading-snug font-semibold break-words">
          {job.title}
        </h3>
      </div>
      <div className="min-w-0">
        <p className="mb-0.5 text-[11px] font-semibold tracking-[0.06em] text-faint uppercase md:hidden">
          Can I work here?
        </p>
        <p className="text-[13px] break-words text-text">
          {eligibilityLabel(job)}
        </p>
      </div>
      <div className="flex min-w-0 flex-col gap-1 text-[13px] break-words text-muted">
        <p>
          {experienceLabel(job)} · {job.employmentType}
        </p>
        {job.skills.length > 0 && <p>{job.skills.join(" · ")}</p>}
      </div>
      <div className="flex min-w-0 items-center justify-between gap-4 md:flex-col md:items-end md:gap-2">
        <div className="flex min-w-0 flex-col gap-1 text-[13px] text-muted md:items-end md:text-right">
          {job.isExample ? (
            <p className="text-text">Example listing — not a real opening</p>
          ) : (
            <>
              <p className="text-text">{dateLabel(job, now)}</p>
              <p>Source: {job.source}</p>
              <p>Active at last check · {ago(job.lastVerifiedAt, now)}</p>
            </>
          )}
        </div>
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              trackEvent("view_role_clicked", {
                company: job.company,
                source: job.source,
              })
            }
            className={buttonClass("secondary")}
          >
            View role ↗
            <span className="sr-only"> at {job.company} (opens in a new tab)</span>
          </a>
        ) : (
          <span
            className={`${buttonClass("secondary")} cursor-not-allowed opacity-60`}
            aria-disabled="true"
          >
            {job.isExample ? "Example only" : "Link unavailable"}
          </span>
        )}
      </div>
    </li>
  );
}
