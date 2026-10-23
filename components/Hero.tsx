export function Hero() {
  return (
    <section className="w-full bg-[radial-gradient(circle_at_50%_0%,rgba(124,156,255,0.08),transparent_55%)] px-8 pt-[88px] pb-12">
      <div className="mx-auto flex max-w-[760px] flex-col items-center gap-5 text-center">
        <p className="rounded-full border border-border bg-surface-2 px-3.5 py-1.5 text-[13px] font-semibold tracking-[0.04em] text-accent uppercase">
          Jobs directly from company career boards
        </p>
        <h1 className="text-[36px] leading-[1.1] font-extrabold tracking-[-0.03em] text-[#f7f7f8] sm:text-[52px]">
          Every listing, straight
          <br />
          from the source.
        </h1>
        <p className="max-w-[560px] text-[17px] leading-[1.6] text-muted">
          Not just &ldquo;Remote.&rdquo; See where you can work from, when the
          company posted the role and when we last checked it — all taken from
          the company&apos;s own career board.
        </p>
      </div>
    </section>
  );
}
