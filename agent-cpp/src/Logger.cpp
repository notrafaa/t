#include "Logger.h"
#include <chrono>
#include <format>
#include <iostream>

void Logger::Info(const std::string& message) { Write("INFO", message); }
void Logger::Warn(const std::string& message) { Write("WARN", message); }
void Logger::Error(const std::string& message) { Write("ERROR", message); }
void Logger::Status(const std::string& status) { Write("STATUS", status); }

void Logger::Write(const std::string& level, const std::string& message) {
  std::lock_guard lock(mutex_);
  const auto now = std::chrono::floor<std::chrono::seconds>(std::chrono::system_clock::now());
  std::cout << std::format("[{:%F %T}] [{}] {}", now, level, message) << std::endl;
}
