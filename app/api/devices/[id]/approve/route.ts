import { NextResponse } from "next/server";
import { requireAdminJson } from "@/lib/auth";
import { audit } from "@/lib/logger";

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminJson();
  if ("error" in auth) return auth.error;
  const { id } = await params;
  const { error } = await auth.supabase.from("devices").update({ approved: true }).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  await audit("DEVICE_APPROVED", auth.user.id, id);
  return NextResponse.json({ ok: true });
}
