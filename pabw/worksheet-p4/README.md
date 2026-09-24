## Pertemuan 4 — Design token halaman profil

- Berkas gaya yang dibuat: `tokens.css`, `base.css`, `layout.css`, `komponen.css`, `tema.css`
- Warna utama: `#047857` (Emerald 700 - Hijau Zamrud), dipilih karena memberikan tampilan yang segar, elegan, dan memiliki tingkat keterbacaan (kontras) yang tinggi terhadap latar belakang terang maupun gelap.

### Token yang saya tetapkan

| Token           | Nilai   | Untuk apa                      |
| --------------- | ------- | ------------------------------ |
| --color-primary | #047857 | tombol, tautan, penanda, judul |
| --color-fg      | #0f172a | warna teks utama               |
| --color-bg      | #f8fafc | latar halaman                  |
| --color-surface | #ffffff | latar kartu dan panel          |
| --color-border  | #cbd5e1 | garis pemisah dan tepi         |
| --color-danger  | #dc2626 | peringatan dan isian tidak sah |
| --color-focus   | #2563eb | garis fokus papan ketik        |
| --radius-md     | 0.5rem  | sudut tombol dan kartu         |
| --space-4       | 1rem    | jarak standar antar elemen     |

Kriteria selesai saya: mengubah `--color-primary` di satu baris pada `tokens.css` harus mengubah warna tombol, tautan, judul, dan garis penanda tanpa menyunting berkas komponen lainnya.
