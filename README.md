# Controlled AV Supervision

V1 visible et consentie de supervision audiovisuelle pour tournage en environnement controle.

## Structure

- `app/` dashboard Next.js App Router
- `components/` UI glassmorphism et panneaux temps reel
- `lib/` Supabase, session admin locale, audit, WebRTC signaling, signature commandes
- `supabase/migrations/0001_initial_schema.sql` schema, RLS et Storage
- `supabase/functions/agent-register` enregistrement initial d'un agent non approuve
- `supabase/functions/agent-token` JWT agent avec claim `device_id`
- `agent-cpp/` agent Windows C++ visible en console

## Supabase

1. Creer un projet Supabase.
2. Executer `supabase/migrations/0001_initial_schema.sql`.
3. Deployer les Edge Functions:

```bash
supabase functions deploy agent-register
supabase functions deploy agent-token
```

Secret necessaire cote Supabase:

```bash
supabase secrets set SUPABASE_JWT_SECRET=...
```

Le `SUPABASE_JWT_SECRET` est disponible dans les parametres JWT du projet Supabase.

## Variables Next.js

Copier `.env.example` vers `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_PUBLIC_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVER_ONLY_SERVICE_ROLE_KEY
COMMAND_SIGNING_SECRET=change-me-long-random-value
ADMIN_SESSION_SECRET=change-me-long-random-session-secret
ADMIN_PASSWORD_HASH=$2a$12$replace-with-bcrypt-hash
```

Generer le hash bcrypt du mot de passe admin:

```bash
node -e "const bcrypt=require('bcryptjs'); bcrypt.hash('votre-mot-de-passe', 12).then(console.log)"
```

Ne jamais exposer `SUPABASE_SERVICE_ROLE_KEY` dans le navigateur.

## Lancement Dashboard

```bash
npm install
npm run dev
```

Ouvrir `http://localhost:3000/login`, saisir le mot de passe admin, puis aller sur `/dashboard`.

Deploiement Vercel: ajouter les memes variables d'environnement, puis deployer le repo.

## Agent Windows C++

```powershell
cd agent-cpp
cmake -S . -B build
cmake --build build --config Release
Copy-Item config\agent.config.example.json build\Release\agent.config.json
```

Configurer `agent.config.json`:

- `supabaseUrl`
- `supabaseAnonKey`
- `deviceId`: UUID du device
- `deviceName`: nom visible
- `pairingCode`: code court affiche et valide
- `agentAccessToken`: JWT agent issu de `agent-token` apres approbation
- `commandSigningSecret`: meme valeur que `COMMAND_SIGNING_SECRET`

Lancer `controlled-av-agent.exe` dans une console visible. L'agent affiche le PC, l'OS, le device id, le pairing code, `CONNECTED`, puis les statuts `STREAMING SCREEN`, `STREAMING CAMERA`, `STREAMING AUDIO`, `STOPPED`.

## Pairing

1. Lancer l'agent sans `agentAccessToken`; il appelle `agent-register` et apparait dans `devices` avec `pairing_code`.
2. Depuis `/dashboard/devices/[id]`, cliquer `Approuver l'agent`.
3. Appeler l'Edge Function `agent-token` avec `deviceId` et `pairingCode`.
4. Copier le JWT retourne dans `agent.config.json` sous `agentAccessToken`.
5. Relancer l'agent.

## Securite

- Pas d'auth email pour l'admin.
- Dashboard protege par cookie httpOnly signe et mot de passe admin hashe cote serveur.
- Les routes dashboard utilisent `SUPABASE_SERVICE_ROLE_KEY` uniquement cote serveur.
- RLS active sur toutes les tables sensibles pour les agents.
- Les agents ne peuvent lire/ecrire que leur propre `device_id` via claim JWT.
- Les commandes sont creees cote serveur et signees.
- Aucun service cache, pas d'UAC bypass, pas de registre furtif.
- Startup uniquement via raccourci visible dans le dossier Startup utilisateur.
- Console visible et fermeture normale par Entree.

## WebRTC et Supabase

WebRTC sert aux flux video/audio pour eviter de pousser des images/audio continus dans la base. Supabase sert aux logs, a l'audit, aux heartbeats, aux commandes et au signaling WebRTC ponctuel: offer, answer et ICE candidates.

## Limites connues de la V1

- Le dashboard contient les surfaces WebRTC et le signaling, mais l'attachement complet des tracks depend de l'integration libwebrtc native cote agent.
- Les wrappers C++ `ScreenCapture`, `CameraCapture`, `AudioCapture` et `Screenshot` exposent les points d'integration surs avec TODO explicites.
- L'upload Storage des screenshots est prepare par la migration; l'agent ecrit actuellement un marqueur local jusqu'a l'implementation PNG native.
- Pour production, completer HMAC BCrypt cote agent, token refresh, libwebrtc native, Media Foundation, WASAPI loopback et Windows Graphics Capture/Desktop Duplication.
