import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { audit } from "@/lib/logger";
import { setAdminSessionCookie } from "@/lib/auth";

const schema = z.object({ password: z.string().min(8) });

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
  const hash = process.env.ADMIN_PASSWORD_HASH;
  if (!hash) {
    return NextResponse.json({ error: "Missing ADMIN_PASSWORD_HASH" }, { status: 500 });
  }
  const ok = await bcrypt.compare(parsed.data.password, hash);
  if (!ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await setAdminSessionCookie();
  await audit("ADMIN_LOGIN", null, null, { mode: "local_password" });
  return NextResponse.json({ ok: true });
}
