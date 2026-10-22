import { AlertSignup } from "@/components/AlertSignup";
import { Comparison } from "@/components/Comparison";
import { Differentiators } from "@/components/Differentiators";
import { Faq } from "@/components/Faq";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { HeroSearch } from "@/components/HeroSearch";
import { Navbar } from "@/components/Navbar";
import { ProductPreview } from "@/components/ProductPreview";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex min-h-screen flex-col">
        <Hero />
        <ProductPreview />
        <HeroSearch />
        <Differentiators />
        <Comparison />
        <Faq />
        <AlertSignup />
      </main>
      <Footer />
    </>
  );
}
