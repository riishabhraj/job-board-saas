/**
 * Column labels for job lists. The eligibility column is where the product
 * answers "Can I work here?", so it is named once here on desktop instead of
 * being repeated on every row.
 */
export const LIST_COLUMNS =
  "md:grid-cols-[1.3fr_1fr_1fr_280px]";

export function ListHeader() {
  return (
    <div
      aria-hidden
      className={`hidden gap-x-4 border-b border-border bg-surface-2 px-5 py-2.5 text-[11px] font-semibold tracking-[0.06em] text-faint uppercase md:grid ${LIST_COLUMNS}`}
    >
      <span>Role</span>
      <span className="text-accent">Can I work here?</span>
      <span>Experience</span>
      <span className="text-right">Posted · source</span>
    </div>
  );
}
