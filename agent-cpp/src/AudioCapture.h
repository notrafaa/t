#pragma once
#include <string>

class AudioCapture {
public:
  bool StartMicrophone(const std::string& microphoneId);
  bool StartSystemAudio(const std::string& outputId);
  void StopMicrophone();
  void StopSystemAudio();
private:
  bool micRunning_ = false;
  bool systemRunning_ = false;
};
