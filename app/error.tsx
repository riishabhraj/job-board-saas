"use client";

import { Button } from "@/components/Button";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <main
      id="main"
      className="flex min-h-screen w-full flex-col items-center justify-center gap-4 px-8 text-center"
    >
      <h1 className="text-[32px] font-extrabold tracking-[-0.02em]">
        Something went wrong
      </h1>
      <p className="text-[15px] text-muted">
        We couldn&apos;t load this page. Please try again.
      </p>
      <Button onClick={reset}>Try again</Button>
    </main>
  );
}
