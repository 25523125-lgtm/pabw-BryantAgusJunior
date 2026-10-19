// js/state.js: satu objek state, fungsi pengubahnya, dan penyimpanan ke localStorage.
// Setiap perubahan keadaan lewat fungsi bernama di sini, lalu memanggil render(state).
import { render } from "./dom.js";
import { daftarKategori, hitungRataRata } from "./data.js";
import { bacaUlasan, simpanUlasan } from "./api.js";

const KUNCI = "pabw-p11";
const VERSI = 2;

export const state = {
  daftarProyek: [], // dari server, tidak disimpan
  kategoriAktif: "semua", // disimpan
  favorit: [], // disimpan: larik id proyek
  terbuka: [], // id kartu yang sinopsisnya dibuka (tidak disimpan)
  ulasan: [], // disimpan oleh api.js (kunci "ulasan-film")
  pesanUlasan: "", // pesan sesudah ulasan terkirim (tidak disimpan)
  sudahMencoba: false, // formulir pernah dicoba kirim (tidak disimpan)
  gagal: false, // data gagal dimuat dari server (tidak disimpan)
};

// ---------- penyimpanan ----------

export function simpan(state) {
  const isi = {
    versi: VERSI,
    kategoriAktif: state.kategoriAktif,
    favorit: state.favorit,
  };
  try {
    localStorage.setItem(KUNCI, JSON.stringify(isi));
  } catch (galat) {
    // penyimpanan penuh atau diblokir: halaman tetap jalan, hanya tidak diingat
    console.error("pilihan tidak tersimpan", galat.message);
  }
}

export function muat() {
  try {
    const isi = JSON.parse(localStorage.getItem(KUNCI));
    if (isi?.versi !== VERSI) {
      localStorage.removeItem(KUNCI); // bentuk lama atau kosong: buang
      return null;
    }
    return isi;
  } catch {
    localStorage.removeItem(KUNCI); // isi rusak: buang
    return null;
  }
}

export function pulihkan(isi) {
  if (!isi) return; // kunjungan pertama: nilai bawaan tetap
  // versi cocok, tetapi isinya tetap diperiksa sebelum dipercaya
  state.kategoriAktif = daftarKategori.includes(isi.kategoriAktif)
    ? isi.kategoriAktif
    : "semua";
  state.favorit = Array.isArray(isi.favorit)
    ? isi.favorit.filter(Number.isInteger)
    : [];
}

export function aturUlang() {
  try {
    localStorage.removeItem(KUNCI);
  } catch (galat) {
    console.error("simpanan tidak bisa dihapus", galat.message);
  }
  state.kategoriAktif = "semua";
  state.favorit = [];
  state.terbuka = [];
  render(state);
}

// ---------- fungsi pengubah ----------

export function isiProyek(daftar) {
  state.daftarProyek = daftar;
  state.gagal = false;
  render(state);
}

export function tandaiGagal() {
  state.gagal = true;
  render(state);
}

export function pilihKategori(nilai) {
  state.kategoriAktif = nilai;
  simpan(state);
  render(state);
}

export function tambahFavorit(id) {
  if (state.favorit.includes(id)) return;
  state.favorit = [...state.favorit, id]; // salinan baru, bukan push
  simpan(state);
  render(state);
}

export function hapusFavorit(id) {
  state.favorit = state.favorit.filter((item) => item !== id);
  simpan(state);
  render(state);
}

export function ubahDetail(id) {
  state.terbuka = state.terbuka.includes(id)
    ? state.terbuka.filter((item) => item !== id)
    : [...state.terbuka, id];
  render(state);
}

export function muatUlasan() {
  state.ulasan = bacaUlasan();
}

export function gagalKirimUlasan() {
  state.sudahMencoba = true;
  state.pesanUlasan = "";
  render(state);
}

export function tambahUlasan({ nama, rating, komentar }) {
  state.ulasan = [...state.ulasan, { nama, rating, komentar }];
  simpanUlasan(state.ulasan);

  const rataBaru = hitungRataRata([
    ...state.daftarProyek.map((film) => film.rating),
    rating,
  ]);
  state.pesanUlasan = `Ulasan ke-${state.ulasan.length}: terima kasih, ${nama}! Rata-rata rating dengan ulasan Anda: ${rataBaru.toFixed(1)}/10.`;
  state.sudahMencoba = false;
  render(state);
}
