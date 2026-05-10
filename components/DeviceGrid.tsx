import { Device } from "@/lib/types";
import { DeviceCard } from "./DeviceCard";

export function DeviceGrid({ devices }: { devices: Device[] }) {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {devices.map((device) => <DeviceCard key={device.id} device={device} />)}
      {devices.length === 0 && <p className="text-white/60">Aucun agent enregistré pour le moment.</p>}
    </div>
  );
}
