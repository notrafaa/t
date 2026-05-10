import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";
import { SignJWT } from "https://deno.land/x/jose@v4.14.4/index.ts";

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
  }

  const { deviceId, pairingCode } = await req.json();
  const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const { data: device } = await supabase.from("devices").select("id,approved,pairing_code").eq("id", deviceId).single();

  if (!device || !device.approved || device.pairing_code !== pairingCode) {
    return new Response(JSON.stringify({ error: "Pairing refused" }), { status: 403 });
  }

  const secret = new TextEncoder().encode(Deno.env.get("SUPABASE_JWT_SECRET")!);
  const jwt = await new SignJWT({
    aud: "authenticated",
    role: "authenticated",
    device_id: device.id
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(device.id)
    .setIssuedAt()
    .setExpirationTime("12h")
    .sign(secret);

  return new Response(JSON.stringify({ access_token: jwt, token_type: "bearer", expires_in: 43200 }), {
    headers: { "content-type": "application/json" }
  });
});
