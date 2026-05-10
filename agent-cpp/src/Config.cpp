#include "Config.h"
#include <fstream>
#include <nlohmann/json.hpp>

using json = nlohmann::json;

AgentConfig Config::Load(const std::string& path) {
  std::ifstream in(path);
  if (!in) throw std::runtime_error("Missing agent.config.json");
  json j;
  in >> j;
  AgentConfig c;
  c.supabaseUrl = j.value("supabaseUrl", "");
  c.supabaseAnonKey = j.value("supabaseAnonKey", "");
  c.deviceId = j.value("deviceId", "");
  c.deviceName = j.value("deviceName", "");
  c.pairingCode = j.value("pairingCode", "");
  c.agentAccessToken = j.value("agentAccessToken", "");
  c.commandSigningSecret = j.value("commandSigningSecret", "");
  c.heartbeatIntervalMs = j.value("heartbeatIntervalMs", 3000);
  c.enableStartupShortcut = j.value("enableStartupShortcut", false);
  return c;
}

void Config::Save(const std::string& path, const AgentConfig& c) {
  json j = {
    {"supabaseUrl", c.supabaseUrl},
    {"supabaseAnonKey", c.supabaseAnonKey},
    {"deviceId", c.deviceId},
    {"deviceName", c.deviceName},
    {"pairingCode", c.pairingCode},
    {"agentAccessToken", c.agentAccessToken},
    {"commandSigningSecret", c.commandSigningSecret},
    {"heartbeatIntervalMs", c.heartbeatIntervalMs},
    {"enableStartupShortcut", c.enableStartupShortcut}
  };
  std::ofstream out(path);
  out << j.dump(2);
}
