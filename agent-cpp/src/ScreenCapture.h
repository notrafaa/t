#pragma once
#include <string>

class ScreenCapture {
public:
  bool Start(const std::string& screenId);
  void Stop();
  bool Running() const { return running_; }
private:
  bool running_ = false;
};
