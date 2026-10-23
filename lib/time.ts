/**
 * Current time in ms. The /jobs page is rendered per request, so this is the
 * request time; it is passed to client components so server and client render
 * identical "x minutes ago" labels.
 */
export const requestTime = () => Date.now();
