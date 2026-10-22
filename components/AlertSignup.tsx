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
      className="flex scroll-mt-6 flex-col gap-4 rounded-control border border-border bg-surface p-6 md:flex-row md:items-center md:gap-6"
    >
      <div className="flex flex-1 flex-col gap-1">
        <h2 className="text-lg font-semibold">A little less searching.</h2>
        <p className="text-[13px] text-muted" aria-live="polite">
          {status === "done"
            ? "Thanks. We'll email you new openings."
            : status === "error"
              ? "Something went wrong. Check your email and try again."
              : "Get new openings delivered to your inbox."}
        </p>
      </div>
      <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          aria-label="Your email address"
          className="h-[45px] w-full rounded-control border border-border bg-transparent px-3 text-[13px] text-text placeholder:text-muted sm:w-[220px]"
        />
        <Button type="submit" disabled={status === "sending"}>
          Get job alerts
        </Button>
      </form>
    </section>
  );
}
