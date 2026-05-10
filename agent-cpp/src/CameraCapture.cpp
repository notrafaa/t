#include "CameraCapture.h"

bool CameraCapture::Start(const std::string&) {
  running_ = true;
  // TODO: Initialize Media Foundation source reader and feed frames to WebRTCClient.
  return true;
}

void CameraCapture::Stop() {
  running_ = false;
}
