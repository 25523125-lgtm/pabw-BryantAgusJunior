import {
  state,
  pilihKategori,
  tambahFavorit,
  hapusFavorit,
  ubahDetail,
  gagalKirimUlasan,
  tambahUlasan,
  tambahFilm,
  hapusFilm,
  aturUlang,
} from "./state.js";
import { aturanKolom } from "./data.js";
import {
  elemen,
  bacaKolom,
  indeksKolom,
  tampilkanGalatKolom,
  fokusKolom,
  aturTombolKirim,
  kosongkanForm,
  aturFormTambahFilm,
  kosongkanFormTambahFilm,
  tampilkanPesanTambahFilm,
} from "./dom.js";

function periksaKolom(indeks) {
  const pesan = aturanKolom[indeks](bacaKolom(indeks));
  tampilkanGalatKolom(indeks, pesan);
  return pesan === "";
}

const formSah = () =>
  aturanKolom.every((aturan, i) => aturan(bacaKolom(i)) === "");

async function optimalkanFoto(file) {
  if (!file.type.startsWith("image/")) {
    throw new Error("Pilih file gambar yang valid.");
  }
  if (file.size > 10 * 1024 * 1024) {
    throw new Error("Ukuran foto maksimal 10 MB.");
  }

  const bitmap = await createImageBitmap(file);
  try {
    const batasUkuran = 750 * 1024;
    for (const sisiMaksimum of [1200, 900, 700]) {
      const skala = Math.min(1, sisiMaksimum / Math.max(bitmap.width, bitmap.height));
      const kanvas = document.createElement("canvas");
      kanvas.width = Math.round(bitmap.width * skala);
      kanvas.height = Math.round(bitmap.height * skala);

      const konteks = kanvas.getContext("2d");
      if (!konteks) throw new Error("Foto tidak dapat diproses oleh browser.");
      konteks.fillStyle = "#ffffff";
      konteks.fillRect(0, 0, kanvas.width, kanvas.height);
      konteks.drawImage(bitmap, 0, 0, kanvas.width, kanvas.height);

      for (const kualitas of [0.8, 0.65, 0.5]) {
        const blob = await new Promise((resolve, reject) => {
          kanvas.toBlob(
            (hasil) =>
              hasil
                ? resolve(hasil)
                : reject(new Error("Foto tidak dapat dikompres.")),
            "image/jpeg",
            kualitas,
          );
        });
        if (blob.size <= batasUkuran) {
          return await new Promise((resolve, reject) => {
            const pembaca = new FileReader();
            pembaca.onload = () => resolve(pembaca.result);
            pembaca.onerror = () =>
              reject(new Error("Foto yang diunggah tidak dapat dibaca."));
            pembaca.readAsDataURL(blob);
          });
        }
      }
    }
  } finally {
    bitmap.close();
  }

  throw new Error(
    "Foto terlalu besar untuk disimpan. Pilih foto lain dengan ukuran atau resolusi lebih kecil.",
  );
}

export function pasangPendengar() {
  elemen.filter.addEventListener("click", (event) => {
    const tombol = event.target.closest("button");
    if (!tombol) return;
    pilihKategori(tombol.dataset.kategori);
  });

  elemen.daftar.addEventListener("click", (event) => {
    const hapus = event.target.closest(".hapus-film");
    if (hapus) {
      const id = Number(hapus.dataset.id);
      const film = state.daftarProyek.find((item) => item.id === id);
      if (
        !film ||
        !window.confirm(
          `Peringatan: Film "${film.judul}" akan dihapus dari daftar film yang pernah ditonton. Tindakan ini tidak dapat dibatalkan. Lanjutkan?`,
        )
      ) {
        return;
      }

      hapus.disabled = true;
      hapusFilm(id).catch((galat) => {
        hapus.disabled = false;
        console.error("film tidak dapat dihapus", galat);
        tampilkanPesanTambahFilm(
          "Film tidak dapat dihapus. Periksa penyimpanan browser, lalu coba lagi.",
        );
      });
      return;
    }

    const favorit = event.target.closest(".favorit");
    if (favorit) {
      const id = Number(favorit.dataset.id);
      if (state.favorit.includes(id)) hapusFavorit(id);
      else tambahFavorit(id);
      return;
    }

    const detail = event.target.closest(".kartu__detail");
    if (detail) ubahDetail(Number(detail.dataset.id));
  });

  elemen.aturUlang.addEventListener("click", () => {
    aturUlang();
  });

  const inputTahun = elemen.formTambahFilm.elements.namedItem("tahun");
  inputTahun.max = String(new Date().getFullYear());

  elemen.tombolTambahFilm.addEventListener("click", () => {
    aturFormTambahFilm(elemen.formTambahFilm.hidden);
    tampilkanPesanTambahFilm("");
  });

  elemen.tombolBatalTambahFilm.addEventListener("click", () => {
    aturFormTambahFilm(false);
    kosongkanFormTambahFilm();
    tampilkanPesanTambahFilm("");
  });

  elemen.formTambahFilm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!elemen.formTambahFilm.reportValidity()) return;

    const data = new FormData(elemen.formTambahFilm);
    const judul = String(data.get("judul")).trim();
    const tahun = Number(data.get("tahun"));
    const genre = String(data.get("genre"));
    const rating = Number(data.get("rating"));
    const fileGambar = data.get("gambar");
    const sinopsis = String(data.get("sinopsis")).trim();
    const alt = String(data.get("alt")).trim();

    if (!judul || !sinopsis) {
      tampilkanPesanTambahFilm(
        "Nama film dan sinopsis tidak boleh hanya berisi spasi.",
      );
      return;
    }

    const tombolSimpan = elemen.formTambahFilm.querySelector(
      "button[type='submit']",
    );
    tombolSimpan.disabled = true;
    tampilkanPesanTambahFilm("Menyimpan film...");
    try {
      const gambar =
        fileGambar instanceof File && fileGambar.size > 0
          ? await optimalkanFoto(fileGambar)
          : "";
      await tambahFilm({
        judul,
        tahun,
        genre: [genre],
        rating,
        sinopsis,
        gambar,
        alt,
      });
      kosongkanFormTambahFilm();
      aturFormTambahFilm(false);
    } catch (galat) {
      console.error("film tidak dapat disimpan", galat);
      tampilkanPesanTambahFilm(
        galat instanceof Error
          ? galat.message
          : "Film tidak dapat disimpan. Periksa ruang penyimpanan browser, lalu coba lagi.",
      );
    } finally {
      tombolSimpan.disabled = false;
    }
  });

  elemen.form.addEventListener("input", (event) => {
    const indeks = indeksKolom(event.target);
    if (indeks === -1) return;
    periksaKolom(indeks);
    if (state.sudahMencoba) aturTombolKirim(!formSah());
  });

  elemen.form.addEventListener("submit", (event) => {
    event.preventDefault();

    const bermasalah = aturanKolom
      .map((_, i) => i)
      .filter((i) => !periksaKolom(i));
    aturTombolKirim(bermasalah.length > 0);

    if (bermasalah.length > 0) {
      gagalKirimUlasan();
      fokusKolom(bermasalah[0]);
      return;
    }

    tambahUlasan({
      nama: bacaKolom(0).trim(),
      rating: Number(bacaKolom(1).trim()),
      komentar: bacaKolom(2).trim(),
    });
    kosongkanForm();
    aturTombolKirim(false);
  });
}
