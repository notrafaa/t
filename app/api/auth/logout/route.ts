import { NextResponse } from "next/server";
import { clearAdminSessionCookie } from "@/lib/auth";

export async function POST(request: Request) {
  await clearAdminSessionCookie();
  return NextResponse.redirect(new URL("/login", request.url));
}
