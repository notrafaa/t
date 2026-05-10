#include "Screenshot.h"
#include <fstream>

bool Screenshot::CapturePng(const std::string&, const std::string& outputPath, int& width, int& height) {
  width = 0;
  height = 0;
  std::ofstream marker(outputPath, std::ios::binary);
  marker << "TODO: implement PNG bytes from Windows Graphics Capture or Desktop Duplication API.\n";
  return marker.good();
}
