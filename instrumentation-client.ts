import posthog from "posthog-js";

const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;

// Runs once in the browser before the app hydrates. Does nothing without a
// key, so local and preview builds send no data. Requests go through the
// same-origin /ingest rewrite (see next.config.ts) so tracker blockers do
// not hide real visits.
if (key) {
  posthog.init(key, {
    api_host: "/ingest",
    ui_host: "https://us.posthog.com",
    defaults: "2026-01-30",
    // Anonymous visits only: no profiles, no cookies, no recordings.
    person_profiles: "identified_only",
    persistence: "localStorage",
    autocapture: false,
    disable_session_recording: true,
    respect_dnt: true,
    capture_pageview: "history_change",
  });
}
