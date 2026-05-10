import { NextResponse } from "next/server";
import { requireAdminJson } from "@/lib/auth";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminJson();
  if ("error" in auth) return auth.error;
  const { id } = await params;
  const { data, error } = await auth.supabase
    .from("device_logs")
    .select("*")
    .eq("device_id", id)
    .order("created_at", { ascending: false })
    .limit(200);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ logs: data });
}
