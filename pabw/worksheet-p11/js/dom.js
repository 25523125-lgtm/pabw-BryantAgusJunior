// js/dom.js: seluruh sentuhan ke halaman: pemilih, render, dan perubahan kelas.
// Tidak ada pendengar peristiwa di sini (ada di events.js) dan tidak ada keadaan yang dibaca dari DOM.
import { saring, hitungRataRata } from "./data.js";

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
const wadah = ambil("#daftar");
const barisFilter = ambil("#filter");
const kosong = ambil("#kosong");
const muatEl = ambil("#muat");
const badanTabel = ambil("#tabel-film tbody");
const kakiTabel = ambil("#tabel-film tfoot");
const formUlasan = ambil("#form-ulasan");
const pesanUlasan = ambil("#pesan-ulasan");
const tombolKirim = ambil("#form-ulasan button[type='submit']");
const tombolAturUlang = ambil("#atur-ulang");

// Kolom formulir, urutannya sama dengan aturanKolom di data.js.
const kolom = [
  { input: ambil("#nama"), galat: ambil("#galat-nama") },
  { input: ambil("#rating"), galat: ambil("#galat-rating") },
  { input: ambil("#komentar"), galat: ambil("#galat-komentar") },
];

// Elemen yang dipasangi pendengar oleh events.js.
export const elemen = {
  daftar: wadah,
  filter: barisFilter,
  form: formUlasan,
  aturUlang: tombolAturUlang,
};

// ---------- profil, memuat, galat ----------

export function tampilkanProfil({ nama, deskripsi, genre }) {
  document.title = `${nama} - Profil & Daftar Film`;
  elNama.textContent = nama;
  elDeskripsi.textContent = deskripsi;

  const elGenre = document.createElement("p");
  elGenre.textContent = `Genre: ${genre}`;
  elDeskripsi.after(elGenre);
}

export function aturMemuat(aktif) {
  muatEl.hidden = !aktif;
  wadah.setAttribute("aria-busy", String(aktif));
}

export function tampilkanGalat(pesan) {
  wadah.textContent = "";
  badanTabel.textContent = "";
  kakiTabel.textContent = "";
  kosong.textContent = pesan;
  kosong.dataset.jenis = "galat";
  kosong.setAttribute("role", "alert");
  kosong.hidden = false;
}

// ---------- kartu dan tabel ----------

export function buatKartu(film, indeks, favorit, terbuka) {
  const kartu = document.createElement("article");
  kartu.className = indeks === 0 ? "kartu sorotan" : "kartu";
  kartu.style.setProperty("--urut", String(indeks));

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

  const dibuka = terbuka.includes(film.id);

  const sinopsis = document.createElement("p");
  sinopsis.className = "kartu__sinopsis";
  sinopsis.textContent = film.sinopsis;
  sinopsis.hidden = !dibuka;
  isi.append(sinopsis);

  const kaki = document.createElement("div");
  kaki.className = "kartu__kaki";

  const rating = document.createElement("span");
  rating.textContent = `Rating: ${film.rating}/10`;

  const aksi = document.createElement("div");
  aksi.className = "kartu__aksi";

  const disukai = favorit.includes(film.id);
  const tombolFavorit = document.createElement("button");
  tombolFavorit.type = "button";
  tombolFavorit.className = "favorit";
  tombolFavorit.dataset.id = film.id;
  tombolFavorit.textContent = disukai ? "★" : "☆";
  tombolFavorit.setAttribute("aria-pressed", String(disukai));
  tombolFavorit.setAttribute(
    "aria-label",
    `${disukai ? "Hapus dari favorit" : "Tandai favorit"}: ${film.judul}`,
  );

  const detail = document.createElement("button");
  detail.type = "button";
  detail.className = "kartu__detail";
  detail.dataset.id = film.id;
  detail.textContent = dibuka ? "Tutup" : "Detail";
  detail.setAttribute("aria-expanded", String(dibuka));

  aksi.append(tombolFavorit, detail);
  kaki.append(rating, aksi);
  kartu.append(isi, kaki);
  return kartu;
}

