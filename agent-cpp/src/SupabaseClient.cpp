#include "SupabaseClient.h"
#include <cpr/cpr.h>
#include <chrono>
#include <iostream>
#include <format>

SupabaseClient::SupabaseClient(AgentConfig config) : config_(std::move(config)) {}

cpr::Header SupabaseClient::Headers() const {
  const std::string token = config_.agentAccessToken.empty() ? config_.supabaseAnonKey : config_.agentAccessToken;
  return {
    {"apikey", config_.supabaseAnonKey},
    {"Authorization", "Bearer " + token},
    {"Content-Type", "application/json"},
    {"Prefer", "return=representation"}
  };
}

bool SupabaseClient::RegisterOrUpdateDevice(const nlohmann::json& capabilities) {
  nlohmann::json body = {
    {"deviceId", config_.deviceId},
    {"deviceName", config_.deviceName.empty() ? config_.deviceId : config_.deviceName},
     {"hostname", config_.deviceName},
     {"os", "Windows"},
     {"agentVersion", "0.1.0"},
     {"status", "ON"},
     {"pairingCode", config_.pairingCode},
     {"capabilities", capabilities}
  };

  if (config_.agentAccessToken.empty()) {
    auto res = cpr::Post(cpr::Url{config_.supabaseUrl + "/functions/v1/agent-register"},
                         cpr::Header{{"apikey", config_.supabaseAnonKey}, {"Authorization", "Bearer " + config_.supabaseAnonKey}, {"Content-Type", "application/json"}},
                         cpr::Body{body.dump()});
    return res.status_code >= 200 && res.status_code < 300;
  }

  body = {
    {"id", config_.deviceId},
    {"name", config_.deviceName.empty() ? config_.deviceId : config_.deviceName},
    {"hostname", config_.deviceName},
    {"os", "Windows"},
    {"agent_version", "0.1.0"},
    {"status", "ON"},
    {"pairing_code", config_.pairingCode},
    {"capabilities", capabilities}
  };

  auto res = cpr::Post(cpr::Url{config_.supabaseUrl + "/rest/v1/devices"},
                       Headers(),
                       cpr::Body{body.dump()},
                       cpr::Parameters{{"on_conflict", "id"}});
  return res.status_code >= 200 && res.status_code < 300;
}

bool SupabaseClient::Heartbeat(const nlohmann::json& capabilities) {
  const auto now = std::chrono::floor<std::chrono::seconds>(std::chrono::system_clock::now());
  nlohmann::json body = {{"status", "ON"}, {"last_seen_at", std::format("{:%FT%TZ}", now)}, {"capabilities", capabilities}};
  auto res = cpr::Patch(cpr::Url{config_.supabaseUrl + "/rest/v1/devices?id=eq." + config_.deviceId}, Headers(), cpr::Body{body.dump()});
  return res.status_code >= 200 && res.status_code < 300;
}

void SupabaseClient::Log(const std::string& level, const std::string& message, const nlohmann::json& metadata) {
  nlohmann::json body = {{"device_id", config_.deviceId}, {"level", level}, {"message", message}, {"metadata", metadata}};
  cpr::Post(cpr::Url{config_.supabaseUrl + "/rest/v1/device_logs"}, Headers(), cpr::Body{body.dump()});
}

std::optional<CommandRecord> SupabaseClient::NextCommand() {
  const auto url = config_.supabaseUrl + "/rest/v1/commands?device_id=eq." + config_.deviceId + "&status=eq.queued&order=created_at.asc&limit=1";
  auto res = cpr::Get(cpr::Url{url}, Headers());
  if (res.status_code < 200 || res.status_code >= 300) return std::nullopt;
  auto rows = nlohmann::json::parse(res.text, nullptr, false);
  if (!rows.is_array() || rows.empty()) return std::nullopt;
  return CommandRecord{rows[0]["id"].get<std::string>(), rows[0]["command"].get<std::string>(), rows[0].value("payload", nlohmann::json::object())};
}

void SupabaseClient::CompleteCommand(const std::string& id, bool ok, const nlohmann::json& result) {
  const auto now = std::chrono::floor<std::chrono::seconds>(std::chrono::system_clock::now());
  nlohmann::json body = {{"status", ok ? "completed" : "failed"}, {"result", result}, {"completed_at", std::format("{:%FT%TZ}", now)}};
  cpr::Patch(cpr::Url{config_.supabaseUrl + "/rest/v1/commands?id=eq." + id}, Headers(), cpr::Body{body.dump()});
}
