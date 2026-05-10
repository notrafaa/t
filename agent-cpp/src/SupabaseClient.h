#pragma once
#include "Config.h"
#include <cpr/cpr.h>
#include <nlohmann/json.hpp>
#include <optional>
#include <string>

struct CommandRecord {
  std::string id;
  std::string command;
  nlohmann::json payload;
};

class SupabaseClient {
public:
  explicit SupabaseClient(AgentConfig config);
  bool RegisterOrUpdateDevice(const nlohmann::json& capabilities);
  bool Heartbeat(const nlohmann::json& capabilities);
  void Log(const std::string& level, const std::string& message, const nlohmann::json& metadata = {});
  std::optional<CommandRecord> NextCommand();
  void CompleteCommand(const std::string& id, bool ok, const nlohmann::json& result);
  const AgentConfig& ConfigRef() const { return config_; }
private:
  AgentConfig config_;
  cpr::Header Headers() const;
};
