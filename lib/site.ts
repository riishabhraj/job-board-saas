/** Public site origin, used for metadata, the sitemap and social previews. */
export const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

/**
 * Public contact address, set as NEXT_PUBLIC_CONTACT_EMAIL. Until it is set
 * the Contact page and footer link are not shown, so we never link to a page
 * that has nothing on it.
 */
export const contactEmail =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || null;
