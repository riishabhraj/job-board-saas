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
  // Hiring in India, remote-first or early-career friendly (to verify live)
  { name: "Postman", ats: "greenhouse", token: "postman" },
  { name: "BrowserStack", ats: "greenhouse", token: "browserstack" },
  { name: "Razorpay", ats: "greenhouse", token: "razorpaysoftwareprivatelimited" },
  { name: "Groww", ats: "greenhouse", token: "groww" },
  { name: "Chargebee", ats: "greenhouse", token: "chargebee" },
  { name: "Sprinklr", ats: "greenhouse", token: "sprinklr" },
  { name: "Uniphore", ats: "greenhouse", token: "uniphore" },
  { name: "ThoughtSpot", ats: "greenhouse", token: "thoughtspot" },
  { name: "Zscaler", ats: "greenhouse", token: "zscaler" },
  { name: "Rubrik", ats: "greenhouse", token: "rubrik" },
  { name: "Druva", ats: "greenhouse", token: "druva" },
  { name: "CleverTap", ats: "greenhouse", token: "clevertap" },
  { name: "Remote", ats: "greenhouse", token: "remotecom" },
  { name: "Oyster", ats: "greenhouse", token: "oysterhr" },
  { name: "Canonical", ats: "greenhouse", token: "canonical" },
  { name: "Mozilla", ats: "greenhouse", token: "mozilla" },
  { name: "Sentry", ats: "greenhouse", token: "sentry" },
  { name: "Netlify", ats: "greenhouse", token: "netlify" },
  { name: "Duolingo", ats: "greenhouse", token: "duolingo" },
  { name: "Monzo", ats: "greenhouse", token: "monzo" },
  { name: "Nubank", ats: "greenhouse", token: "nubank" },
  { name: "Checkout.com", ats: "greenhouse", token: "checkoutcom" },
  // Lever
  { name: "Spotify", ats: "lever", token: "spotify" },
  { name: "Palantir", ats: "lever", token: "palantir" },
  { name: "Outreach", ats: "lever", token: "outreach" },
  { name: "CRED", ats: "lever", token: "cred" },
  { name: "Meesho", ats: "lever", token: "meesho" },
  { name: "Swiggy", ats: "lever", token: "swiggy" },
  { name: "Zeta", ats: "lever", token: "zeta" },
  { name: "Plaid", ats: "lever", token: "plaid" },
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
  { name: "Deel", ats: "ashby", token: "deel" },
  { name: "Sarvam AI", ats: "ashby", token: "sarvam" },
  { name: "Rippling", ats: "ashby", token: "rippling" },
];
