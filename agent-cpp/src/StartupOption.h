#pragma once
#include <string>

class StartupOption {
public:
  static bool Enable(const std::string& executablePath);
  static bool Disable();
};
