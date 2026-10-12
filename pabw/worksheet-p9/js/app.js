export const profil = {
  nama: "Universal Pictures",
  peran:
    "salah satu studio film tertua dan terbesar di Amerika Serikat dan memiliki berbagai film yang populer",
  keahlian: ["Animasi", "Komedi", "Keluarga", "Aksi", "Petualangan"],
};

const lokasi = profil.alamat?.kota ?? "Belum diisi";

export function buatPerkenalan({ nama, peran }) {
  return `${nama} merupakan ${peran}.`;
}

export const formatKeahlian = (daftar) => daftar.join(" · ");

console.log(typeof profil.nama, typeof belumDibuat);
console.log("Lokasi:", lokasi);

console.log(buatPerkenalan(profil));
console.log(buatPerkenalan({ nama: "Ayu", peran: "mahasiswa" }));
console.log(buatPerkenalan({ nama: "Studio X", peran: "rumah produksi" }));
console.log(formatKeahlian(profil.keahlian));
console.log(formatKeahlian(["HTML", "CSS"]));
console.log(formatKeahlian([]));

export const daftarFilm = [
  {
    judul: "Despicable Me",
    tahun: 2010,
    genre: ["Animasi", "Komedi", "Keluarga"],
    rating: 8,
    sinopsis:
      "Gru, seorang penjahat super ambisius yang berencana mencuri Bulan, namun hidupnya berubah drastis setelah mengadopsi tiga anak yatim piatu.",
    unggulan: true,
    gambar: "Photo/Despicable_Me.jpg",
    alt: "Poster film Despicable Me: Gru berdiri di atas menara dengan tiga anak angkatnya, dikelilingi para Minion.",
    keterangan: "Gru bersama tiga anak angkatnya dan para Minion.",
  },
  {
    judul: "Despicable Me 2",
    tahun: 2013,
    genre: ["Animasi", "Komedi", "Petualangan"],
    rating: 8,
    sinopsis:
      "Gru yang direkrut oleh Liga Anti-Penjahat (AVL) untuk melacak penjahat super baru setelah ia pensiun dari dunia kejahatan dan fokus merawat ketiga putri angkatnya.",
    unggulan: false,
    gambar: "Photo/Despicable Me 2.jpg",
    alt: "Poster film Despicable Me 2.",
    keterangan: "Poster film Despicable Me 2.",
  },
  {
    judul: "Kung Fu Panda",
    tahun: 2008,
    genre: ["Animasi", "Aksi", "Komedi"],
    rating: 9,
    sinopsis:
      "Perjalanan Po Ping, seekor panda gemuk dan kikuk yang bekerja di kedai mie ayahnya, namun bermimpi besar menjadi seorang ahli kung fu.",
    unggulan: true,
    gambar: "Photo/Kungfu_Panda.jpeg",
    alt: "Poster film Kung Fu Panda: Po sang panda dalam pose kung fu.",
    keterangan: "Po, sang Pendekar Naga, dalam pose kung fu.",
  },
  {
    judul: "Kung Fu Panda 4",
    tahun: 2024,
    genre: ["Animasi", "Aksi", "Petualangan"],
    rating: 7,
    sinopsis:
      "Po yang harus pensiun sebagai Pendekar Naga (Dragon Warrior) dan bersiap menjadi pemimpin spiritual (Spiritual Leader) di Lembah Perdamaian.",
    unggulan: false,
    gambar: "Photo/Kungfu Panda 4.jpg",
    alt: "Poster film Kung Fu Panda 4.",
    keterangan: "Poster film Kung Fu Panda 4.",
  },
];

const jumlahFilm = daftarFilm.length;
console.log(
  `${profil.nama} punya ${jumlahFilm} film di tabel (${typeof jumlahFilm}).`,
);

console.table(profil.keahlian);
console.table(daftarFilm);

const ratingTinggi = daftarFilm.filter((film) => film.rating >= 8);
console.table(ratingTinggi);

const kungFuPanda = daftarFilm.find((film) => film.judul === "Kung Fu Panda");
console.log(kungFuPanda);
console.log(daftarFilm.find((film) => film.judul === "Tidak Ada"));

const daftarJudul = daftarFilm.map((film) => film.judul);
console.log(daftarJudul.length === daftarFilm.length, daftarJudul);

const urutRating = [...daftarFilm].sort((a, b) => b.rating - a.rating);
console.log(urutRating.map((film) => film.judul));
console.log(daftarFilm.map((film) => film.judul));

const salinanProfil = { ...profil, nama: "Salinan" };
console.log(profil.nama, salinanProfil.nama);

export const hitungRataRata = (daftar) =>
  daftar.length === 0
    ? 0
    : daftar.reduce((jumlah, nilai) => jumlah + nilai, 0) / daftar.length;

console.log(kungFuPanda?.tahun ?? "tahun belum diisi");
