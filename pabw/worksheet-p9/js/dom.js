// dom.js — menyentuh halaman. Data dan fungsi murni datang dari app.js.
import {
  profil,
  daftarFilm,
  buatPerkenalan,
  formatKeahlian,
  hitungRataRata,
} from "./app.js";

/* ---------- Lembar A: pilih elemen, gagal dengan pesan yang jelas ---------- */

function ambil(pemilih) {
  const elemen = document.querySelector(pemilih);
  if (elemen === null) {
    throw new Error(
      `Elemen "${pemilih}" tidak ditemukan. Bandingkan penulisannya dengan panel Elements dan periksa urutan <script>.`,
    );
  }
  return elemen;
}

const elNama = ambil(".brand h1");
const elDeskripsi = ambil(".brand p");
const wadahDaftar = ambil("#daftar");
const barisFilter = ambil("#filter");
const pesanKosong = ambil("#kosong");
const badanTabel = ambil("#tabel-film tbody");
const formUlasan = ambil("#form-ulasan");
const pesanUlasan = ambil("#pesan-ulasan");
const tombolKirim = ambil("#form-ulasan button[type='submit']");

/* ---------- Kepala halaman (dari data profil) ---------- */

document.title = `${profil.nama} - Profil & Daftar Film`;
elNama.textContent = profil.nama;
elDeskripsi.textContent = buatPerkenalan(profil);

const elKeahlian = document.createElement("p");
elKeahlian.textContent = `Genre: ${formatKeahlian(profil.keahlian)}`;
elDeskripsi.after(elKeahlian);

/* ---------- Lembar B + D.1: render daftar film dari data ---------- */

function buatKartu(film, indeks) {
  const kartu = document.createElement("article");
  kartu.className = indeks === 0 ? "kartu sorotan" : "kartu";

  const isi = document.createElement("div");
  isi.className = "kartu__isi";

  const judul = document.createElement("h3");
  judul.className = "kartu__judul";
  judul.textContent = film.judul;

  const info = document.createElement("p");
  info.className = "kartu__genre";
  info.textContent = `${film.tahun} · ${film.genre.join(" · ")}`;

  isi.append(judul, info);

  if (film.gambar) {
    const gambar = document.createElement("img");
    gambar.src = film.gambar;
    gambar.alt = film.alt;
    gambar.width = 400;
    gambar.height = 400;
    gambar.loading = "lazy";

    const keterangan = document.createElement("figcaption");
    keterangan.textContent = film.keterangan;

    const figur = document.createElement("figure");
    figur.append(gambar, keterangan);
    isi.append(figur);
  }

  const sinopsis = document.createElement("p");
  sinopsis.className = "kartu__sinopsis";
  sinopsis.textContent = film.sinopsis;
  sinopsis.hidden = true;
  isi.append(sinopsis);

  const kaki = document.createElement("div");
  kaki.className = "kartu__kaki";

  const rating = document.createElement("span");
  rating.textContent = `Rating: ${film.rating}/10`;

  const detail = document.createElement("button");
  detail.type = "button";
  detail.className = "kartu__detail";
  detail.textContent = "Detail";
  detail.setAttribute("aria-expanded", "false");

  kaki.append(rating, detail);
  kartu.append(isi, kaki);
  return kartu;
}

function render(daftar) {
  wadahDaftar.textContent = ""; // 1. kosongkan lebih dulu

  if (daftar.length === 0) {
    // 2. keadaan kosong
    pesanKosong.hidden = false;
    return;
  }
  pesanKosong.hidden = true;

  const fragmen = document.createDocumentFragment(); // 3. isi ulang, digambar sekali
  daftar.forEach((film, indeks) => fragmen.append(buatKartu(film, indeks)));
  wadahDaftar.append(fragmen);
}

function buatBaris(film) {
  const baris = document.createElement("tr");

  const judul = document.createElement("th");
  judul.scope = "row";
  judul.textContent = film.judul;

  const nilai = [
    film.tahun,
    film.genre.join(", "),
    `${film.rating}/10`,
    film.sinopsis,
  ].map((teks) => {
    const sel = document.createElement("td");
    sel.textContent = teks;
    return sel;
  });

  baris.append(judul, ...nilai);
  return baris;
}

function renderTabel(daftar) {
  badanTabel.textContent = "";
  const fragmen = document.createDocumentFragment();
  daftar.forEach((film) => fragmen.append(buatBaris(film)));
  badanTabel.append(fragmen);
}

/* ---------- Lembar C: satu pendengar di induk untuk semua tombol filter ---------- */

function tandaiTombolAktif(tombolAktif) {
  barisFilter.querySelectorAll("button").forEach((tombol) => {
    const aktif = tombol === tombolAktif;
    tombol.classList.toggle("aktif", aktif);
    tombol.setAttribute("aria-pressed", String(aktif));
  });
}

