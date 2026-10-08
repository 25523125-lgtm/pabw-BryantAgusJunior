const profil = {
  nama: "Universal Pictures",
  peran:
    "salah satu studio film tertua dan terbesar di Amerika Serikat dan memiliki berbagai film yang populer",
  keahlian: ["Animasi", "Komedi", "Keluarga", "Aksi", "Petualangan"],
};

document.title = `${profil.nama} - Profil & Daftar Film`;

const lokasi = profil.alamat?.kota ?? "Belum diisi";

function buatPerkenalan({ nama, peran }) {
  return `${nama} merupakan ${peran}.`;
}

const formatKeahlian = (daftar) => daftar.join(" · ");

const elNama = document.querySelector(".brand h1");
const elDeskripsi = document.querySelector(".brand p");

elNama.textContent = profil.nama;
elDeskripsi.textContent = buatPerkenalan(profil);

const elKeahlian = document.createElement("p");
elKeahlian.textContent = `Genre: ${formatKeahlian(profil.keahlian)}`;
elDeskripsi.after(elKeahlian);

console.log(typeof profil.nama, typeof belumDibuat);
console.log("Lokasi:", lokasi);

console.log(buatPerkenalan(profil));
console.log(buatPerkenalan({ nama: "Ayu", peran: "mahasiswa" }));
console.log(buatPerkenalan({ nama: "Studio X", peran: "rumah produksi" }));
console.log(formatKeahlian(profil.keahlian));
console.log(formatKeahlian(["HTML", "CSS"]));
console.log(formatKeahlian([]));

const daftarFilm = [
  {
    judul: "Despicable Me",
    tahun: 2010,
    genre: ["Animasi", "Komedi", "Keluarga"],
    rating: 8,
    sinopsis:
      "Gru, seorang penjahat super ambisius yang berencana mencuri Bulan, namun hidupnya berubah drastis setelah mengadopsi tiga anak yatim piatu.",
    unggulan: true,
    gambar: "../worksheet-p8/Photo/Despicable_Me.jpeg",
    alt: "Gru, seorang penjahat super ambisius yang berencana mencuri Bulan, namun hidupnya berubah drastis setelah mengadopsi tiga anak yatim piatu",
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
  },
  {
    judul: "Kung Fu Panda",
    tahun: 2008,
    genre: ["Animasi", "Aksi", "Komedi"],
    rating: 9,
    sinopsis:
      "Perjalanan Po Ping, seekor panda gemuk dan kikuk yang bekerja di kedai mie ayahnya, namun bermimpi besar menjadi seorang ahli kung fu.",
    unggulan: true,
    gambar: "../worksheet-p8/Photo/Kungfu_Panda.jpeg",
    alt: "perjalanan Po Ping, seekor panda gemuk dan kikuk yang bekerja di kedai mie ayahnya, namun bermimpi besar menjadi seorang ahli kung fu",
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
  },
];

const jumlahFilm = daftarFilm.length;
console.log(
  `${profil.nama} punya ${jumlahFilm} film di tabel (${typeof jumlahFilm}).`,
);

const buatKartu = (film, indeks) => `
  <article class="kartu${indeks === 0 ? " sorotan" : ""}">
    <div class="kartu__isi">
      <h3 class="kartu__judul">${film.judul}</h3>
      <figure>
        <img src="${film.gambar}" alt="${film.alt}" width="400" height="400" loading="lazy" />
        <figcaption>${film.keterangan}</figcaption>
      </figure>
    </div>
    <div class="kartu__kaki">
      <span>Rating: ${film.rating}/10</span>
      <button type="button">Detail</button>
    </div>
  </article>`;

const buatBaris = (film) => `
  <tr>
    <th scope="row">${film.judul}</th>
    <td>${film.tahun}</td>
    <td>${film.genre.join(", ")}</td>
    <td>${film.rating}/10</td>
    <td>${film.sinopsis}</td>
  </tr>`;

const filmUnggulan = daftarFilm.filter((film) => film.unggulan);
document.querySelector(".katalog").innerHTML = filmUnggulan
  .map(buatKartu)
  .join("");
document.querySelector("#tabel-film tbody").innerHTML = daftarFilm
  .map(buatBaris)
  .join("");

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

const hitungRataRata = (daftar) =>
  daftar.length === 0
    ? 0
    : daftar.reduce((jumlah, nilai) => jumlah + nilai, 0) / daftar.length;

const formUlasan = document.querySelector(".form-ulasan");
const inputNama = document.querySelector("#nama");
const inputRating = document.querySelector("#rating");

let jumlahUlasan = 0;

if (!formUlasan || !inputNama || !inputRating) {
  console.error(
    "Elemen form ulasan tidak ditemukan; periksa id/class di HTML.",
  );
} else {
  const pesanUlasan = document.createElement("p");
  pesanUlasan.setAttribute("role", "status");
  formUlasan.after(pesanUlasan);

  formUlasan.addEventListener("submit", (event) => {
    event.preventDefault();

    const rating = Number(inputRating.value);
    if (Number.isNaN(rating)) {
      console.error("Rating bukan angka:", inputRating.value);
      return;
    }

    jumlahUlasan += 1;
    const rataBaru = hitungRataRata([
      ...daftarFilm.map((film) => film.rating),
      rating,
    ]);
    pesanUlasan.textContent = `Ulasan ke-${jumlahUlasan}: terima kasih, ${inputNama.value}! Rata-rata rating dengan ulasan Anda: ${rataBaru.toFixed(1)}/10.`;
    formUlasan.reset();
  });
}

console.log(kungFuPanda?.tahun ?? "tahun belum diisi");
