import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { normalizeAshby } from "./ashby";
import { compareNewest, dateLabel, eligibilityLabel, experienceLabel } from "./filters";
import { normalize as normalizeGreenhouse } from "./greenhouse";
import type { Job } from "./jobs";
import { normalizeLever } from "./lever";
import { safeUrl } from "./links";
import {
  extractSkills,
  extractYears,
  htmlToText,
  isTechRole,
  parseLocation,
} from "./normalize";

const CHECKED = "2026-10-23T00:00:00Z";
const company = (ats: "greenhouse" | "lever" | "ashby") => ({
  name: "Acme",
  ats,
  token: "acme",
});

describe("parseLocation", () => {
  it("reads remote eligibility", () => {
    assert.deepEqual(parseLocation("Remote - India"), {
      workArrangement: "remote",
      eligibility: "India",
    });
    assert.equal(parseLocation("Remote, US").eligibility, "United States");
    assert.equal(parseLocation("Remote (Worldwide)").eligibility, "Worldwide");
    assert.equal(parseLocation("Remote").eligibility, "Unspecified");
    // "us" inside another word must not read as the US
    assert.equal(parseLocation("Remote - Austin").eligibility, "Austin");
  });

  it("reads hybrid and explicit on-site", () => {
    const h = parseLocation("Bengaluru, India (Hybrid)");
    assert.equal(h.workArrangement, "hybrid");
    assert.equal(h.city, "Bengaluru, India");
    assert.equal(parseLocation("Berlin (On-site)").workArrangement, "on-site");
  });

  it("does not call a bare place on-site", () => {
    const p = parseLocation("San Francisco, CA");
    assert.equal(p.workArrangement, "unspecified");
    assert.equal(p.city, "San Francisco, CA");
  });

  it("ignores placeholder places like 'In-Office' and empty strings", () => {
    assert.equal(parseLocation("In-Office").city, undefined);
    assert.equal(parseLocation("").city, undefined);
    assert.equal(parseLocation("").eligibility, "Unspecified");
  });
});

describe("eligibilityLabel", () => {
  const job = (over: Partial<Job>): Job => ({
    id: "1", company: "A", title: "T", workArrangement: "unspecified",
    eligibility: "Unspecified", minYears: null, maxYears: null,
    employmentType: "Full-time", skills: [], postedAt: null, updatedAt: null,
    source: "Greenhouse", lastVerifiedAt: CHECKED, applyUrl: "https://x.test",
    ...over,
  });

  it("never prints 'undefined'", () => {
    for (const j of [
      job({ workArrangement: "on-site" }),
      job({ workArrangement: "hybrid" }),
      job({}),
    ]) {
      assert.ok(!eligibilityLabel(j).includes("undefined"), eligibilityLabel(j));
    }
  });

  it("labels each case", () => {
    assert.equal(eligibilityLabel(job({ workArrangement: "remote", eligibility: "Worldwide" })), "Remote — Worldwide");
    assert.equal(eligibilityLabel(job({ workArrangement: "remote", eligibility: "India" })), "Remote — India eligible");
    assert.equal(eligibilityLabel(job({ workArrangement: "hybrid", city: "Pune" })), "Hybrid — Pune");
    assert.equal(eligibilityLabel(job({ city: "Austin, TX" })), "Austin, TX");
  });

  it("states experience honestly", () => {
    assert.equal(experienceLabel(job({})), "Experience not stated");
    assert.equal(experienceLabel(job({ minYears: 5, maxYears: null })), "5+ yrs");
    assert.equal(experienceLabel(job({ minYears: 2, maxYears: 4 })), "2–4 yrs");
  });

  it("only calls a date 'Posted' when the company gave a posting date", () => {
    const now = Date.parse("2026-10-23T12:00:00Z");
    assert.equal(dateLabel(job({ postedAt: "2026-10-23T10:00:00Z" }), now), "Posted 2h ago");
    assert.equal(dateLabel(job({ updatedAt: "2026-10-23T09:00:00Z" }), now), "Updated 3h ago");
    assert.equal(dateLabel(job({}), now), "Posting date not listed");
  });

  it("sorts undated postings last", () => {
    const a = job({ id: "a", postedAt: "2026-10-01T00:00:00Z" });
    const b = job({ id: "b", postedAt: "2026-10-20T00:00:00Z" });
    const c = job({ id: "c" });
    assert.deepEqual([c, a, b].sort(compareNewest).map((j) => j.id), ["b", "a", "c"]);
  });
});

describe("extractYears", () => {
  it("reads ranges, minimums and plus forms", () => {
    assert.deepEqual(extractYears("Requirements: 3-5 years of experience building APIs"), [3, 5]);
    assert.deepEqual(extractYears("You have 5+ years of professional experience"), [5, null]);
    assert.deepEqual(extractYears("Minimum of 4 years experience with Python"), [4, null]);
  });
  it("ignores numbers without experience context or implausible ones", () => {
    assert.equal(extractYears("We were founded 12+ years ago and love dogs"), null);
    assert.equal(extractYears("No numbers here"), null);
    assert.equal(extractYears("Requires 40+ years of experience"), null);
  });
});

