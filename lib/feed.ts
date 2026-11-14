import { compareNewest, seniorityFromTitle } from "./filters";
import type { Job } from "./jobs";

/**
 * Roles this audience can act on: entry-level or internship roles, roles in
 * India, and roles open to candidates anywhere. They are kept ahead of the
 * rest when the feed has to be cut down.
 */
export function isPriority(j: Job): boolean {
  const entry =
    j.employmentType === "Internship" ||
    seniorityFromTitle(j.title) === "entry" ||
    (j.minYears !== null && j.minYears <= 2);
  const india = j.countries.includes("India");
  const worldwide = j.workArrangement === "remote" && j.eligibility === "Worldwide";
  return entry || india || worldwide;
}

/**
 * Cuts a large feed to `max` roles without losing the ones that matter most:
 * priority roles first (newest first), then the newest of the rest.
 */
export function selectFeed(all: Job[], max: number): Job[] {
  if (all.length <= max) return [...all].sort(compareNewest);
  const priority = all.filter(isPriority).sort(compareNewest);
  const rest = all.filter((j) => !isPriority(j)).sort(compareNewest);
  return [...priority, ...rest].slice(0, max).sort(compareNewest);
}
