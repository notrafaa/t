import crypto from "node:crypto";
import { CommandName, Json } from "./types";

export function makePairingCode() {
  return crypto.randomBytes(4).toString("hex").toUpperCase();
}

export function signCommand(deviceId: string, commandId: string, command: CommandName | string, payload: Json) {
  const secret = process.env.COMMAND_SIGNING_SECRET;
  if (!secret) {
    throw new Error("Missing COMMAND_SIGNING_SECRET");
  }
  const body = JSON.stringify({ deviceId, commandId, command, payload });
  return crypto.createHmac("sha256", secret).update(body).digest("hex");
}

export function timingSafeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}
