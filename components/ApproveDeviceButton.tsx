"use client";

import { useState } from "react";

export function ApproveDeviceButton({ deviceId }: { deviceId: string }) {
  const [busy, setBusy] = useState(false);
  async function approve() {
    setBusy(true);
    const res = await fetch(`/api/devices/${deviceId}/approve`, { method: "POST" });
    setBusy(false);
    if (res.ok) window.location.reload();
  }
  return (
    <button onClick={approve} disabled={busy} className="focus-ring rounded-xl bg-emerald-200 px-4 py-2 text-sm font-semibold text-slate-950 disabled:opacity-50">
      {busy ? "Approbation..." : "Approuver l'agent"}
    </button>
  );
}
