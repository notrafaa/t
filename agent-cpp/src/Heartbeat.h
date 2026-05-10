#pragma once
#include "DeviceRegistry.h"
#include "Logger.h"
#include "SupabaseClient.h"
#include <atomic>
#include <thread>

class Heartbeat {
public:
  Heartbeat(SupabaseClient& supabase, Logger& logger, int intervalMs);
  void Start();
  void Stop();
private:
  SupabaseClient& supabase_;
  Logger& logger_;
  int intervalMs_;
  std::atomic_bool running_{false};
  std::thread thread_;
};
