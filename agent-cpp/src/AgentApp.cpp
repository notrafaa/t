#include "AgentApp.h"
#include "DeviceRegistry.h"
#include <iostream>

AgentApp::AgentApp(AgentConfig config) : config_(std::move(config)) {}

int AgentApp::Run() {
  logger_.Info("Controlled AV Agent 0.1.0 starting in visible console mode");
  logger_.Info("PC name: " + DeviceRegistry::Hostname());
  logger_.Info("Windows version: " + DeviceRegistry::WindowsVersion());
  logger_.Info("Device id: " + config_.deviceId);
  if (!config_.pairingCode.empty()) logger_.Info("Pairing code: " + config_.pairingCode);

  SupabaseClient supabase(config_);
  if (!supabase.RegisterOrUpdateDevice(DeviceRegistry::Capabilities())) {
    logger_.Warn("Supabase registration failed. Check config and RLS/JWT.");
  }

  Heartbeat heartbeat(supabase, logger_, config_.heartbeatIntervalMs);
  CommandPoller poller(supabase, logger_);
  heartbeat.Start();
  poller.Start();

  logger_.Status("CONNECTED");
  logger_.Info("Press ENTER to stop the agent normally.");
  std::cin.get();

  poller.Stop();
  heartbeat.Stop();
  logger_.Status("STOPPED");
  return 0;
}
