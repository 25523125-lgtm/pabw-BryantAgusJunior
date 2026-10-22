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

export const daftarKategori = ["semua", ...profil.keahlian];

export function saring(daftar, kategori) {
  return daftar.filter(
    (film) => kategori === "semua" || film.genre.includes(kategori),
  );
}

export function periksaNama(teks) {
  const nilai = teks.trim();
  if (nilai === "")
    return "Nama wajib diisi. Ketik nama Anda, minimal 2 karakter.";
  if (nilai.length < 2)
    return "Nama terlalu pendek. Tambahkan sampai minimal 2 karakter.";
  return "";
}

export function periksaRating(teks) {
  const mentah = teks.trim();
  if (mentah === "")
    return "Rating wajib diisi. Masukkan angka bulat dari 1 sampai 10.";
  const angka = Number(mentah);
  if (!Number.isInteger(angka) || angka < 1 || angka > 10) {
    return "Rating harus bilangan bulat dari 1 sampai 10. Ubah angkanya, misalnya 8.";
  }
  return "";
}

export function periksaKomentar(teks) {
  const nilai = teks.trim();
  if (nilai === "")
    return "Komentar wajib diisi. Tulis satu atau dua kalimat tentang film itu.";
  if (nilai.length > 500)
    return "Komentar terlalu panjang. Persingkat sampai maksimal 500 karakter.";
  return "";
}

export const aturanKolom = [periksaNama, periksaRating, periksaKomentar];