function buatBaris(film, indeks) {
  const baris = document.createElement("tr");
  baris.style.setProperty("--urut", String(indeks));

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

function renderTabel(daftar, rataRata) {
  badanTabel.textContent = "";
  kakiTabel.textContent = "";

  if (daftar.length === 0) {
    const baris = document.createElement("tr");
    const sel = document.createElement("td");
    sel.colSpan = 5;
    sel.textContent = "Belum ada film di tabel.";
    baris.append(sel);
    badanTabel.append(baris);
    return;
  }

  const fragmen = document.createDocumentFragment();
  daftar.forEach((film, indeks) => fragmen.append(buatBaris(film, indeks)));
  badanTabel.append(fragmen);

  const ringkasan = document.createElement("tr");
  const label = document.createElement("th");
  label.scope = "row";
  label.colSpan = 3;
  label.textContent = `Rata-rata rating dari ${daftar.length} film`;
  const nilai = document.createElement("td");
  nilai.textContent = `${rataRata.toFixed(1)}/10`;
  const sisa = document.createElement("td");
  ringkasan.append(label, nilai, sisa);
  kakiTabel.append(ringkasan);
}

// ---------- tombol filter ----------

// Syaratnya dari state: tombol.dataset.kategori === kategoriAktif.
export function tandaiTombolAktif(kategoriAktif) {
  barisFilter.querySelectorAll("button").forEach((tombol) => {
    const aktif = tombol.dataset.kategori === kategoriAktif;
    tombol.classList.toggle("aktif", aktif);
    tombol.setAttribute("aria-pressed", String(aktif));
  });
}

// ---------- render(state) ----------

// Hanya diingat untuk menentukan animasi masuk; bukan keadaan aplikasi.
let kategoriTergambar = null;

export function render(state) {
  tandaiTombolAktif(state.kategoriAktif);
  pesanUlasan.textContent = state.pesanUlasan;

  if (state.gagal) return; // pesan galat dari tampilkanGalat() tetap tampil

  // Animasi masuk hanya saat kategori berganti, bukan tiap favorit/detail diklik.
  wadah.classList.toggle("tenang", kategoriTergambar === state.kategoriAktif);
  kategoriTergambar = state.kategoriAktif;

  // Pertahankan fokus papan ketik pada tombol kartu yang sama setelah digambar ulang.
  const fokus = document.activeElement;
  const pulihFokus =
    fokus && wadah.contains(fokus) && fokus.dataset.id
      ? { kelas: fokus.classList[0], id: fokus.dataset.id }
      : null;

  wadah.textContent = ""; // 1. kosongkan
  const tampil = saring(state.daftarProyek, state.kategoriAktif); // dari data.js

  if (tampil.length === 0) {
    // 2. keadaan kosong
    kosong.textContent =
      "Belum ada film yang cocok. Coba pilih genre lain, atau periksa isi data.";
    delete kosong.dataset.jenis;
    kosong.setAttribute("role", "status");
    kosong.hidden = false;
  } else {
    kosong.hidden = true;
    const fragmen = document.createDocumentFragment(); // 3. isi ulang
    tampil.forEach((film, indeks) =>
      fragmen.append(buatKartu(film, indeks, state.favorit, state.terbuka)),
    );
    wadah.append(fragmen);
  }

  const semuaRating = state.daftarProyek.map((film) => film.rating);
  renderTabel(state.daftarProyek, hitungRataRata(semuaRating));

  if (pulihFokus) {
    wadah
      .querySelector(`.${pulihFokus.kelas}[data-id="${pulihFokus.id}"]`)
      ?.focus();
  }
}

// ---------- formulir ulasan ----------

export const bacaKolom = (indeks) => kolom[indeks].input.value;

export const indeksKolom = (target) =>
  kolom.findIndex((item) => item.input === target);

export function tampilkanGalatKolom(indeks, pesan) {
  const k = kolom[indeks];
  k.galat.textContent = pesan;
  k.galat.hidden = pesan === "";
  if (pesan === "") k.input.removeAttribute("aria-invalid");
  else k.input.setAttribute("aria-invalid", "true");
}

export const fokusKolom = (indeks) => kolom[indeks].input.focus();

export const aturTombolKirim = (nonaktif) => {
  tombolKirim.disabled = nonaktif;
};

export function kosongkanForm() {
  formUlasan.reset();
  kolom.forEach((_, i) => tampilkanGalatKolom(i, ""));
}
