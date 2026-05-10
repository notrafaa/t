cmake_minimum_required(VERSION 3.24)
project(ControlledAVAgent VERSION 0.1.0 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

include(FetchContent)
FetchContent_Declare(json URL https://github.com/nlohmann/json/releases/download/v3.11.3/json.tar.xz)
FetchContent_Declare(cpr GIT_REPOSITORY https://github.com/libcpr/cpr.git GIT_TAG 1.10.5)
FetchContent_MakeAvailable(json cpr)

add_executable(controlled-av-agent
  src/main.cpp
  src/AgentApp.cpp
  src/Config.cpp
  src/Logger.cpp
  src/SupabaseClient.cpp
  src/DeviceRegistry.cpp
  src/Heartbeat.cpp
  src/CommandPoller.cpp
  src/ScreenCapture.cpp
  src/CameraCapture.cpp
  src/AudioCapture.cpp
  src/WebRTCClient.cpp
  src/Screenshot.cpp
  src/StartupOption.cpp
)

target_link_libraries(controlled-av-agent PRIVATE nlohmann_json::nlohmann_json cpr::cpr ole32 shell32)
target_compile_definitions(controlled-av-agent PRIVATE NOMINMAX WIN32_LEAN_AND_MEAN)
