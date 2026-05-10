import Link from "next/link";
import { Monitor, Radio, ShieldCheck, ShieldAlert } from "lucide-react";
import { Device } from "@/lib/types";
import { GlassCard } from "./GlassCard";

export function DeviceCard({ device }: { device: Device }) {
  const online = device.last_seen_at && Date.now() - new Date(device.last_seen_at).getTime() < 10_000;
  const caps = device.capabilities ?? {};
  return (
    <Link href={`/dashboard/devices/${device.id}`}>
      <GlassCard className="group min-h-56 transition hover:-translate-y-1 hover:border-cyan-200/35">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-white">{device.name || device.hostname}</h2>
            <p className="mt-1 text-sm text-white/55">{device.hostname}</p>
          </div>
          {device.approved ? <ShieldCheck className="text-emerald-200" /> : <ShieldAlert className="text-amber-200" />}
        </div>
        <div className="mt-6 flex items-center gap-3">
          <span className={`h-3 w-3 rounded-full ${online ? "bg-emerald-300 shadow-[0_0_18px_rgba(110,231,183,.8)]" : "bg-white/25"}`} />
          <span className="text-sm font-medium">{online ? "ON" : "OFF"}</span>
          <span className="text-sm text-white/45">{device.status}</span>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3 text-sm text-white/70">
          <div className="rounded-xl border border-white/10 bg-black/15 p-3"><Monitor size={16} /> {caps.screens?.length ?? 0} écrans</div>
          <div className="rounded-xl border border-white/10 bg-black/15 p-3"><Radio size={16} /> {(caps.cameras?.length ?? 0) + (caps.microphones?.length ?? 0)} AV</div>
        </div>
        {!device.approved && <p className="mt-5 rounded-xl border border-amber-200/20 bg-amber-300/10 px-3 py-2 text-sm text-amber-50">Pairing: {device.pairing_code ?? "en attente"}</p>}
      </GlassCard>
    </Link>
  );
}
