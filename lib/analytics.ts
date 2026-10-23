import { track } from "@vercel/analytics";

type Value = string | number | boolean;

/**
 * Sends a custom Vercel Analytics event. Never throws, so analytics can not
 * break the product (e.g. when blocked by an extension). Events carry no
 * personal data: search terms are trimmed, lowercased and capped in length.
 */
export function trackEvent(name: string, props?: Record<string, Value>) {
  try {
    track(name, props);
  } catch {
    // ignore
  }
}

export const cleanTerm = (q: string) => q.trim().toLowerCase().slice(0, 60);
