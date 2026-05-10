import { supabaseClient } from "./supabaseClient";

export type SignalPayload = {
  sessionId: string;
  deviceId: string;
  sender: "dashboard" | "agent";
  receiver: "dashboard" | "agent";
  type: "offer" | "answer" | "ice";
  payload: unknown;
};

export function createPeerConnection(onTrack: (event: RTCTrackEvent) => void) {
  const pc = new RTCPeerConnection({
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
  });
  pc.ontrack = onTrack;
  return pc;
}

export async function publishSignal(signal: SignalPayload) {
  await supabaseClient.from("webrtc_signals").insert({
    device_id: signal.deviceId,
    session_id: signal.sessionId,
    sender: signal.sender,
    receiver: signal.receiver,
    type: signal.type,
    payload: signal.payload
  });
}

export function subscribeSignals(deviceId: string, sessionId: string, handler: (payload: SignalPayload) => void) {
  const channel = supabaseClient
    .channel(`signals:${deviceId}:${sessionId}`)
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "webrtc_signals", filter: `device_id=eq.${deviceId}` },
      (event) => {
        const row = event.new as Record<string, unknown>;
        if (row.session_id === sessionId && row.receiver === "dashboard") {
          handler({
            sessionId,
            deviceId,
            sender: "agent",
            receiver: "dashboard",
            type: row.type as SignalPayload["type"],
            payload: row.payload
          });
        }
      }
    )
    .subscribe();
  return () => supabaseClient.removeChannel(channel);
}
