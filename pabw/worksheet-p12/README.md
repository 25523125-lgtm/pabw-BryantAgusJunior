# worksheet-p12 — Pertemuan 12 (PABW SIF302)

Profil dan daftar film (Universal Pictures) dari Pertemuan 11, dipindahkan ke proyek Vue + Vite.
Nama: Bryant Agus Junior Saputra · NIM 25523125 · Kelas A

## Menjalankan

```bash
npm install
npm run dev       # server pengembangan (biasanya http://localhost:5173)
npm run build     # menghasilkan dist/
npm run preview   # menjalankan isi dist/ (http://localhost:4173)
```

## Pertemuan 12

**Versi perkakas**

| Perintah  | Versi    |
| --------- | -------- |
| `node -v` | v24.22.0 |
| `npm -v`  | 11.19.1  |

**Ukuran sebelum dan sesudah build** (Tab Network, muat ulang; termasuk 9 foto poster)

| Yang diukur            | `npm run dev` | `npm run preview` (dist/) |
| ---------------------- | ------------- | ------------------------- |
| Jumlah berkas          | 32            | 13                        |
| Ukuran seluruh berkas  | ≈ 1,94 MB     | ≈ 468 KB                  |
| Tanpa foto: jumlah     | 23            | 4                         |
| Tanpa foto: ukuran     | ≈ 1,58 MB     | ≈ 102 KB                  |

> Angka di atas saya ukur ulang sendiri di komputer saya sebelum penyerahan; ganti bila berbeda.

**Struktur**

- `src/components/` — `KepalaProfil.vue` (props `profil`), `TombolFilter.vue`, `DaftarProyek.vue`, `FormKontak.vue`, dan `FormTambahFilm.vue` (fitur tambah film dari P11).
- `src/state.js` — `reactive()`; tidak ada `render(state)` manual. `App.vue` memakai `onMounted` (memulihkan simpanan) dan `watch` (menyimpan).
- `src/*.css` — token dan CSS P04–P06, isinya tidak diubah.
- `public/data/proyek.json` dan `public/Photo/` — berkas statis.

## Deklarasi AI

> **Edit bagian ini sesuai kenyataan sebelum diserahkan.**
> Contoh: Kerangka komponen Vue (pemecahan menjadi `.vue`, `state.js` reaktif, `App.vue`) dibantu Claude (Anthropic).
> Yang saya kerjakan sendiri: halaman, CSS, data, dan JavaScript P03–P11; menjalankan `npm run dev`/`build`/`preview`;
> menguji perilaku; dan menjawab tiket keluar di worksheet.
