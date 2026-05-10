#pragma once
#include <nlohmann/json.hpp>
#include <string>

class DeviceRegistry {
public:
  static std::string Hostname();
  static std::string WindowsVersion();
  static nlohmann::json Capabilities();
};
