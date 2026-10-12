# Pertemuan 9 — DOM, Event, dan Interaktivitas

Halaman profil **Universal Pictures** (lanjutan Pertemuan 8): daftar film dirender dari data,
difilter berdasarkan genre, dan form ulasan divalidasi per kolom.

- Nama: Bryant Agus Junior Saputra · NIM 25523125 · Kelas A
- Jalankan lewat server lokal (modul ES tidak jalan lewat `file://`):
  `python -m http.server` lalu buka `http://localhost:8000/profil.html`

## Struktur

| Berkas | Isi |
| --- | --- |
| `profil.html` | Kerangka halaman, tombol filter, pesan kosong, form |
| `js/app.js` | Data (`profil`, `daftarFilm`) dan fungsi murni; **tidak menyentuh halaman** |
| `js/dom.js` | Memilih elemen, `render`, filter (event delegation), validasi form |
| `*.css` | Token, layout, komponen, tema, responsif |

## Yang dikerjakan

- Pemilih dibungkus `ambil()` sehingga elemen yang tidak ditemukan langsung memberi pesan jelas, bukan `null` diam-diam.
- Kartu dibuat dengan `createElement` + `textContent` + `DocumentFragment` (tanpa `innerHTML`).
- `render()` selalu: kosongkan wadah → periksa keadaan kosong → isi ulang.
- Satu pendengar `click` di `#filter` melayani semua tombol (`closest("button")`, `dataset.kategori`).
- Form: `preventDefault`, validasi per kolom saat mengetik, `aria-invalid`, tombol ditahan setelah ada percobaan kirim yang gagal, fokus ke kolom bermasalah.

## Deklarasi penggunaan AI

- **Dibantu AI (Claude, Anthropic):** penulisan ulang `js/app.js` menjadi data/fungsi murni, penulisan `js/dom.js`,
  penyesuaian `profil.html` dan `komponen.css`, pengujian otomatis di Chrome, serta draf jawaban worksheet.
- **Saya kerjakan sendiri:** topik dan data halaman (profil Universal Pictures, daftar film, desain CSS dari Pertemuan 3–8),
  pemeriksaan hasil di peramban, dan pemahaman setiap baris kode sebelum diserahkan.

<!-- Sesuaikan bagian ini dengan keadaan sebenarnya sebelum push. -->
