#pragma once
#include "CommandPoller.h"
#include "Heartbeat.h"
#include "Logger.h"
#include "SupabaseClient.h"

class AgentApp {
public:
  explicit AgentApp(AgentConfig config);
  int Run();
private:
  AgentConfig config_;
  Logger logger_;
};
