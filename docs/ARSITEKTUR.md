# Legion — Arsitektur

## Pembagian Proses

```
main (Node/CJS)             renderer (React)
├─ window, tray             ├─ UI + state
├─ SQLite (better-sqlite3)  └─ panggil window.legion.* via preload
├─ HTTP ke gateway             TIDAK menyentuh fs/child_process langsung
├─ spawn agent (fase 16)
└─ IPC handler
```

KEPUTUSAN: SEMUA akses DB, network, dan spawn HANYA di main process.
Renderer hanya lewat preload API (`contextIsolation: true`, `nodeIntegration: false`).
Alasan: keamanan Electron + satu sumber kebenaran.

## Kontrak IPC (nama channel final — jangan diubah tanpa migrasi)

| Channel | Arah | Fungsi |
|---|---|---|
| `bots:list` / `bots:get` / `bots:create` / `bots:update` / `bots:delete` | invoke | CRUD bot |
| `threads:list` / `threads:create` / `threads:update` / `threads:delete` | invoke | CRUD thread |
| `messages:list` / `messages:append` / `messages:deleteAfter` | invoke | pesan |
| `chat:stream` | invoke + event | streaming: `chat:delta`, `chat:done`, `chat:error`, abort |
| `gateway:models` / `gateway:test` | invoke | daftar model / tes koneksi |
| `settings:get` / `settings:set` | invoke | settings KV |
| `agent:start` / `agent:stop` | invoke | spawn CLI (fase 16) |
| `agent:event` | event | chunk output agent |
| `export:thread` / `export:all` / `import:all` | invoke | fase 18 |
| `app:ping` / `app:version` | invoke | scaffold (fase 02) |

## Skema Data (versi 1)

```sql
bots(
  id INTEGER PK, name TEXT NOT NULL, avatar TEXT, model_id TEXT,
  system_prompt TEXT, temperature REAL DEFAULT 0.7,
  connection_type TEXT DEFAULT 'gateway',   -- gateway|custom|agent
  custom_url TEXT, custom_key TEXT, custom_model TEXT,
  agent_command TEXT, agent_cwd TEXT,
  accent_color TEXT, created_at TEXT NOT NULL
)
threads(
  id INTEGER PK, bot_id INTEGER NOT NULL REFERENCES bots(id) ON DELETE CASCADE,
  title TEXT NOT NULL, created_at TEXT NOT NULL, updated_at TEXT NOT NULL
)
messages(
  id INTEGER PK, thread_id INTEGER NOT NULL REFERENCES threads(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK(role IN ('user','assistant','system')),
  content TEXT NOT NULL, model TEXT, tokens_in INTEGER, tokens_out INTEGER,
  created_at TEXT NOT NULL
)
settings(key TEXT PK, value TEXT)
```
Catatan: attachment (fase 19) menambah tabel `attachments`, bukan mengubah `messages`.
Migrasi 2 (fase 18) menambah `prompt_templates`. Indeks: `idx_threads_bot(bot_id, updated_at DESC)`,
`idx_messages_thread(thread_id, id)`.

## Keputusan Teknis

- **D1** better-sqlite3 sinkron di main; query kecil, tidak perlu worker.
- **D2** SSE parser manual (tanpa library) — sederhana + terkontrol.
- **D3** Markdown render di renderer dengan sanitasi (DOMPurify) sebelum `dangerouslySetInnerHTML`.
- **D4** Model list di-cache 60 detik; tombol refresh manual.
- **D5** Semua timestamp ISO 8601 UTC string.

## Stack (terkunci)

Electron stabil, main process CommonJS (`.cjs`), React 18 + Vite + Tailwind CSS,
better-sqlite3 (main process, via IPC), fetch + ReadableStream (SSE),
marked + highlight.js + DOMPurify, electron-builder (NSIS Windows x64).
DILARANG: backend cloud, telemetri, akun/login online, framework lain tanpa izin.

## Tooling & Data

- Dev orchestration: `concurrently` + `wait-on` (pilihan stabil, dicatat di README fase 02).
- Data dir: dev = `D:\Legion\data`, prod = `%APPDATA%\Legion\data` (dipisah).
- Log: `%APPDATA%\Legion\logs\legion-YYYYMMDD.log`, rotasi 7 file / 5 MB.
- DPI: tidak ada zoom paksa; hormati skala Windows (125%/150%).

## Error Mapping (gateway → UI)

| Upstream | Kode UI | Pesan |
|---|---|---|
| HTTP 401/403 | `auth_invalid` | "API key gateway ditolak." |
| HTTP 404 | `model_not_found` | "Model tidak tersedia." |
| HTTP 429 | `rate_limited` | "Bot istirahat (cooldown)." + retryAfterMs |
| HTTP 5xx | `upstream_unavailable` | "Layanan upstream gangguan." |
| network/ECONN | `gateway_down` | "Gateway tidak bisa dihubungi." |
| abort | `aborted` | bukan error; pesan parsial disimpan |
