# Legion — PRD

Aplikasi desktop Windows (Electron) berisi banyak bot AI dalam satu jendela.
Satu bot = preset: nama + avatar + model + system prompt + temperature.
FOLDER KODE: `D:\Legion`. UI Bahasa Indonesia, komentar kode Inggris.

## Ruang Lingkup

### IN
- Satu jendela app: sidebar bot + thread, area chat streaming, composer.
- Sejarah chat 100% lokal (SQLite).
- Tiga tipe koneksi bot (dirilis bertahap):
  - **A. gateway** — lewat 9router-pro lokal (OpenAI-compatible), default.
  - **B. custom** — endpoint OpenAI-compatible lain (URL + key sendiri).
  - **C. agent** — spawn CLI agent lokal, output menjadi jawaban bot.
- CRUD bot + thread, settings gateway, tray + global shortcut,
  export/import, search global, prompt library, lampiran gambar (vision).
- Installer NSIS Windows x64.

### OUT (tidak dikerjakan)
- Login/akun online, sinkronisasi cloud, telemetri.
- Multi-user / kolaborasi.
- Auto-update diam-diam.
- Mengubah config opencode/omp atau layanan lain di mesin (hanya baca).
- Backend cloud apa pun. Semua data lokal.

## Layar & Navigasi

| Kode | Layar | Isi |
|------|-------|-----|
| L1 | Main | sidebar (bot + thread) \| chat area \| composer |
| L2 | Bot Editor | modal/drawer dari L1 (nama, avatar, model, prompt, temp, aksen, tipe koneksi) |
| L3 | Settings | tab: Gateway, Tampilan, Data |
| L4 | Command Palette (Ctrl+K) | search global + lompat pesan (fase 18) |

### State UI minimal
```js
{
  activeBotId, activeThreadId,
  view: 'chat' | 'settings',
  modal: null | 'botEditor',
  gateway: { ok, modelsCount, lastCheck }
}
```
KEPUTUSAN: tanpa router library; state via React context + useReducer.
Alasan: app kecil, hindari dependensi tambahan.

## Alur Chat (kontrak perilaku, 7 langkah)
1. User kirim → simpan message user → update `threads.updated_at`.
2. Renderer minta `chat:stream {threadId, botId}`.
3. Main susun messages: `[system_prompt bot] + 20 pesan terakhir thread`.
4. Main POST ke gateway (`stream:true`), parse SSE, kirim delta ke renderer.
5. Selesai → simpan message assistant penuh + token usage (kalau ada).
6. Error → kirim `chat:error {code, message, retryAfterMs?}`; UI tampilkan pesan.
7. Abort → hentikan fetch, simpan sebagian yang sudah diterima (tandai).

## Gateway (satu pintu bot tipe A)
- baseUrl: `http://127.0.0.1:20133/v1`
- apiKey: disimpan di settings DB (jangan pernah tampil penuh di UI/log).
- model: `GET /v1/models` — DINAMIS, selalu fetch, tidak di-hardcode di UI.
- chat: `POST /v1/chat/completions {model, messages, stream:true}`.
- SSE: baris `data: {json}` … `data: [DONE]`.
- Gateway mati → status MERAH di header, app tidak boleh crash.
- 429 accounts_rate_limited = cooldown; tampilkan `retryAfterMs` sebagai pesan.

## Prinsip
- P1 Data 100% lokal. Tidak ada cloud selain request ke gateway/endpoint bot.
- P2 API key disimpan di settings DB lokal; tidak pernah tampil penuh di UI/log.
- P3 Streaming wajib. Jawaban muncul bertahap, bisa di-stop.
- P4 Tidak mengarang data (jumlah model, token, status) — baca dari sumber nyata.
- P5 Fitur lama tidak boleh rusak saat menambah fase baru.
- P6 Error upstream (429/404/503) tampil sebagai pesan ramah, bukan crash.
- P7 DPI Windows 125% harus benar; jangan paksa zoom.

## Edge Case Utama
- E1 Gateway mati saat app dibuka → app tetap tampil, status merah, bot bisa diedit.
- E2 DB belum ada → dibuat otomatis + migrasi + seed 3 bot.
- E3 DB korup → dialog, tawarkan backup `.db` dan mulai DB baru.
- E4 Dua instance app → single instance lock; instance kedua fokus ke yang lama.
- E5 Nama bot/thread kosong → validasi UI, tidak disimpan.
- E6 Thread tanpa pesan → judul "Chat baru".

## Definisi Selesai (per fase)
- Semua V1..Vn dibuktikan dengan bukti nyata (bukan klaim).
- `npm run dev` tetap sukses setelah perubahan; tidak ada regresi fase lama.
- Tidak ada key/token bocor di log/UI.
- Commit format `legion: fase NN <judul>`; bagian gagal ditulis jujur.
- STATUS.md di D:\Legion di-update (fase, bukti, catatan).
