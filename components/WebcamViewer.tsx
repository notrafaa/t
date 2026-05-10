"use client";

import { Camera } from "lucide-react";
import { CommandButton } from "./CommandButton";
import { GlassCard } from "./GlassCard";

export function WebcamViewer({ deviceId }: { deviceId: string }) {
  return (
    <GlassCard>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-lg font-semibold"><Camera size={18} /> Webcam live</h3>
        <div className="flex gap-2">
          <CommandButton deviceId={deviceId} command="START_CAMERA_STREAM">Démarrer</CommandButton>
          <CommandButton deviceId={deviceId} command="STOP_CAMERA_STREAM" tone="danger">Arrêter</CommandButton>
        </div>
      </div>
      <video autoPlay playsInline className="aspect-video w-full rounded-xl border border-white/10 bg-black/45 object-cover" />
    </GlassCard>
  );
}
