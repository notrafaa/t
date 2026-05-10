"use client";

import { useRef } from "react";
import { MonitorPlay } from "lucide-react";
import { CommandButton } from "./CommandButton";
import { GlassCard } from "./GlassCard";

export function LiveScreenViewer({ deviceId }: { deviceId: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  return (
    <GlassCard>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-lg font-semibold"><MonitorPlay size={18} /> Écran live</h3>
        <div className="flex gap-2">
          <CommandButton deviceId={deviceId} command="START_SCREEN_STREAM">Démarrer</CommandButton>
          <CommandButton deviceId={deviceId} command="STOP_SCREEN_STREAM" tone="danger">Arrêter</CommandButton>
        </div>
      </div>
      <video ref={ref} autoPlay playsInline muted className="aspect-video w-full rounded-xl border border-white/10 bg-black/45 object-contain" />
      <p className="mt-3 text-xs text-white/45">WebRTC natif via signaling Supabase. Le flux n’est pas stocké en base.</p>
    </GlassCard>
  );
}
