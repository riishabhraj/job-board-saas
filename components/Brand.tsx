/**
 * The wordmark: all lowercase, with a trailing dot in the accent colour.
 * In running text the name is written without the dot ("caniworkhere") so it
 * is not mistaken for the end of a sentence.
 */
export function Brand({ className = "" }: { className?: string }) {
  return (
    <span className={`whitespace-nowrap ${className}`}>
      caniworkhere<span className="text-accent">.</span>
      <span className="sr-only"> (can I work here)</span>
    </span>
  );
}
