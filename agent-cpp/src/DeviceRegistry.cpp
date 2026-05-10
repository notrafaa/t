#include "DeviceRegistry.h"
#include <Windows.h>
#include <string>
#include <vector>

std::string DeviceRegistry::Hostname() {
  char name[MAX_COMPUTERNAME_LENGTH + 1];
  DWORD size = sizeof(name);
  return GetComputerNameA(name, &size) ? std::string(name, size) : "windows-client";
}

std::string DeviceRegistry::WindowsVersion() {
  return "Windows 10/11";
}

nlohmann::json DeviceRegistry::Capabilities() {
  int screenCount = GetSystemMetrics(SM_CMONITORS);
  nlohmann::json screens = nlohmann::json::array();
  for (int i = 0; i < screenCount; ++i) {
    screens.push_back({{"id", "screen-" + std::to_string(i)}, {"name", "Display " + std::to_string(i + 1)}});
  }
  return {
    {"screens", screens},
    {"cameras", nlohmann::json::array({{{"id", "default-camera"}, {"name", "Default camera"}}})},
    {"microphones", nlohmann::json::array({{{"id", "default-microphone"}, {"name", "Default microphone"}}})},
    {"audioOutputs", nlohmann::json::array({{{"id", "default-output"}, {"name", "Default system audio"}}})}
  };
}
