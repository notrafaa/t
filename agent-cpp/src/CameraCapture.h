#pragma once
#include <string>

class CameraCapture {
public:
  bool Start(const std::string& cameraId);
  void Stop();
private:
  bool running_ = false;
};
