# Referensi Riset (bahan baca, BUKAN kode yang disalin)

Status per user: 5 repo = acuan pola murni; unslop = acuan UI + skill aktif
(sudah terpasang di opencode + omp). Tidak ada clone/install; lisensi dicek;
implementasi Legion ditulis sendiri. Stack mereka beda (Rust/Python) - konsep saja.

| Repo | Lisensi | Status | Pola yang diadopsi (konsep) |
|---|---|---|---|
| rlaope/deepseek-bot | MIT | ADA | Pemisahan layer gateway vs memory: memory = riwayat disusun ulang per request (system + N pesan terakhir) -> fase 06/08 |
| beenuar/AiSOC | MIT | ADA | Decision ledger terstruktur per aksi agent -> fase 07/08: log per request dengan requestId + error mapping terpusat |
| vercel-labs/agent-desktop | Apache-2.0 | ADA | Kontrol desktop via CLI + streaming output + stop -> fase 16: spawn agent, stream, tree-kill |
| rlaope/oh-my-hermes | MIT | ADA | Harness pattern: konfigurasi agent (command, args, cwd, mode prompt) per entitas -> fase 16; skills -> prompt templates fase 18 |
| MyLegionOnline/legion-hub | TIDAK TERVERIFIKASI (tidak ditemukan di pencarian; 3 star) | ? | Konsep room multi-agent -> inti Legion: banyak bot satu jendela (sudah dirancang) |
| heydamir/unslop | CC-BY-4.0 | ADA + skill aktif | Aturan anti-slop UI -> fase 04/05/21 (antislop aktif mode during) |

Catatan: tanpa angka star yang tidak bisa diverifikasi; lisensi dari halaman GitHub
(unslop: file LICENSE CC-BY-4.0; AiSOC: MIT per deskripsi resmi proyek).
