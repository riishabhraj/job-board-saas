export function Hero() {
  return (
    <section className="flex flex-col gap-4">
      <p className="text-[13px] uppercase text-muted">
        Company career pages, in one place
      </p>
      <h1 className="text-[40px] leading-[1.1] font-semibold tracking-[-0.035em] md:text-[52px]">
        Every listing, verified
        <br />
        against the source.
      </h1>
      <p className="max-w-[560px] text-base text-muted">
        Not &ldquo;Remote.&rdquo; Not &ldquo;posted recently.&rdquo; The exact
        eligibility and the exact freshness, checked against the original
        company page.
      </p>
    </section>
  );
}
