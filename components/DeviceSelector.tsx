"use client";

import { useState } from "react";
import { CommandName, Device } from "@/lib/types";
import { CommandButton } from "./CommandButton";

export function DeviceSelector({ label, value, items, command, deviceId }: { label: string; value: string | null; items: Array<{ id: string; name: string }>; command: CommandName; deviceId: string }) {
  const [selected, setSelected] = useState(value ?? "");
  return (
    <div className="rounded-xl border border-white/10 bg-black/20 p-3">
      <p className="mb-2 text-xs uppercase tracking-[0.16em] text-white/45">{label}</p>
      <select className="focus-ring mb-3 w-full rounded-lg border border-white/10 bg-slate-950/80 px-3 py-2 text-sm" value={selected} onChange={(event) => setSelected(event.target.value)}>
        <option value="">Non sélectionné</option>
        {items.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
      </select>
      <CommandButton deviceId={deviceId} command={command} payload={{ value: selected }}>Appliquer</CommandButton>
    </div>
  );
}

export function DeviceSelectors({ device }: { device: Device }) {
  const caps = device.capabilities ?? {};
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      <DeviceSelector label="Écran" deviceId={device.id} value={device.selected_screen} items={caps.screens ?? []} command="SET_SELECTED_SCREEN" />
      <DeviceSelector label="Caméra" deviceId={device.id} value={device.selected_camera} items={caps.cameras ?? []} command="SET_SELECTED_CAMERA" />
      <DeviceSelector label="Micro" deviceId={device.id} value={device.selected_microphone} items={caps.microphones ?? []} command="SET_SELECTED_MICROPHONE" />
      <DeviceSelector label="Sortie audio" deviceId={device.id} value={device.selected_audio_output} items={caps.audioOutputs ?? []} command="SET_SELECTED_AUDIO_OUTPUT" />
    </div>
  );
}
