# STATUS Legion

Target: aplikasi desktop Electron multi-bot AI di D:\Legion (21 fase).
Format bukti: nyata (output/query/log), bukan klaim.

## Progres

| Fase | Judul | Status | Commit |
|---|---|---|---|
| 01 | PRD & arsitektur | done | see git log |
| 02 | Scaffold Electron | done | 2293b1a |
| 03 | Shell layout | pending | |
| 04 | Tema & token | pending | |
| 05 | Komponen UI dasar | pending | |
| 06 | Database SQLite | pending | |
| 07 | Gateway client | pending | |
| 08 | Chat kernel streaming | pending | |
| 09 | Markdown & code render | pending | |
| 10 | Composer input | pending | |
| 11 | Model picker | pending | |
| 12 | Bot editor | pending | |
| 13 | Thread management | pending | |
| 14 | Settings & status gateway | pending | |
| 15 | Custom endpoint | pending | |
| 16 | Agent lokal | pending | |
| 17 | Tray & global shortcut | pending | |
| 18 | Export/import/search/library | pending | |
| 19 | Attachment & vision | pending | |
| 20 | Testing & QA | pending | |
| 21 | Polish & release | pending | |

## Fase 01 — PRD & Arsitektur

Bukti:
- docs/PRD.md (4.0 KB) + docs/ARSITEKTUR.md (4.0 KB) dibuat di D:\Legion.
- Isi: layar L1..L4 + state UI; kontrak IPC lengkap; skema 4 tabel + FK cascade;
  alur chat 7 langkah; keputusan D1..D5; daftar OUT; error mapping.
- Gateway dicek hidup: GET /v1/models -> {"object":"list","data":[auto:coding, auto:fast, ...]}.
- Tidak ada kode aplikasi (hanya docs); file prompt di Desktop hanya dibaca.

Catatan:
- antislop aktif mode during (session override) untuk semua fase UI.
