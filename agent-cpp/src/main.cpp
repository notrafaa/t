#include "AgentApp.h"
#include "Config.h"
#include <iostream>

int main() {
  try {
    auto config = Config::Load("agent.config.json");
    AgentApp app(config);
    return app.Run();
  } catch (const std::exception& ex) {
    std::cerr << "[FATAL] " << ex.what() << std::endl;
    std::cerr << "Create agent.config.json from config/agent.config.example.json and relaunch." << std::endl;
    return 1;
  }
}
