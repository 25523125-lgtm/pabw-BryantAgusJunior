<script setup>
import { computed, ref, watch } from "vue";
import { saring, hitungRataRata } from "../data.js";
import {
  state,
  tambahFavorit,
  hapusFavorit,
  ubahDetail,
  hapusFilm,
} from "../state.js";

const tampil = computed(() => saring(state.daftarProyek, state.kategoriAktif));
const rataRata = computed(() =>
  hitungRataRata(state.daftarProyek.map((film) => film.rating)),
);

// "tenang": kartu tidak beranimasi ulang bila kategorinya tidak berganti (P11).
const tenang = ref(false);
watch(
  () => state.kategoriAktif,
  () => (tenang.value = false),
);
watch(
  () => [state.favorit, state.terbuka, state.daftarProyek.length],
  () => {
    if (!state.memuat) tenang.value = true;
  },
);

function sukai(id) {
  if (state.favorit.includes(id)) hapusFavorit(id);
  else tambahFavorit(id);
}

function hapus(film, event) {
  const tombol = event.currentTarget;
  if (
    !window.confirm(
      `Peringatan: Film "${film.judul}" akan dihapus dari daftar film yang pernah ditonton. Tindakan ini tidak dapat dibatalkan. Lanjutkan?`,
    )
  ) {
    return;
  }
  tombol.disabled = true;
  hapusFilm(film.id).catch((galat) => {
    tombol.disabled = false;
    console.error("film tidak dapat dihapus", galat);
    state.pesanTambahFilm =
      "Film tidak dapat dihapus. Periksa penyimpanan browser, lalu coba lagi.";
  });
}
</script>

<template>
  <p v-if="state.memuat" id="muat" class="pesan-muat" role="status">
    <span class="pemintal" aria-hidden="true"></span>
    Memuat data...
  </p>
  <p
    v-else-if="state.galat"
    id="kosong"
    class="pesan-kosong"
    data-jenis="galat"
    role="alert"
  >
    {{ state.galat }}
  </p>
  <p v-else-if="tampil.length === 0" id="kosong" class="pesan-kosong" role="status">
    Belum ada film yang cocok. Coba pilih genre lain, atau periksa isi data.
  </p>

  <div
    id="daftar"
    class="katalog galeri"
    :class="{ tenang }"
    aria-live="polite"
    :aria-busy="String(state.memuat)"
  >
    <template v-if="!state.galat">
      <article
        v-for="(film, indeks) in tampil"
        :key="film.id"
        :class="indeks === 0 ? 'kartu sorotan' : 'kartu'"
        :style="{ '--urut': indeks }"
      >
        <div class="kartu__isi">
          <h3 class="kartu__judul">{{ film.judul }}</h3>
          <p class="kartu__genre">{{ film.tahun }} · {{ film.genre.join(" · ") }}</p>
          <figure v-if="film.gambar">
            <img
              :src="film.gambar"
              :alt="film.alt"
              width="400"
              height="400"
              loading="lazy"
            />
            <figcaption>{{ film.keterangan }}</figcaption>
          </figure>
          <p class="kartu__sinopsis" :hidden="!state.terbuka.includes(film.id)">
            {{ film.sinopsis }}
          </p>
        </div>
        <div class="kartu__kaki">
          <span>Rating: {{ film.rating }}/10</span>
          <div class="kartu__aksi">
            <button
              type="button"
              class="favorit"
              :aria-pressed="String(state.favorit.includes(film.id))"
              :aria-label="`${state.favorit.includes(film.id) ? 'Hapus dari favorit' : 'Tandai favorit'}: ${film.judul}`"
              @click="sukai(film.id)"
            >
              {{ state.favorit.includes(film.id) ? "★" : "☆" }}
            </button>
            <button
              type="button"
              class="kartu__detail"
              :aria-expanded="String(state.terbuka.includes(film.id))"
              @click="ubahDetail(film.id)"
            >
              {{ state.terbuka.includes(film.id) ? "Tutup" : "Detail" }}
            </button>
            <button
              type="button"
              class="hapus-film"
              :aria-label="`Hapus film ${film.judul}`"
              @click="hapus(film, $event)"
            >
              Hapus
            </button>
          </div>
        </div>
      </article>
    </template>
  </div>

  <section id="tabel-film" class="bagian-tabel">
    <h3>Tabel Film</h3>
    <div class="tabel-wadah">
      <table>
        <caption>
          Film yang pernah saya tonton beserta penilaian saya
        </caption>
        <thead>
          <tr>
            <th scope="col">Judul</th>
            <th scope="col">Tahun rilis</th>
            <th scope="col">Genre</th>
            <th scope="col">Rating</th>
            <th scope="col">Sinopsis</th>
          </tr>
        </thead>
        <tbody v-if="!state.galat">
          <tr v-if="!state.memuat && state.daftarProyek.length === 0">
            <td colspan="5">Belum ada film di tabel.</td>
          </tr>
          <tr
            v-for="(film, indeks) in state.daftarProyek"
            :key="film.id"
            :style="{ '--urut': indeks }"
          >
            <th scope="row">{{ film.judul }}</th>
            <td>{{ film.tahun }}</td>
            <td>{{ film.genre.join(", ") }}</td>
            <td>{{ film.rating }}/10</td>
            <td>{{ film.sinopsis }}</td>
          </tr>
        </tbody>
        <tfoot v-if="!state.galat && state.daftarProyek.length > 0">
          <tr>
            <th scope="row" colspan="3">
              Rata-rata rating dari {{ state.daftarProyek.length }} film
            </th>
            <td>{{ rataRata.toFixed(1) }}/10</td>
            <td></td>
          </tr>
        </tfoot>
      </table>
    </div>
  </section>
</template>
