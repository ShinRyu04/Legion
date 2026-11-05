# Legion

Aplikasi desktop Windows (Electron) berisi banyak bot AI dalam satu jendela.
Satu bot = preset: nama + avatar + model + system prompt + temperature.

Tiga tipe koneksi bot:
- **gateway** — lewat 9router-pro lokal (OpenAI-compatible), default.
- **custom** — endpoint OpenAI-compatible lain (URL + key sendiri).
- **agent** — spawn CLI agent lokal, output menjadi jawaban bot.

Data 100% lokal (SQLite). Streaming wajib, bisa di-stop. UI Bahasa Indonesia.

## Struktur

```
D:\Legion\
  docs/           PRD + arsitektur + laporan QA
  electron/       main process (.cjs): window, DB, gateway, agent, tray
  src/            renderer React
  data/           runtime dev (legion.db) - JANGAN commit
  dist/           hasil build - JANGAN commit
```

## Dev

```bash
npm install
npm run dev      # vite + electron (concurrently + wait-on)
```

## Build

```bash
npm run build    # vite build (renderer)
npm run dist     # electron-builder --win nsis -> dist/Legion Setup <versi>.exe
```

## Keputusan Tooling

- **concurrently + wait-on** untuk `npm run dev` (bukan vite-plugin-electron):
  paling stabil lintas versi Vite/Electron, sedikit magic, mudah di-debug
  (log vite dan electron terpisah jelas).
- better-sqlite3 dijalankan di main process; kalau ABI mismatch:
  `npx electron-rebuild -f -w better-sqlite3`.
- Tanpa router library; React context + useReducer.
- SSE parser manual (tanpa library); fetch bawaan Node (undici).

## Tema

Token warna di `src/styles/tokens.css` (`:root[data-theme="dark"|"light"]`).
Komponen hanya memakai `var(--*)`, dilarang hex langsung di JSX.
Ganti tema tanpa menyentuh komponen: ThemeProvider set `document.documentElement.dataset.theme`.
Menambah token: tambah di kedua blok dark/light, jaga kontras teks >= 4.5:1.

## Batasan

- Gateway default `http://127.0.0.1:20133/v1` (9router-pro lokal).
- API key disimpan plaintext di settings DB lokal (app pribadi), selalu dimask di UI,
  tidak pernah ditulis ke log, tidak diekspor default.
- Installer unsigned: SmartScreen Windows akan menampilkan peringatan
  ("Windows protected your PC"). Pilih "More info" -> "Run anyway".
  Jangan mematikan antivirus untuk ini.