barisFilter.addEventListener("click", (event) => {
  const tombol = event.target.closest("button");
  if (!tombol) return; // klik di luar tombol, abaikan

  const kategori = tombol.dataset.kategori;
  const terpilih = daftarFilm.filter(
    (film) => kategori === "semua" || film.genre.includes(kategori),
  );

  tandaiTombolAktif(tombol);
  render(terpilih);
});

// Tombol "Detail" pada kartu juga memakai satu pendengar di induk (#daftar),
// jadi kartu yang dibuat ulang oleh render() tetap terlayani.
wadahDaftar.addEventListener("click", (event) => {
  const tombol = event.target.closest("button.kartu__detail");
  if (!tombol) return;

  const sinopsis = tombol.closest(".kartu").querySelector(".kartu__sinopsis");
  sinopsis.hidden = !sinopsis.hidden;
  tombol.textContent = sinopsis.hidden ? "Detail" : "Tutup";
  tombol.setAttribute("aria-expanded", String(!sinopsis.hidden));
});

/* ---------- Lembar D.2: validasi form per kolom ---------- */

const kolom = [
  {
    input: ambil("#nama"),
    galat: ambil("#galat-nama"),
    periksa() {
      const nilai = this.input.value.trim();
      if (nilai === "") return "Nama wajib diisi. Ketik nama Anda, minimal 2 karakter.";
      if (nilai.length < 2) return "Nama terlalu pendek. Tambahkan sampai minimal 2 karakter.";
      return "";
    },
  },
  {
    input: ambil("#rating"),
    galat: ambil("#galat-rating"),
    periksa() {
      const mentah = this.input.value.trim();
      if (mentah === "") return "Rating wajib diisi. Masukkan angka bulat dari 1 sampai 10.";
      const angka = Number(mentah);
      if (!Number.isInteger(angka) || angka < 1 || angka > 10) {
        return "Rating harus bilangan bulat dari 1 sampai 10. Ubah angkanya, misalnya 8.";
      }
      return "";
    },
  },
  {
    input: ambil("#komentar"),
    galat: ambil("#galat-komentar"),
    periksa() {
      const nilai = this.input.value.trim();
      if (nilai === "") return "Komentar wajib diisi. Tulis satu atau dua kalimat tentang film itu.";
      if (nilai.length > 500) return "Komentar terlalu panjang. Persingkat sampai maksimal 500 karakter.";
      return "";
    },
  },
];

let sudahMencoba = false; // tombol baru ditahan setelah ada percobaan kirim
let jumlahUlasan = 0;

function tampilkanGalat(k, pesan) {
  k.galat.textContent = pesan;
  k.galat.hidden = pesan === "";
  if (pesan === "") k.input.removeAttribute("aria-invalid");
  else k.input.setAttribute("aria-invalid", "true");
}

function periksaKolom(k) {
  const pesan = k.periksa();
  tampilkanGalat(k, pesan);
  return pesan === "";
}

const formSah = () => kolom.every((k) => k.periksa() === "");

// satu pendengar "input" di form melayani ketiga kolom
formUlasan.addEventListener("input", (event) => {
  const k = kolom.find((item) => item.input === event.target);
  if (!k) return;
  periksaKolom(k);
  if (sudahMencoba) tombolKirim.disabled = !formSah();
});

formUlasan.addEventListener("submit", (event) => {
  event.preventDefault(); // baris pertama: jangan muat ulang halaman
  sudahMencoba = true;

  const bermasalah = kolom.filter((k) => !periksaKolom(k));
  tombolKirim.disabled = bermasalah.length > 0;

  if (bermasalah.length > 0) {
    pesanUlasan.textContent = "";
    bermasalah[0].input.focus();
    return;
  }

  const rating = Number(kolom[1].input.value.trim());
  const nama = kolom[0].input.value.trim();
  jumlahUlasan += 1;

  const rataBaru = hitungRataRata([
    ...daftarFilm.map((film) => film.rating),
    rating,
  ]);
  pesanUlasan.textContent = `Ulasan ke-${jumlahUlasan}: terima kasih, ${nama}! Rata-rata rating dengan ulasan Anda: ${rataBaru.toFixed(1)}/10.`;

  formUlasan.reset();
  kolom.forEach((k) => tampilkanGalat(k, ""));
  sudahMencoba = false;
  tombolKirim.disabled = false;
});

/* ---------- Gambar pertama kali ---------- */

render(daftarFilm);
renderTabel(daftarFilm);
tandaiTombolAktif(barisFilter.querySelector("[data-kategori='semua']"));
