import type { Company } from "./companies";
import type { EmploymentType, Job, WorkArrangement } from "./jobs";

/** The subset of the Greenhouse job-board API response we read. */
export interface GreenhouseJob {
  id: number;
  title: string;
  absolute_url: string;
  updated_at?: string;
  first_published?: string;
  location?: { name?: string };
  content?: string;
}

export async function fetchBoard(token: string): Promise<GreenhouseJob[]> {
  const res = await fetch(
    `https://boards-api.greenhouse.io/v1/boards/${encodeURIComponent(token)}/jobs?content=true`,
    { cache: "no-store", signal: AbortSignal.timeout(20_000) },
  );
  if (!res.ok) throw new Error(`Greenhouse ${token}: HTTP ${res.status}`);
  const body = (await res.json()) as { jobs?: GreenhouseJob[] };
  return body.jobs ?? [];
}

// ---- text helpers -------------------------------------------------------

const ENTITIES: Record<string, string> = {
  "&lt;": "<",
  "&gt;": ">",
  "&amp;": "&",
  "&quot;": '"',
  "&#39;": "'",
  "&nbsp;": " ",
};

const decode = (s: string) =>
  s.replace(/&(?:lt|gt|amp|quot|#39|nbsp);/g, (m) => ENTITIES[m]);

/** Greenhouse returns the description as escaped HTML. */
export function htmlToText(content: string): string {
  return decode(decode(content))
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// ---- title filter -------------------------------------------------------

const TECH_TITLE =
  /engineer|developer|software|devops|\bsre\b|site reliability|security|\bdata\b|machine learning|\bml\b|\bai\b|scientist|product manager|product design|designer|\bux\b|\bui\b|\bqa\b|quality|architect|platform|infrastructure|developer advocate|devrel|technical|solutions/i;
const NON_TECH_TITLE =
  /sales|account executive|recruit|marketing|legal|counsel|financ|accountant|people partner|talent|payroll|customer success|business development|coordinator|executive assistant|\bpr\b|communications/i;
const ENGINEERING_TITLE = /engineer|developer|\bsre\b/i;

export function isTechRole(title: string): boolean {
  if (!TECH_TITLE.test(title)) return false;
  return ENGINEERING_TITLE.test(title) || !NON_TECH_TITLE.test(title);
}

// ---- location -----------------------------------------------------------

const REGIONS: [RegExp, string][] = [
  [/\b(?:united states|usa|u\.s\.a?\.?|us)\b/i, "United States"],
  [/\b(?:united kingdom|uk|u\.k\.)\b/i, "United Kingdom"],
  [/\bcanada\b/i, "Canada"],
  [/\bindia\b/i, "India"],
  [/\b(?:europe|emea|eu)\b/i, "Europe"],
  [/\bapac\b|\basia[- ]pacific\b/i, "APAC"],
  [/\b(?:latam|latin america)\b/i, "Latin America"],
  [/\bamericas\b/i, "Americas"],
];

export interface ParsedLocation {
  workArrangement: WorkArrangement;
  city?: string;
  eligibility: string;
}

export function parseLocation(raw: string): ParsedLocation {
  const text = raw.trim();
  const hybrid = /hybrid/i.test(text);
  const remote = /\bremote\b|work from home|\banywhere\b/i.test(text);

  if (remote && !hybrid) {
    if (/worldwide|global|anywhere|world-wide/i.test(text)) {
      return { workArrangement: "remote", eligibility: "Worldwide" };
    }
    for (const [re, name] of REGIONS) {
      if (re.test(text)) return { workArrangement: "remote", eligibility: name };
    }
    const rest = text
      .replace(/\(?\bremote\b\)?/gi, "")
      .replace(/^[\s,;:/|–—-]+|[\s,;:/|–—-]+$/g, "")
      .trim();
    return {
      workArrangement: "remote",
      eligibility: rest ? rest.slice(0, 40) : "Unspecified",
    };
  }

  const place = text
    .replace(/\(?\bhybrid\b\)?/gi, "")
    .replace(/^[\s,;:/|–—-]+|[\s,;:/|–—-]+$/g, "")
    .trim();
  return {
    workArrangement: hybrid ? "hybrid" : "on-site",
    city: place || undefined,
    eligibility: place || "Unspecified",
  };
}

// ---- experience ---------------------------------------------------------

const CONTEXT = /experience|required|qualification|background|proficien|you have|you've/i;

/** [min, max] years; max null is open-ended. null when nothing is stated. */
export function extractYears(text: string): [number, number | null] | null {
  const patterns: [RegExp, (m: RegExpExecArray) => [number, number | null]][] = [
    [
      /(\d{1,2})\s*(?:-|–|—|to)\s*(\d{1,2})\s*\+?\s*(?:years?|yrs?)/gi,
      (m) => [Number(m[1]), Number(m[2])],
    ],
    [/(\d{1,2})\s*\+\s*(?:years?|yrs?)/gi, (m) => [Number(m[1]), null]],
    [
      /(?:at least|minimum(?: of)?)\s*(\d{1,2})\s*(?:years?|yrs?)/gi,
      (m) => [Number(m[1]), null],
    ],
    [
      /(\d{1,2})\s*(?:years?|yrs?)(?:['’]s?)?\s*(?:of\s+)?(?:[\w-]+\s+){0,3}?experience/gi,
      (m) => [Number(m[1]), null],
    ],
  ];

  for (const [re, toRange] of patterns) {
    for (const m of text.matchAll(re)) {
      const [min, max] = toRange(m as RegExpExecArray);
      if (min > 25 || (max !== null && (max > 25 || max < min))) continue;
      const at = m.index ?? 0;
      if (CONTEXT.test(text.slice(Math.max(0, at - 80), at + 100))) {
        return [min, max];
      }
    }
  }
  return null;
}

// ---- skills -------------------------------------------------------------

const SKILLS: [string, RegExp][] = [
  ["React", /\breact(?:\.js)?\b/i],
  ["Next.js", /\bnext\.?js\b/i],
  ["TypeScript", /\btypescript\b/i],
  ["JavaScript", /\bjavascript\b/i],
  ["Node.js", /\bnode(?:\.js)?\b/i],
  ["Python", /\bpython\b/i],
  ["Go", /\bgolang\b|\(Go\)|,\s*Go\b|\bGo\//],
  ["Rust", /\brust\b/i],
  ["Java", /\bjava\b/i],
  ["Kotlin", /\bkotlin\b/i],
  ["Swift", /\bswift\b/i],
  ["Ruby", /\bruby\b/i],
  ["C++", /c\+\+/i],
  ["PostgreSQL", /\bpostgres(?:ql)?\b/i],
  ["MySQL", /\bmysql\b/i],
  ["Kubernetes", /\bkubernetes\b|\bk8s\b/i],
  ["Docker", /\bdocker\b/i],
  ["AWS", /\baws\b|amazon web services/i],
  ["GCP", /\bgcp\b|google cloud/i],
  ["Terraform", /\bterraform\b/i],
  ["GraphQL", /\bgraphql\b/i],
  ["Kafka", /\bkafka\b/i],
  ["Figma", /\bfigma\b/i],
  ["PyTorch", /\bpytorch\b/i],
  ["SQL", /\bsql\b/i],
];

export function extractSkills(title: string, text: string): string[] {
  return SKILLS.map(([label, re]) => {
    const hits = text.match(new RegExp(re.source, re.flags.replace("g", "") + "g"));
    const score = (re.test(title) ? 4 : 0) + Math.min(hits?.length ?? 0, 3);
    return { label, score };
  })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map((s) => s.label);
}

// ---- normalize ----------------------------------------------------------

function employmentType(title: string, text: string): EmploymentType {
  if (/\bintern(ship)?\b/i.test(title)) return "Internship";
  if (/part[- ]time/i.test(title)) return "Part-time";
  if (/\bcontract(or)?\b|temporary/i.test(title)) return "Contract";
  return /\bpart[- ]time\b/i.test(text.slice(0, 400)) ? "Part-time" : "Full-time";
}

export function normalize(
  company: Company,
  j: GreenhouseJob,
  checkedAt: string,
): Job {
  const text = j.content ? htmlToText(j.content) : "";
  const loc = parseLocation(j.location?.name ?? "");
  const years = extractYears(text);

  return {
    id: `greenhouse-${company.token}-${j.id}`,
    company: company.name,
    title: j.title.trim(),
    city: loc.city,
    workArrangement: loc.workArrangement,
    eligibility: loc.eligibility,
    minYears: years ? years[0] : null,
    maxYears: years ? years[1] : null,
    employmentType: employmentType(j.title, text),
    skills: extractSkills(j.title, text),
    postedAt: j.first_published ?? j.updated_at ?? checkedAt,
    source: "Greenhouse",
    lastVerifiedAt: checkedAt,
    applyUrl: j.absolute_url,
  };
}
