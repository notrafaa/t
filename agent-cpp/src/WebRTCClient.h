#pragma once
#include "SupabaseClient.h"
#include <string>

class WebRTCClient {
public:
  explicit WebRTCClient(SupabaseClient& supabase);
  bool StartSession(const std::string& mediaKind);
  void StopSession(const std::string& mediaKind);
private:
  SupabaseClient& supabase_;
};