describe("skills and text", () => {
  it("decodes escaped HTML and finds skills", () => {
    const text = htmlToText("&lt;p&gt;We use &lt;b&gt;React&lt;/b&gt; &amp;amp; TypeScript. Go beyond the brief.&lt;/p&gt;");
    assert.ok(!text.includes("<"));
    const skills = extractSkills("Frontend Engineer", text);
    assert.ok(skills.includes("React") && skills.includes("TypeScript"));
    assert.ok(!skills.includes("Go"), "sentence-initial 'Go' is not the language");
    assert.ok(!extractSkills("Engineer", "We write JavaScript").includes("Java"));
  });
});

describe("isTechRole", () => {
  it("keeps engineering, design and data roles", () => {
    for (const t of ["Senior Software Engineer", "Product Designer", "Data Scientist", "Staff SRE", "Technical Support Engineer", "Solutions Engineer", "Developer Advocate"]) {
      assert.ok(isTechRole(t), t);
    }
  });
  it("drops sales, recruiting and non-engineering 'technical' roles", () => {
    for (const t of ["Account Executive", "Technical Recruiter", "Marketing Manager", "Program Manager, Commercial Solutions"]) {
      assert.ok(!isTechRole(t), t);
    }
  });
});

describe("ATS adapters", () => {
  it("normalizes Greenhouse and keeps posted vs updated apart", () => {
    const j = normalizeGreenhouse(company("greenhouse"), {
      id: 42, title: "Backend Engineer", absolute_url: "https://boards.greenhouse.io/acme/jobs/42",
      first_published: "2026-10-20T10:00:00Z", updated_at: "2026-10-22T10:00:00Z",
      location: { name: "Remote - India" },
      content: "&lt;p&gt;3-6 years of experience with Node.js and PostgreSQL.&lt;/p&gt;",
    }, CHECKED);
    assert.equal(j.id, "greenhouse-acme-42");
    assert.equal(j.eligibility, "India");
    assert.deepEqual([j.minYears, j.maxYears], [3, 6]);
    assert.deepEqual(j.skills, ["Node.js", "PostgreSQL"]);
    assert.equal(j.postedAt, "2026-10-20T10:00:00Z");
    assert.equal(j.updatedAt, "2026-10-22T10:00:00Z");

    const noDate = normalizeGreenhouse(company("greenhouse"), {
      id: 1, title: "Engineer", absolute_url: "https://x.test", updated_at: "2026-10-22T10:00:00Z",
    }, CHECKED);
    assert.equal(noDate.postedAt, null, "updated_at must not pose as a posting date");
  });

  it("normalizes Lever", () => {
    const j = normalizeLever(company("lever"), {
      id: "abc", text: "Senior Backend Engineer", hostedUrl: "https://jobs.lever.co/acme/abc",
      createdAt: Date.parse("2026-10-21T08:00:00Z"), workplaceType: "remote",
      categories: { location: "London, UK", commitment: "Full-time" },
      descriptionPlain: "You have 4-7 years of experience with Go (Golang) and Kubernetes.",
      lists: [{ text: "Requirements", content: "<li>Strong <b>PostgreSQL</b> skills</li>" }],
    }, CHECKED);
    assert.equal(j.source, "Lever");
    assert.equal(j.eligibility, "United Kingdom");
    assert.deepEqual([j.minYears, j.maxYears], [4, 7]);
    assert.ok(["Go", "Kubernetes", "PostgreSQL"].every((s) => j.skills.includes(s)));
    assert.equal(j.postedAt, "2026-10-21T08:00:00.000Z");

    const intern = normalizeLever(company("lever"), {
      id: "i", text: "Software Engineer Intern", hostedUrl: "https://x.test",
      categories: { location: "Berlin, Germany", commitment: "Intern" },
    }, CHECKED);
    assert.equal(intern.employmentType, "Internship");
    assert.equal(intern.postedAt, null);
  });

  it("normalizes Ashby", () => {
    const j = normalizeAshby(company("ashby"), {
      id: "9f", title: "Staff Frontend Engineer", location: "Bengaluru, India",
      workplaceType: "Hybrid", employmentType: "FullTime", publishedAt: "2026-10-22T06:30:00.000+00:00",
      jobUrl: "https://jobs.ashbyhq.com/acme/9f",
      descriptionPlain: "Minimum of 6 years experience. React, TypeScript and Next.js.",
    }, CHECKED);
    assert.equal(j.workArrangement, "hybrid");
    assert.deepEqual([j.minYears, j.maxYears], [6, null]);
    const onsite = normalizeAshby(company("ashby"), {
      id: "o", title: "Engineer", location: "Austin, TX", workplaceType: "OnSite",
      jobUrl: "https://x.test",
    }, CHECKED);
    assert.equal(onsite.workArrangement, "on-site");
    assert.equal(onsite.postedAt, null);
  });
});

describe("safeUrl", () => {
  it("accepts only http(s) URLs", () => {
    assert.equal(safeUrl("https://jobs.lever.co/acme/1"), "https://jobs.lever.co/acme/1");
    for (const bad of ["", "  ", "javascript:alert(1)", "data:text/html,x", "/relative", "not a url", undefined, null]) {
      assert.equal(safeUrl(bad as string | undefined | null), null, String(bad));
    }
  });
});
