#include "StartupOption.h"
#include <Windows.h>
#include <ShlObj.h>
#include <filesystem>
#include <fstream>

static std::filesystem::path StartupShortcutPath() {
  PWSTR path = nullptr;
  SHGetKnownFolderPath(FOLDERID_Startup, 0, nullptr, &path);
  std::filesystem::path startup(path);
  CoTaskMemFree(path);
  return startup / "Controlled AV Agent.url";
}

bool StartupOption::Enable(const std::string& executablePath) {
  auto path = StartupShortcutPath();
  std::ofstream out(path);
  out << "[InternetShortcut]\nURL=file:///" << executablePath << "\n";
  return out.good();
}

bool StartupOption::Disable() {
  auto path = StartupShortcutPath();
  std::error_code ec;
  std::filesystem::remove(path, ec);
  return !ec;
}
