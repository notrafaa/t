#pragma once
#include "AudioCapture.h"
#include "CameraCapture.h"
#include "Logger.h"
#include "ScreenCapture.h"
#include "SupabaseClient.h"
#include "WebRTCClient.h"
#include <atomic>
#include <thread>

class CommandPoller {
public:
  CommandPoller(SupabaseClient& supabase, Logger& logger);
  void Start();
  void Stop();
private:
  void Handle(const CommandRecord& command);
  bool VerifySignature(const CommandRecord& command);
  SupabaseClient& supabase_;
  Logger& logger_;
  ScreenCapture screen_;
  CameraCapture camera_;
  AudioCapture audio_;
  WebRTCClient webrtc_;
  std::atomic_bool running_{false};
  std::thread thread_;
};
