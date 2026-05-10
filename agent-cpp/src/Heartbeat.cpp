#include "Heartbeat.h"
#include <chrono>

Heartbeat::Heartbeat(SupabaseClient& supabase, Logger& logger, int intervalMs) : supabase_(supabase), logger_(logger), intervalMs_(intervalMs) {}

void Heartbeat::Start() {
  running_ = true;
  thread_ = std::thread([this] {
    while (running_) {
      if (supabase_.Heartbeat(DeviceRegistry::Capabilities())) {
        logger_.Status("CONNECTED");
      } else {
        logger_.Warn("Heartbeat failed");
      }
      std::this_thread::sleep_for(std::chrono::milliseconds(intervalMs_));
    }
  });
}

void Heartbeat::Stop() {
  running_ = false;
  if (thread_.joinable()) thread_.join();
}
