#pragma once
#include <string>

class Screenshot {
public:
  static bool CapturePng(const std::string& screenId, const std::string& outputPath, int& width, int& height);
};
