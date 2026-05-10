import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
  }

  const body = await req.json();
  const deviceId = String(body.deviceId ?? "");
  const pairingCode = String(body.pairingCode ?? "");
  if (!deviceId || !pairingCode || pairingCode.length < 6) {
    return new Response(JSON.stringify({ error: "Invalid pairing payload" }), { status: 400 });
  }

  const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const { error } = await supabase.from("devices").upsert({
    id: deviceId,
    name: body.deviceName ?? body.hostname ?? "Windows client",
    hostname: body.hostname ?? "Windows client",
    os: body.os ?? "Windows",
    agent_version: body.agentVersion ?? "0.1.0",
    status: "ON",
    approved: false,
    pairing_code: pairingCode,
    capabilities: body.capabilities ?? {},
    last_seen_at: new Date().toISOString()
  });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
  return new Response(JSON.stringify({ ok: true }), { headers: { "content-type": "application/json" } });
});
