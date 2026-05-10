#include "AudioCapture.h"

bool AudioCapture::StartMicrophone(const std::string&) {
  micRunning_ = true;
  // TODO: Use Media Foundation or WASAPI capture and send PCM to WebRTCClient.
  return true;
}

bool AudioCapture::StartSystemAudio(const std::string&) {
  systemRunning_ = true;
  // TODO: Use WASAPI loopback capture and send PCM to WebRTCClient.
  return true;
}

void AudioCapture::StopMicrophone() { micRunning_ = false; }
void AudioCapture::StopSystemAudio() { systemRunning_ = false; }
