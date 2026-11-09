"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Send } from "lucide-react";
import { btnGold } from "@/components/portal/ui";

interface Result {
  sent: number;
  failed: number;
  remainingQueued: number;
  dailyRemaining: number;
  smtpConfigured: boolean;
  lastError?: string;
  error?: string;
}

// Drains the email queue in small batches from the browser, stopping at the daily quota.
export default function OutboxRunner({ queued }: { queued: number }) {
  const router = useRouter();
  const [running, setRunning] = useState(false);
  const [log, setLog] = useState("");

  async function run() {
    setRunning(true);
    let sent = 0;
    let failed = 0;
    try {
      for (let i = 0; i < 500; i++) {
        const res = await fetch("/api/admin/email/process", { method: "POST" });
        const r = (await res.json()) as Result;
        if (!res.ok) throw new Error(r.error ?? "Request failed");
        if (!r.smtpConfigured) {
          setLog("SMTP is not configured — save the SMTP settings first.");
          break;
        }
        sent += r.sent;
        failed += r.failed;
        setLog(`Sent ${sent}${failed ? `, ${failed} failed` : ""} · ${r.remainingQueued} still queued · ${r.dailyRemaining} left in today's quota${r.lastError ? ` · last error: ${r.lastError}` : ""}`);
        if (r.remainingQueued === 0) break;
        if (r.dailyRemaining <= 0) {
          setLog((l) => `${l}. Daily limit reached — the rest are sent automatically tomorrow.`);
          break;
        }
        if (r.sent === 0 && r.failed === 0) break;
      }
    } catch (e) {
      setLog(`Stopped: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setRunning(false);
      router.refresh();
    }
  }

  return (
    <div className="space-y-2">
      <button type="button" onClick={run} disabled={running || queued === 0} className={btnGold}>
        <Send className="h-4 w-4" /> {running ? "Sending…" : `Send queued emails (${queued})`}
      </button>
      {log && <p className="text-sm text-slate-600">{log}</p>}
    </div>
  );
}
