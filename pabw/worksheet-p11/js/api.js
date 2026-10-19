const ALAMAT = "data/proyek.json";
const KUNCI_ULASAN = "ulasan-film";

export async function ambilProyek() {
  try {
    const respons = await fetch(ALAMAT);
    if (!respons.ok) throw new Error("status " + respons.status);

    const data = await respons.json();
    if (!Array.isArray(data)) throw new Error("bentuk data bukan larik");
    return data;
  } catch (galat) {
    console.error("gagal memuat", galat.message);
    throw galat;
  }
}

export function simpanUlasan(daftar) {
  try {
    localStorage.setItem(KUNCI_ULASAN, JSON.stringify(daftar));
  } catch (galat) {
    console.error("ulasan tidak tersimpan", galat.message);
  }
}

export function bacaUlasan() {
  try {
    const teks = localStorage.getItem(KUNCI_ULASAN);
    const data = teks === null ? [] : JSON.parse(teks);
    return Array.isArray(data) ? data : [];
  } catch (galat) {
    console.error("ulasan tersimpan tidak terbaca", galat.message);
    return [];
  }
}
