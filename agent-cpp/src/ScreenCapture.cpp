#include "ScreenCapture.h"

bool ScreenCapture::Start(const std::string&) {
  running_ = true;
  // TODO: Replace this MVP state transition with Windows Graphics Capture or Desktop Duplication frames.
  return true;
}

void ScreenCapture::Stop() {
  running_ = false;
}
