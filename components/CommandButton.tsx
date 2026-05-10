"use client";

import { useState } from "react";
import { clsx } from "clsx";
import { CommandName, Json } from "@/lib/types";

export function CommandButton({
  deviceId,
  command,
  payload = {},
  children,
  tone = "default"
}: {
  deviceId: string;
  command: CommandName;
  payload?: Json;
  children: React.ReactNode;
  tone?: "default" | "danger";
}) {
  const [busy, setBusy] = useState(false);

  async function send() {
    setBusy(true);
    await fetch(`/api/devices/${deviceId}/commands`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ command, payload })
    });
    setBusy(false);
  }

  return (
    <button
      onClick={send}
      disabled={busy}
      className={clsx(
        "focus-ring rounded-xl border px-3 py-2 text-sm font-medium transition disabled:opacity-50",
        tone === "danger" ? "border-red-300/30 bg-red-500/15 text-red-50 hover:bg-red-500/25" : "border-white/12 bg-white/10 text-white hover:bg-white/16"
      )}
    >
      {busy ? "..." : children}
    </button>
  );
}
