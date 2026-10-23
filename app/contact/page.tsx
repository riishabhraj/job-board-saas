import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { contactEmail } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with jobboard.",
};

export default function Contact() {
  // Not published until a real address is configured.
  if (!contactEmail) notFound();

  return (
    <>
      <Navbar />
      <main id="main" className="w-full px-8 pt-[72px] pb-20">
        <div className="mx-auto flex max-w-[720px] flex-col gap-6">
          <h1 className="text-[40px] leading-[1.1] font-extrabold tracking-[-0.03em]">
            Contact
          </h1>
          <p className="text-[15px] leading-[1.7] text-muted">
            Found a wrong or closed listing, want a company added, or have
            feedback? Send a note.
          </p>
          <p>
            <a
              href={`mailto:${contactEmail}`}
              className="text-lg font-semibold text-text underline underline-offset-4 hover:text-accent"
            >
              {contactEmail}
            </a>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
