import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { contactEmail } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy",
  description: "What caniworkhere does and does not collect.",
};

const h2 = "text-xl font-semibold";
const p = "text-[15px] leading-[1.7] text-muted";

export default function Privacy() {
  return (
    <>
      <Navbar />
      <main id="main" className="w-full px-8 pt-[72px] pb-20">
        <div className="mx-auto flex max-w-[720px] flex-col gap-6">
          <h1 className="text-[40px] leading-[1.1] font-extrabold tracking-[-0.03em]">
            Privacy
          </h1>
          <p className={p}>
            caniworkhere is an early-stage project. This page says plainly what
            the site does and doesn&apos;t collect. Last updated October 2026.
          </p>

          <h2 className={h2}>No accounts, no forms</h2>
          <p className={p}>
            You don&apos;t sign up, log in or give us your name, email or CV.
            Searching and filtering happen in your browser on a list of jobs we
            load from public company career boards.
          </p>

          <h2 className={h2}>Analytics</h2>
          <p className={p}>
            We use Vercel Web Analytics to see how the site is used. It
            records page views and a few events — the search terms you submit,
            which filters you use, and which job&apos;s “View role” button you
            click (the company name). It does not use cookies or build
            a profile of you, and we don&apos;t combine it with anything that
            identifies you.
          </p>

          <h2 className={h2}>Hosting</h2>
          <p className={p}>
            The site runs on Vercel. Like any web host, it processes requests
            such as your IP address and browser details to serve pages and keep
            the service secure.
          </p>

          <h2 className={h2}>Job links</h2>
          <p className={p}>
            “View role” opens the company&apos;s own page in a new tab. That
            site and its application system have their own privacy practices,
            which we don&apos;t control. We don&apos;t receive or store your
            applications.
          </p>

          {contactEmail && (
            <>
              <h2 className={h2}>Questions</h2>
              <p className={p}>
                Get in touch via the{" "}
                <Link
                  href="/contact"
                  className="text-text underline underline-offset-4 hover:text-accent"
                >
                  contact page
                </Link>
                .
              </p>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
