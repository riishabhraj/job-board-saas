export type Ats = "greenhouse" | "lever" | "ashby";

export interface Company {
  name: string;
  ats: Ats;
  /**
   * The company's board identifier on its ATS:
   * boards.greenhouse.io/<token>, jobs.lever.co/<token>,
   * jobs.ashbyhq.com/<token>.
   */
  token: string;
}

// Curated starting set. A token that does not resolve is skipped at fetch
// time, so a wrong or retired board never breaks the feed.
export const companies: Company[] = [
  // Greenhouse
  { name: "Vercel", ats: "greenhouse", token: "vercel" },
  { name: "GitLab", ats: "greenhouse", token: "gitlab" },
  { name: "Datadog", ats: "greenhouse", token: "datadog" },
  { name: "MongoDB", ats: "greenhouse", token: "mongodb" },
  { name: "Twilio", ats: "greenhouse", token: "twilio" },
  { name: "Elastic", ats: "greenhouse", token: "elastic" },
  { name: "Grafana Labs", ats: "greenhouse", token: "grafanalabs" },
  { name: "Cloudflare", ats: "greenhouse", token: "cloudflare" },
  { name: "Figma", ats: "greenhouse", token: "figma" },
  { name: "Stripe", ats: "greenhouse", token: "stripe" },
  { name: "Discord", ats: "greenhouse", token: "discord" },
  { name: "Airbnb", ats: "greenhouse", token: "airbnb" },
  { name: "Coinbase", ats: "greenhouse", token: "coinbase" },
  { name: "Databricks", ats: "greenhouse", token: "databricks" },
  { name: "Anthropic", ats: "greenhouse", token: "anthropic" },
  { name: "Reddit", ats: "greenhouse", token: "reddit" },
  { name: "Dropbox", ats: "greenhouse", token: "dropbox" },
  { name: "Okta", ats: "greenhouse", token: "okta" },
  // Lever
  { name: "Spotify", ats: "lever", token: "spotify" },
  { name: "Palantir", ats: "lever", token: "palantir" },
  { name: "Outreach", ats: "lever", token: "outreach" },
  // Ashby
  { name: "OpenAI", ats: "ashby", token: "openai" },
  { name: "Linear", ats: "ashby", token: "linear" },
  { name: "Ramp", ats: "ashby", token: "ramp" },
  { name: "Notion", ats: "ashby", token: "notion" },
  { name: "Supabase", ats: "ashby", token: "supabase" },
  { name: "PostHog", ats: "ashby", token: "posthog" },
  { name: "Zapier", ats: "ashby", token: "zapier" },
  { name: "Replit", ats: "ashby", token: "replit" },
  { name: "Cohere", ats: "ashby", token: "cohere" },
  { name: "ClickHouse", ats: "ashby", token: "clickhouse" },
  { name: "ElevenLabs", ats: "ashby", token: "elevenlabs" },
  { name: "Vanta", ats: "ashby", token: "vanta" },
  { name: "Modal", ats: "ashby", token: "modal" },
];
