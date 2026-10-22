import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full border-t border-subtle px-8 py-9">
      <div className="mx-auto flex max-w-[1180px] flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-faint">© 2026 jobboard</p>
        <div className="flex gap-6 text-[13px] text-faint">
          <Link href="/about">About</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/contact">Contact</Link>
        </div>
      </div>
    </footer>
  );
}
