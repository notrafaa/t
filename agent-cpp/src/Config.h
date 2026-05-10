#pragma once
#include <string>

struct AgentConfig {
  std::string supabaseUrl;
  std::string supabaseAnonKey;
  std::string deviceId;
  std::string deviceName;
  std::string pairingCode;
  std::string agentAccessToken;
  std::string commandSigningSecret;
  int heartbeatIntervalMs = 3000;
  bool enableStartupShortcut = false;
};

class Config {
public:
  static AgentConfig Load(const std::string& path);
  static void Save(const std::string& path, const AgentConfig& config);
};
