import {
  state,
  pilihKategori,
  tambahFavorit,
  hapusFavorit,
  ubahDetail,
  gagalKirimUlasan,
  tambahUlasan,
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
} from "./dom.js";

function periksaKolom(indeks) {
  const pesan = aturanKolom[indeks](bacaKolom(indeks));
  tampilkanGalatKolom(indeks, pesan);
  return pesan === "";
}

const formSah = () =>
  aturanKolom.every((aturan, i) => aturan(bacaKolom(i)) === "");

export function pasangPendengar() {
  // filter kategori
  elemen.filter.addEventListener("click", (event) => {
    const tombol = event.target.closest("button");
    if (!tombol) return;
    pilihKategori(tombol.dataset.kategori);
  });

  elemen.daftar.addEventListener("click", (event) => {
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
