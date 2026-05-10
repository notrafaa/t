import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "node:crypto";
import { createSupabaseAdminClient } from "./supabaseServer";

const COOKIE_NAME = "admin_session";

function sessionSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error("Missing ADMIN_SESSION_SECRET");
  }
  return secret;
}

function sign(value: string) {
  return crypto.createHmac("sha256", sessionSecret()).update(value).digest("hex");
}

export function createAdminSessionValue() {
  const payload = Buffer.from(JSON.stringify({ role: "admin", iat: Date.now() })).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export async function setAdminSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, createAdminSessionValue(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12
  });
}

export async function clearAdminSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function isAdminSessionValid() {
  const cookieStore = await cookies();
  const value = cookieStore.get(COOKIE_NAME)?.value;
  if (!value) return false;
  const [payload, signature] = value.split(".");
  if (!payload || !signature) return false;
  const expected = sign(payload);
  const left = Buffer.from(signature);
  const right = Buffer.from(expected);
  if (left.length !== right.length || !crypto.timingSafeEqual(left, right)) return false;
  try {
    const decoded = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { role?: string; iat?: number };
    return decoded.role === "admin" && typeof decoded.iat === "number" && Date.now() - decoded.iat < 12 * 60 * 60 * 1000;
  } catch {
    return false;
  }
}

export async function requireAdmin() {
  if (!(await isAdminSessionValid())) {
    redirect("/login");
  }
  return { supabase: createSupabaseAdminClient(), user: { id: null as string | null } };
}

export async function requireAdminJson() {
  if (!(await isAdminSessionValid())) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  return { supabase: createSupabaseAdminClient(), user: { id: null as string | null } };
}
