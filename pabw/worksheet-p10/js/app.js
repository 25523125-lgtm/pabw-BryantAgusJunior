import { ambilProyek, simpanUlasan, bacaUlasan } from "./api.js";
import {
  render,
  renderTabel,
  pasangFilter,
  pasangFormUlasan,
  tampilkanProfil,
  aturMemuat,
  tampilkanGalat,
} from "./dom.js";

export const profil = {
  nama: "Universal Pictures",
  peran:
    "salah satu studio film tertua dan terbesar di Amerika Serikat dan memiliki berbagai film yang populer",
  keahlian: ["Animasi", "Komedi", "Keluarga", "Aksi", "Petualangan"],
};

export function buatPerkenalan({ nama, peran }) {
  return `${nama} merupakan ${peran}.`;
}

export const formatKeahlian = (daftar) => daftar.join(" · ");

export const hitungRataRata = (daftar) =>
  daftar.length === 0
    ? 0
    : daftar.reduce((jumlah, nilai) => jumlah + nilai, 0) / daftar.length;

async function muat() {
  tampilkanProfil({
    nama: profil.nama,
    deskripsi: buatPerkenalan(profil),
    genre: formatKeahlian(profil.keahlian),
  });

  const ulasan = bacaUlasan();
  let ratingFilm = [];
  pasangFormUlasan({
    ambilRating: () => ratingFilm,
    hitungRataRata,
    jumlahAwal: ulasan.length,
    saat: (item) => {
      ulasan.push(item);
      simpanUlasan(ulasan);
    },
  });

  aturMemuat(true);
  try {
    const daftar = await ambilProyek();
    ratingFilm = daftar.map((film) => film.rating);

    pasangFilter(daftar);
    render(daftar);
    renderTabel(daftar, hitungRataRata(ratingFilm));
  } catch (galat) {
    tampilkanGalat(
      "Data gagal dimuat. Periksa koneksi, lalu muat ulang halaman.",
    );
    console.error(galat.message);
  } finally {
    aturMemuat(false);
  }
}

muat();
