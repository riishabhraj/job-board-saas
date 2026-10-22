const rows = [
  ["Source", "Copied from other job boards", "Original company career page"],
  ["Remote label", 'Just "Remote"', "Explicit — Worldwide, India, US-only…"],
  [
    "Freshness",
    "Often stale or reposted",
    "Found-time + verified-active timestamp",
  ],
  ["Duplicates", "Same role listed 5–6 times", "One canonical listing"],
  [
    "Applying",
    "Through the board or Easy Apply",
    "Directly at the source, every time",
  ],
];

export function Comparison() {
  return (
    <section className="w-full border-t border-subtle px-8 py-[72px]">
      <div className="mx-auto max-w-[900px]">
        <div className="mb-9 text-center">
          <h2 className="mb-2.5 text-[30px] font-extrabold tracking-[-0.02em]">
            Not another recycled job board
          </h2>
          <p className="text-[15px] text-muted">
            How this compares to the boards you already know
          </p>
        </div>
        <div className="overflow-x-auto rounded-[14px] border border-border">
          <div className="min-w-[640px]">
            <div className="grid grid-cols-[1.1fr_1fr_1fr] border-b border-border bg-surface-2 p-[16px_20px] text-xs font-bold tracking-[0.05em] uppercase">
              <p className="text-faint">Feature</p>
              <p className="text-faint">LinkedIn / Indeed</p>
              <p className="text-accent">jobboard</p>
            </div>
            {rows.map(([feature, others, us]) => (
              <div
                key={feature}
                className="grid grid-cols-[1.1fr_1fr_1fr] items-center border-b border-subtle p-[18px_20px] text-sm last:border-b-0"
              >
                <p className="font-semibold">{feature}</p>
                <p className="text-dim">{others}</p>
                <p className="font-medium text-[#e3e7ff]">{us}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
