import Link from "next/link";
import { contactEmail } from "@/lib/site";

const link = "transition-colors hover:text-text";

export function Footer() {
  return (
    <footer className="w-full border-t border-subtle px-8 py-9">
      <div className="mx-auto flex max-w-[1180px] flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-faint">© 2026 caniworkhere</p>
        <nav aria-label="Footer" className="flex gap-6 text-[13px] text-faint">
          <Link href="/about" className={link}>
            About
          </Link>
          <Link href="/privacy" className={link}>
            Privacy
          </Link>
          {contactEmail && (
            <Link href="/contact" className={link}>
              Contact
            </Link>
          )}
        </nav>
      </div>
    </footer>
  );
}
