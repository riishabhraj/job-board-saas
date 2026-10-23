/**
 * Returns the URL if it is a usable http(s) link, otherwise null. Application
 * links come from third-party APIs, so anything that is not a plain web URL
 * (javascript:, data:, empty, malformed) is rejected.
 */
export function safeUrl(raw: string | undefined | null): string | null {
  if (!raw) return null;
  try {
    const url = new URL(raw.trim());
    return url.protocol === "https:" || url.protocol === "http:"
      ? url.toString()
      : null;
  } catch {
    return null;
  }
}
