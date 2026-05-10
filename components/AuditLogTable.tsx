import { AuditLog } from "@/lib/types";
import { GlassCard } from "./GlassCard";

export function AuditLogTable({ logs }: { logs: AuditLog[] }) {
  return (
    <GlassCard>
      <h1 className="mb-5 text-2xl font-semibold">Audit admin</h1>
      <div className="overflow-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="text-white/45">
            <tr><th className="py-3">Date</th><th>Action</th><th>Device</th><th>Metadata</th></tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="border-t border-white/8">
                <td className="py-3 text-white/60">{new Date(log.created_at).toLocaleString()}</td>
                <td className="font-medium">{log.action}</td>
                <td className="text-white/60">{log.target_device_id ?? "-"}</td>
                <td className="font-mono text-xs text-white/55">{JSON.stringify(log.metadata)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </GlassCard>
  );
}
