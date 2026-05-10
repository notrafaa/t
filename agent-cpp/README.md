# Controlled AV Agent

Agent Windows C++ visible et consentant pour le dashboard Controlled AV Supervision.

## Build

```powershell
cmake -S . -B build
cmake --build build --config Release
Copy-Item config\agent.config.example.json build\Release\agent.config.json
```

## Exécution

Lancer `controlled-av-agent.exe` depuis une console. Le programme affiche tous les logs et peut être fermé normalement avec Entrée.

## Configuration

Voir `config/agent.config.example.json`.

`ENABLE_STARTUP_SHORTCUT` crée uniquement un raccourci `.url` dans le dossier Startup de l’utilisateur courant. `DISABLE_STARTUP_SHORTCUT` le supprime. Aucun service, aucune persistance cachée.

## Points à compléter

- `WebRTCClient`: intégrer libwebrtc native et utiliser `webrtc_signals`.
- `ScreenCapture`: Windows Graphics Capture ou Desktop Duplication API.
- `CameraCapture`: Media Foundation.
- `AudioCapture`: Media Foundation micro et WASAPI loopback.
- `Screenshot`: encoder PNG et uploader dans Supabase Storage.
- `CommandPoller::VerifySignature`: HMAC-SHA256 complet avec BCrypt.
