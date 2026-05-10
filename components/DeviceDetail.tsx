import { RefreshCw, ScreenShare } from "lucide-react";
import { Device, DeviceLog } from "@/lib/types";
import { AudioPanel } from "./AudioPanel";
import { ApproveDeviceButton } from "./ApproveDeviceButton";
import { CommandButton } from "./CommandButton";
import { DeviceSelectors } from "./DeviceSelector";
import { GlassCard } from "./GlassCard";
import { LiveScreenViewer } from "./LiveScreenViewer";
import { LogsPanel } from "./LogsPanel";
import { WebcamViewer } from "./WebcamViewer";

export function DeviceDetail({ device, logs }: { device: Device; logs: DeviceLog[] }) {
  const caps = device.capabilities ?? {};
  return (
    <div className="space-y-5">
      <GlassCard>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-cyan-100/60">Device</p>
            <h1 className="mt-2 text-3xl font-semibold">{device.name}</h1>
            <p className="mt-1 text-white/55">{device.hostname} · {device.os} · agent {device.agent_version}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {!device.approved && <ApproveDeviceButton deviceId={device.id} />}
            <CommandButton deviceId={device.id} command="TAKE_SCREENSHOT"><ScreenShare size={15} /> Screenshot</CommandButton>
            <CommandButton deviceId={device.id} command="LIST_DEVICES"><RefreshCw size={15} /> Actualiser</CommandButton>
            <CommandButton deviceId={device.id} command="ENABLE_STARTUP_SHORTCUT">Startup ON</CommandButton>
            <CommandButton deviceId={device.id} command="DISABLE_STARTUP_SHORTCUT" tone="danger">Startup OFF</CommandButton>
          </div>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-4">
          <Metric label="Écrans" value={caps.screens?.length ?? 0} />
          <Metric label="Webcams" value={caps.cameras?.length ?? 0} />
          <Metric label="Micros" value={caps.microphones?.length ?? 0} />
          <Metric label="Audio outputs" value={caps.audioOutputs?.length ?? 0} />
        </div>
      </GlassCard>
      <DeviceSelectors device={device} />
      <div className="grid gap-5 xl:grid-cols-2">
        <LiveScreenViewer deviceId={device.id} />
        <WebcamViewer deviceId={device.id} />
      </div>
      <div className="grid gap-5 xl:grid-cols-2">
        <AudioPanel deviceId={device.id} />
        <LogsPanel deviceId={device.id} initialLogs={logs} />
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return <div className="rounded-xl border border-white/10 bg-black/20 p-4"><p className="text-sm text-white/50">{label}</p><p className="mt-1 text-2xl font-semibold">{value}</p></div>;
}
