import { render } from "./dom.js";
import { daftarKategori, hitungRataRata } from "./data.js";
import {
  bacaFilmTambahan,
  bacaUlasan,
  hapusFilmTersimpan,
  simpanFilmTambahan,
  simpanUlasan,
} from "./api.js";

const KUNCI = "pabw-p11";
const VERSI = 2;

export const state = {
  daftarProyek: [],
  kategoriAktif: "semua",
  favorit: [],
  terbuka: [],
  ulasan: [],
  pesanUlasan: "",
  pesanTambahFilm: "",
  sudahMencoba: false,
  gagal: false,
};

export function simpan(state) {
  const isi = {
    versi: VERSI,
    kategoriAktif: state.kategoriAktif,
    favorit: state.favorit,
  };
  try {
    localStorage.setItem(KUNCI, JSON.stringify(isi));
  } catch (galat) {
    console.error("pilihan tidak tersimpan", galat.message);
  }
}

export function muat() {
  try {
    const isi = JSON.parse(localStorage.getItem(KUNCI));
    if (isi?.versi !== VERSI) {
      localStorage.removeItem(KUNCI);
      return null;
    }
    return isi;
  } catch {
    localStorage.removeItem(KUNCI);
    return null;
  }
}

export function pulihkan(isi) {
  if (!isi) return;
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

export async function isiProyek(daftar) {
  const tersimpan = await bacaFilmTambahan();
  const dihapus = new Set(tersimpan.idsTerhapus);
  state.daftarProyek = [
    ...daftar.filter((film) => !dihapus.has(film.id)),
    ...tersimpan.film,
  ];
  state.gagal = false;
  render(state);
}

export async function tambahFilm(film) {
  const idBerikutnya =
    Math.max(Date.now(), ...state.daftarProyek.map((item) => item.id + 1));
  const filmBaru = {
    ...film,
    id: idBerikutnya,
    tambahan: true,
    gambar: film.gambar,
    alt: film.alt || `Foto film ${film.judul}`,
    keterangan: film.gambar ? `Poster film ${film.judul}.` : "",
  };
  const daftarBaru = [...state.daftarProyek.filter((item) => item.tambahan), filmBaru];
  await simpanFilmTambahan(daftarBaru);
  state.daftarProyek = [...state.daftarProyek, filmBaru];
  state.kategoriAktif = "semua";
  state.pesanTambahFilm = `Film "${filmBaru.judul}" berhasil ditambahkan.`;
  render(state);
}

export async function hapusFilm(id) {
  const film = state.daftarProyek.find((item) => item.id === id);
  if (!film) return;

  await hapusFilmTersimpan(id, Boolean(film.tambahan));
  state.daftarProyek = state.daftarProyek.filter((item) => item.id !== id);
  state.favorit = state.favorit.filter((item) => item !== id);
  state.terbuka = state.terbuka.filter((item) => item !== id);
  simpan(state);
  state.pesanTambahFilm = `Film "${film.judul}" berhasil dihapus.`;
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
  state.favorit = [...state.favorit, id];
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
