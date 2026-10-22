"use client";

import { useState } from "react";
import { Button } from "./Button";

type Status = "idle" | "sending" | "done" | "error";

export function AlertSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setStatus(res.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section
      id="alerts"
      className="w-full scroll-mt-20 border-t border-subtle px-8 py-[72px]"
    >
      <div className="mx-auto flex max-w-[620px] flex-col items-center gap-4 rounded-2xl border border-border bg-surface p-[44px_36px] text-center">
        <h2 className="text-[26px] font-extrabold tracking-[-0.02em]">
          A little less searching.
        </h2>
        <p className="text-[15px] text-muted" aria-live="polite">
          {status === "done"
            ? "Thanks. We'll email you new openings."
            : status === "error"
              ? "Something went wrong. Check your email and try again."
              : "Get new openings delivered to your inbox — only the ones you're actually eligible for."}
        </p>
        <form
          onSubmit={onSubmit}
          className="flex w-full max-w-[420px] flex-wrap gap-2.5"
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            aria-label="Email address"
            className="min-w-[180px] flex-1 rounded-lg border border-[#26262e] bg-bg px-3.5 py-3 text-sm text-text"
          />
          <Button type="submit" disabled={status === "sending"}>
            Get alerts
          </Button>
        </form>
      </div>
    </section>
  );
}
