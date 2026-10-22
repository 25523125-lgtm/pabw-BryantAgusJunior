const ALAMAT = "data/proyek.json";
const KUNCI_ULASAN = "ulasan-film";
const KUNCI_FILM_TAMBAHAN = "pabw-p12-film-tambahan";
const NAMA_DATABASE = "pabw-p12";
const NAMA_STORE = "film-tambahan";
const NAMA_STORE_FILM_DIHAPUS = "film-dihapus";

function bukaDatabase() {
  return new Promise((resolve, reject) => {
    if (!("indexedDB" in window)) {
      reject(new Error("Browser ini tidak mendukung penyimpanan IndexedDB."));
      return;
    }

    const permintaan = indexedDB.open(NAMA_DATABASE, 2);
    permintaan.onupgradeneeded = () => {
      const database = permintaan.result;
      if (!database.objectStoreNames.contains(NAMA_STORE)) {
        database.createObjectStore(NAMA_STORE, { keyPath: "id" });
      }
      if (!database.objectStoreNames.contains(NAMA_STORE_FILM_DIHAPUS)) {
        database.createObjectStore(NAMA_STORE_FILM_DIHAPUS, { keyPath: "id" });
      }
    };
    permintaan.onsuccess = () => resolve(permintaan.result);
    permintaan.onerror = () =>
      reject(permintaan.error || new Error("Database film gagal dibuka."));
  });
}

function tungguTransaksi(transaksi) {
  return new Promise((resolve, reject) => {
    transaksi.oncomplete = resolve;
    transaksi.onerror = () =>
      reject(transaksi.error || new Error("Perubahan database gagal."));
    transaksi.onabort = () =>
      reject(transaksi.error || new Error("Perubahan database dibatalkan."));
  });
}

function validasiFilmTambahan(data) {
  if (!Array.isArray(data)) throw new Error("bentuk data bukan larik");
  return data.filter(
    (film) =>
      film !== null &&
      typeof film === "object" &&
      Number.isInteger(film.id) &&
      typeof film.judul === "string" &&
      Number.isInteger(film.tahun) &&
      Array.isArray(film.genre) &&
      typeof film.rating === "number" &&
      typeof film.sinopsis === "string",
  );
}

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

export async function simpanFilmTambahan(daftar) {
  const database = await bukaDatabase();
  try {
    const transaksi = database.transaction(NAMA_STORE, "readwrite");
    const selesai = tungguTransaksi(transaksi);
    const store = transaksi.objectStore(NAMA_STORE);
    store.clear();
    daftar.forEach((film) => store.put(film));
    await selesai;
  } finally {
    database.close();
  }
}

export async function hapusFilmTersimpan(id, tambahan) {
  const database = await bukaDatabase();
  try {
    const transaksi = database.transaction(
      [NAMA_STORE, NAMA_STORE_FILM_DIHAPUS],
      "readwrite",
    );
    const selesai = tungguTransaksi(transaksi);
    if (tambahan) {
      transaksi.objectStore(NAMA_STORE).delete(id);
    } else {
      transaksi.objectStore(NAMA_STORE_FILM_DIHAPUS).put({ id });
    }
    await selesai;
  } finally {
    database.close();
  }
}

export async function bacaFilmTambahan() {
  const database = await bukaDatabase();
  try {
    const transaksiBaca = database.transaction(NAMA_STORE, "readonly");
    const hasilBaca = new Promise((resolve, reject) => {
      const permintaan = transaksiBaca.objectStore(NAMA_STORE).getAll();
      permintaan.onsuccess = () => resolve(permintaan.result);
      permintaan.onerror = () =>
        reject(permintaan.error || new Error("Film tambahan gagal dibaca."));
    });
    let film = validasiFilmTambahan(await hasilBaca);

    if (film.length === 0) {
      const teksLama = localStorage.getItem(KUNCI_FILM_TAMBAHAN);
      if (teksLama !== null) {
        const filmLama = validasiFilmTambahan(JSON.parse(teksLama));
        if (filmLama.length > 0) {
          const transaksiMigrasi = database.transaction(NAMA_STORE, "readwrite");
          const selesai = tungguTransaksi(transaksiMigrasi);
          filmLama.forEach((item) =>
            transaksiMigrasi.objectStore(NAMA_STORE).put(item),
          );
          await selesai;
          localStorage.removeItem(KUNCI_FILM_TAMBAHAN);
          film = filmLama;
        }
      }
    }

    const transaksiHapus = database.transaction(
      NAMA_STORE_FILM_DIHAPUS,
      "readonly",
    );
    const hasilHapus = new Promise((resolve, reject) => {
      const permintaan = transaksiHapus
        .objectStore(NAMA_STORE_FILM_DIHAPUS)
        .getAllKeys();
      permintaan.onsuccess = () => resolve(permintaan.result);
      permintaan.onerror = () =>
        reject(
          permintaan.error || new Error("Daftar film terhapus gagal dibaca."),
        );
    });

    return {
      film: film.map((item) => ({ ...item, tambahan: true })),
      idsTerhapus: await hasilHapus,
    };
  } catch (galat) {
    console.error("film tambahan tersimpan tidak terbaca", galat);
    throw galat;
  } finally {
    database.close();
  }
}
