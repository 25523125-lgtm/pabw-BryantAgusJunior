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

function buatKartu(film, indeks) {
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

export function render(daftar) {
  wadah.textContent = "";

  if (daftar.length === 0) {
    kosong.textContent =
      "Belum ada film yang cocok. Coba pilih genre lain, atau periksa isi data.";
    delete kosong.dataset.jenis;
    kosong.setAttribute("role", "status");
    kosong.hidden = false;
    return;
  }
  kosong.hidden = true;

  const fragmen = document.createDocumentFragment();
  daftar.forEach((film, indeks) => fragmen.append(buatKartu(film, indeks)));
  wadah.append(fragmen);
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

export function renderTabel(daftar, rataRata) {
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

function tandaiTombolAktif(tombolAktif) {
  barisFilter.querySelectorAll("button").forEach((tombol) => {
    const aktif = tombol === tombolAktif;
    tombol.classList.toggle("aktif", aktif);
    tombol.setAttribute("aria-pressed", String(aktif));
  });
}

export function pasangFilter(daftar) {
  tandaiTombolAktif(barisFilter.querySelector("[data-kategori='semua']"));

  barisFilter.addEventListener("click", (event) => {
    const tombol = event.target.closest("button");
    if (!tombol) return;

    const kategori = tombol.dataset.kategori;
    tandaiTombolAktif(tombol);
    render(
      daftar.filter(
        (film) => kategori === "semua" || film.genre.includes(kategori),
      ),
    );
  });
}

wadah.addEventListener("click", (event) => {
  const tombol = event.target.closest("button.kartu__detail");
  if (!tombol) return;

  const sinopsis = tombol.closest(".kartu").querySelector(".kartu__sinopsis");
  sinopsis.hidden = !sinopsis.hidden;
  tombol.textContent = sinopsis.hidden ? "Detail" : "Tutup";
  tombol.setAttribute("aria-expanded", String(!sinopsis.hidden));
});

const kolom = [
  {
    input: ambil("#nama"),
    galat: ambil("#galat-nama"),
    periksa() {
      const nilai = this.input.value.trim();
      if (nilai === "")
        return "Nama wajib diisi. Ketik nama Anda, minimal 2 karakter.";
      if (nilai.length < 2)
        return "Nama terlalu pendek. Tambahkan sampai minimal 2 karakter.";
      return "";
    },
  },
  {
    input: ambil("#rating"),
    galat: ambil("#galat-rating"),
    periksa() {
      const mentah = this.input.value.trim();
      if (mentah === "")
        return "Rating wajib diisi. Masukkan angka bulat dari 1 sampai 10.";
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
      if (nilai === "")
        return "Komentar wajib diisi. Tulis satu atau dua kalimat tentang film itu.";
      if (nilai.length > 500)
        return "Komentar terlalu panjang. Persingkat sampai maksimal 500 karakter.";
      return "";
    },
  },
];

function tampilkanGalatKolom(k, pesan) {
  k.galat.textContent = pesan;
  k.galat.hidden = pesan === "";
  if (pesan === "") k.input.removeAttribute("aria-invalid");
  else k.input.setAttribute("aria-invalid", "true");
}

function periksaKolom(k) {
  const pesan = k.periksa();
  tampilkanGalatKolom(k, pesan);
  return pesan === "";
}

const formSah = () => kolom.every((k) => k.periksa() === "");

export function pasangFormUlasan({
  ambilRating,
  hitungRataRata,
  jumlahAwal,
  saat,
}) {
  let sudahMencoba = false;
  let jumlahUlasan = jumlahAwal;

  formUlasan.addEventListener("input", (event) => {
    const k = kolom.find((item) => item.input === event.target);
    if (!k) return;
    periksaKolom(k);
    if (sudahMencoba) tombolKirim.disabled = !formSah();
  });

  formUlasan.addEventListener("submit", (event) => {
    event.preventDefault();
    sudahMencoba = true;

    const bermasalah = kolom.filter((k) => !periksaKolom(k));
    tombolKirim.disabled = bermasalah.length > 0;

    if (bermasalah.length > 0) {
      pesanUlasan.textContent = "";
      bermasalah[0].input.focus();
      return;
    }

    const nama = kolom[0].input.value.trim();
    const rating = Number(kolom[1].input.value.trim());
    const komentar = kolom[2].input.value.trim();
    jumlahUlasan += 1;
    saat({ nama, rating, komentar });

    const rataBaru = hitungRataRata([...ambilRating(), rating]);
    pesanUlasan.textContent = `Ulasan ke-${jumlahUlasan}: terima kasih, ${nama}! Rata-rata rating dengan ulasan Anda: ${rataBaru.toFixed(1)}/10.`;

    formUlasan.reset();
    kolom.forEach((k) => tampilkanGalatKolom(k, ""));
    sudahMencoba = false;
    tombolKirim.disabled = false;
  });
}
