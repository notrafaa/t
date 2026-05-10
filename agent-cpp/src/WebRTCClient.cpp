#include "WebRTCClient.h"

WebRTCClient::WebRTCClient(SupabaseClient& supabase) : supabase_(supabase) {}

bool WebRTCClient::StartSession(const std::string& mediaKind) {
  supabase_.Log("info", "WebRTC session requested", {{"mediaKind", mediaKind}});
  // TODO: Link libwebrtc native, create PeerConnection, exchange offer/answer/ICE through webrtc_signals.
  return true;
}

void WebRTCClient::StopSession(const std::string& mediaKind) {
  supabase_.Log("info", "WebRTC session stopped", {{"mediaKind", mediaKind}});
}
