import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminJson } from "@/lib/auth";
import { audit } from "@/lib/logger";
import { signCommand } from "@/lib/security";
import { CommandName } from "@/lib/types";

const schema = z.object({
  command: z.string().min(2),
  payload: z.unknown().default({})
});

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminJson();
  if ("error" in auth) return auth.error;
  const { id } = await params;
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const { data: device } = await auth.supabase.from("devices").select("approved").eq("id", id).single();
  if (!device?.approved) return NextResponse.json({ error: "Device is not approved" }, { status: 403 });
  const cleanPayload =
    parsed.data.payload && typeof parsed.data.payload === "object" && !Array.isArray(parsed.data.payload)
      ? (parsed.data.payload as Record<string, unknown>)
      : {};

  const insert = {
    device_id: id,
    command: parsed.data.command,
    payload: cleanPayload,
    status: "queued"
  };
  const { data, error } = await auth.supabase.from("commands").insert(insert).select("*").single();
  if (error || !data) return NextResponse.json({ error: error?.message ?? "Insert failed" }, { status: 500 });

  const signature = signCommand(id, data.id, parsed.data.command as CommandName, cleanPayload);
  await auth.supabase.from("commands").update({ payload: { ...cleanPayload, signature } }).eq("id", data.id);
  await audit(`COMMAND_${parsed.data.command}`, auth.user.id, id, { commandId: data.id });
  return NextResponse.json({ command: { ...data, payload: { ...cleanPayload, signature } } });
}
