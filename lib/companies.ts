export interface Company {
  name: string;
  /** Greenhouse board token: boards.greenhouse.io/<token>. */
  token: string;
}

// Curated starting set. A token that does not resolve is skipped at fetch
// time, so a wrong or retired board never breaks the feed.
export const companies: Company[] = [
  { name: "Vercel", token: "vercel" },
  { name: "GitLab", token: "gitlab" },
  { name: "Datadog", token: "datadog" },
  { name: "MongoDB", token: "mongodb" },
  { name: "Twilio", token: "twilio" },
  { name: "Elastic", token: "elastic" },
  { name: "Grafana Labs", token: "grafanalabs" },
  { name: "Cloudflare", token: "cloudflare" },
  { name: "Figma", token: "figma" },
  { name: "Stripe", token: "stripe" },
  { name: "Discord", token: "discord" },
  { name: "Airbnb", token: "airbnb" },
  { name: "Coinbase", token: "coinbase" },
  { name: "Databricks", token: "databricks" },
  { name: "Anthropic", token: "anthropic" },
  { name: "Reddit", token: "reddit" },
  { name: "Dropbox", token: "dropbox" },
  { name: "Okta", token: "okta" },
];
