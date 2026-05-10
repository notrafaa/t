export type Json = Record<string, unknown> | unknown[] | string | number | boolean | null;

export type DeviceStatus = "OFF" | "ON" | "STREAMING" | "STOPPED";

export type Device = {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  hostname: string;
  os: string;
  agent_version: string;
  status: DeviceStatus | string;
  approved: boolean;
  pairing_code: string | null;
  last_seen_at: string | null;
  capabilities: {
    screens?: Array<{ id: string; name: string; width?: number; height?: number }>;
    cameras?: Array<{ id: string; name: string }>;
    microphones?: Array<{ id: string; name: string }>;
    audioOutputs?: Array<{ id: string; name: string }>;
  } | null;
  selected_screen: string | null;
  selected_camera: string | null;
  selected_microphone: string | null;
  selected_audio_output: string | null;
};

export type DeviceLog = {
  id: string;
  created_at: string;
  device_id: string;
  level: "debug" | "info" | "warn" | "error" | string;
  message: string;
  metadata: Json;
};

export type CommandName =
  | "LIST_DEVICES"
  | "START_SCREEN_STREAM"
  | "STOP_SCREEN_STREAM"
  | "START_CAMERA_STREAM"
  | "STOP_CAMERA_STREAM"
  | "START_MIC_STREAM"
  | "STOP_MIC_STREAM"
  | "START_SYSTEM_AUDIO_STREAM"
  | "STOP_SYSTEM_AUDIO_STREAM"
  | "TAKE_SCREENSHOT"
  | "SET_SELECTED_SCREEN"
  | "SET_SELECTED_CAMERA"
  | "SET_SELECTED_MICROPHONE"
  | "SET_SELECTED_AUDIO_OUTPUT"
  | "ENABLE_STARTUP_SHORTCUT"
  | "DISABLE_STARTUP_SHORTCUT";

export type Command = {
  id: string;
  created_at: string;
  device_id: string;
  command: CommandName | string;
  payload: Json;
  status: "queued" | "running" | "completed" | "failed" | string;
  result: Json;
  completed_at: string | null;
};

export type AuditLog = {
  id: string;
  created_at: string;
  admin_id: string | null;
  action: string;
  target_device_id: string | null;
  metadata: Json;
};
