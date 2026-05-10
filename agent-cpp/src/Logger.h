#pragma once
#include <mutex>
#include <string>

class Logger {
public:
  void Info(const std::string& message);
  void Warn(const std::string& message);
  void Error(const std::string& message);
  void Status(const std::string& status);
private:
  std::mutex mutex_;
  void Write(const std::string& level, const std::string& message);
};
