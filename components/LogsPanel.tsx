"use client";

import { useEffect, useState } from "react";
import { DeviceLog } from "@/lib/types";
import { GlassCard } from "./GlassCard";

export function LogsPanel({ deviceId, initialLogs }: { deviceId: string; initialLogs: DeviceLog[] }) {
  const [logs, setLogs] = useState(initialLogs);

  useEffect(() => {
    const interval = window.setInterval(async () => {
      const res = await fetch(`/api/devices/${deviceId}/logs`, { cache: "no-store" });
      if (res.ok) {
        const data = (await res.json()) as { logs: DeviceLog[] };
        setLogs(data.logs);
      }
    }, 2500);
    return () => {
      window.clearInterval(interval);
    };
  }, [deviceId]);

  return (
    <GlassCard className="h-96 overflow-hidden">
      <h3 className="mb-4 text-lg font-semibold">Logs temps réel</h3>
      <div className="h-[19rem] overflow-auto rounded-xl bg-black/30 p-3 font-mono text-xs text-white/75">
        {logs.map((log) => (
          <div key={log.id} className="border-b border-white/5 py-2">
            <span className="text-cyan-200">{new Date(log.created_at).toLocaleTimeString()}</span> [{log.level}] {log.message}
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
