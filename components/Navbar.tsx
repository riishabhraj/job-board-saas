import { buttonClass } from "./Button";

export function Navbar() {
  return (
    <header className="mx-auto flex w-full max-w-[1200px] items-center gap-6 px-5 py-6 md:px-20">
      <a href="/" className="text-xl font-semibold">
        jobboard
      </a>
      <div className="flex-1" />
      <a href="/#jobs" className="text-sm font-medium whitespace-nowrap">
        Browse jobs
      </a>
      <a href="/#alerts" className={buttonClass("secondary")}>
        Get job alerts
      </a>
    </header>
  );
}
