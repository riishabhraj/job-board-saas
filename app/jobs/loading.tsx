import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

export default function Loading() {
  return (
    <>
      <Navbar />
      <main
        id="main"
        aria-busy="true"
        className="mx-auto flex w-full max-w-[1180px] flex-col gap-8 px-8 py-10"
      >
        <p className="sr-only" role="status">
          Loading jobs…
        </p>
        <div className="h-[66px] rounded-xl border border-border bg-surface-2" />
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-semibold">Explore openings</h2>
          <p className="text-[13px] text-muted">
            Loading the latest listings from company career boards…
          </p>
          <ul
            aria-hidden
            className="overflow-hidden rounded-control border border-border"
          >
            {[0, 1, 2, 3, 4].map((i) => (
              <li
                key={i}
                className="flex h-[108px] animate-pulse items-center gap-6 bg-surface p-5 not-first:border-t not-first:border-border"
              >
                <div className="flex flex-1 flex-col gap-2">
                  <div className="h-3 w-24 rounded bg-subtle" />
                  <div className="h-5 w-64 max-w-full rounded bg-subtle" />
                </div>
                <div className="hidden h-3 w-40 rounded bg-subtle md:block" />
              </li>
            ))}
          </ul>
        </div>
      </main>
      <Footer />
    </>
  );
}
