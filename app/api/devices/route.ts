import { NextResponse } from "next/server";
import { requireAdminJson } from "@/lib/auth";

export async function GET() {
  const auth = await requireAdminJson();
  if ("error" in auth) return auth.error;
  const { data, error } = await auth.supabase.from("devices").select("*").order("updated_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ devices: data });
}
