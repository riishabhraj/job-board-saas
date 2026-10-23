import type { Company } from "./companies";
import type { Job, WorkArrangement } from "./jobs";
import { htmlToText, toJob } from "./normalize";

/** The subset of the Lever postings API response we read. */
export interface LeverPosting {
  id: string;
  text: string;
  hostedUrl: string;
  /** Milliseconds since the epoch. */
  createdAt?: number;
  workplaceType?: string;
  categories?: { location?: string; commitment?: string; allLocations?: string[] };
  descriptionPlain?: string;
  description?: string;
  lists?: { text?: string; content?: string }[];
  additionalPlain?: string;
}

const WORKPLACE: Record<string, WorkArrangement> = {
  remote: "remote",
  hybrid: "hybrid",
  "on-site": "on-site",
};

export function normalizeLever(
  company: Company,
  p: LeverPosting,
  checkedAt: string,
): Job {
  const text = [
    p.descriptionPlain ?? (p.description ? htmlToText(p.description) : ""),
    ...(p.lists ?? []).map((l) => `${l.text ?? ""} ${htmlToText(l.content ?? "")}`),
    p.additionalPlain ?? "",
  ].join(" ");

  return toJob(
    company,
    {
      id: p.id,
      title: p.text,
      url: p.hostedUrl,
      postedAt: p.createdAt ? new Date(p.createdAt).toISOString() : undefined,
      location:
        p.categories?.location ?? p.categories?.allLocations?.join(" | ") ?? "",
      workplace: WORKPLACE[p.workplaceType ?? ""],
      employment: p.categories?.commitment,
      text,
    },
    checkedAt,
  );
}

export async function fetchLever(
  company: Company,
  checkedAt: string,
): Promise<Job[]> {
  const res = await fetch(
    `https://api.lever.co/v0/postings/${encodeURIComponent(company.token)}?mode=json`,
    { cache: "no-store", signal: AbortSignal.timeout(20_000) },
  );
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const raw = (await res.json()) as LeverPosting[];
  return raw.map((p) => normalizeLever(company, p, checkedAt));
}
