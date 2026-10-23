import Link from "next/link";
import { buttonClass } from "./Button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-10 w-full border-b border-subtle bg-bg/90 backdrop-blur">
      <div className="mx-auto flex max-w-[1180px] flex-wrap items-center justify-between gap-4 px-8 py-[18px]">
        <Link href="/" className="text-lg font-bold tracking-[-0.02em]">
          jobboard
        </Link>
        <nav className="flex flex-wrap items-center gap-7">
          <Link
            href="/jobs"
            className={`${buttonClass("light")} !h-auto rounded-[7px] px-[18px] py-[9px]`}
          >
            Browse jobs ↗
          </Link>
        </nav>
      </div>
    </header>
  );
}
