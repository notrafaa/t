import { createSupabaseAdminClient } from "./supabaseServer";
import { Json } from "./types";

export async function audit(action: string, adminId: string | null, targetDeviceId: string | null, metadata: Json = {}) {
  const supabase = createSupabaseAdminClient();
  await supabase.from("admin_audit_logs").insert({
    action,
    admin_id: adminId,
    target_device_id: targetDeviceId,
    metadata
  });
}
