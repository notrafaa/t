"use client";

import { Mic, Volume2 } from "lucide-react";
import { CommandButton } from "./CommandButton";
import { GlassCard } from "./GlassCard";

export function AudioPanel({ deviceId }: { deviceId: string }) {
  return (
    <GlassCard>
      <h3 className="mb-4 text-lg font-semibold">Audio live</h3>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-black/20 p-4">
          <Mic className="mb-3 text-cyan-100" />
          <div className="flex gap-2">
            <CommandButton deviceId={deviceId} command="START_MIC_STREAM">Micro</CommandButton>
            <CommandButton deviceId={deviceId} command="STOP_MIC_STREAM" tone="danger">Stop</CommandButton>
          </div>
        </div>
        <div className="rounded-xl border border-white/10 bg-black/20 p-4">
          <Volume2 className="mb-3 text-cyan-100" />
          <div className="flex gap-2">
            <CommandButton deviceId={deviceId} command="START_SYSTEM_AUDIO_STREAM">Système</CommandButton>
            <CommandButton deviceId={deviceId} command="STOP_SYSTEM_AUDIO_STREAM" tone="danger">Stop</CommandButton>
          </div>
        </div>
      </div>
      <audio autoPlay controls className="mt-4 w-full" />
    </GlassCard>
  );
}
