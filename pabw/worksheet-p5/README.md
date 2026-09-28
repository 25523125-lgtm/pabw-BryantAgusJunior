# Worksheet P5 — Layout Modern: Flexbox dan Grid

## A. Perencanaan & Sketsa Kerangka Halaman

### Visualisasi Sketsa Kerangka (Layout Diagram)

```text
+-------------------------------------------------------------------+
|                       HEADER / NAVBAR                             |
| (Baris 1 - auto | Flexbox horizontal: Logo, Pengalih Tema, Menu)  |
+-----------------------------------+-------------------------------+
| SIDEBAR (.sisi)                   | KONTEN UTAMA (.utama)         |
| (Kolom 1 - 16rem)                 | (Kolom 2 - 1fr)               |
| Area: "sisi"                      | Area: "utama"                 |
|                                   | - Judul & Deskripsi           |
| Flexbox vertikal untuk menu       | - Galeri Kartu (.katalog)     |
| navigasi samping.                 |   * Grid: repeat(auto-fit)    |
|                                   |   * Flexbox: internal kartu   |
|                                   | - Tabel Rating Film           |
|                                   +-------------------------------+
|                                   | KONTEN BAWAH (.bawah)         |
|                                   | Area: "bawah"                 |
|                                   | - Form Ulasan                 |
+-----------------------------------+-------------------------------+
|                       FOOTER                                      |
| (Baris 3 - auto | Hak cipta & informasi identitas)                |
+-------------------------------------------------------------------+
```
