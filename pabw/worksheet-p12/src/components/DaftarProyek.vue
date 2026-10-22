<script setup>
import { computed, nextTick, ref, watch } from "vue";
import { daftarKategori, saring, hitungRataRata } from "../data.js";
import { optimalkanFoto } from "../foto.js";
import {
  state,
  tambahFavorit,
  hapusFavorit,
  ubahDetail,
  hapusFilm,
  tambahFilm,
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

// --- Tambah film (fitur P11): aksi pada daftar film ---
const terbuka = ref(false);
const menyimpan = ref(false);
const form = ref(null);
const elJudul = ref(null);
const tombolBuka = ref(null);
const elGambar = ref(null);

const isian = ref({ judul: "", tahun: "", genre: "", rating: "", sinopsis: "", alt: "" });
const tahunMaks = new Date().getFullYear();

function kosongkan() {
  isian.value = { judul: "", tahun: "", genre: "", rating: "", sinopsis: "", alt: "" };
  if (elGambar.value) elGambar.value.value = "";
}

async function atur(buka) {
  terbuka.value = buka;
  await nextTick();
  if (buka) elJudul.value?.focus();
  else tombolBuka.value?.focus();
}

function saatTombolBuka() {
  atur(!terbuka.value);
  state.pesanTambahFilm = "";
}

function batal() {
  atur(false);
  kosongkan();
  state.pesanTambahFilm = "";
}

async function simpanFilm() {
  if (!form.value.reportValidity()) return;

  const judul = isian.value.judul.trim();
  const sinopsis = isian.value.sinopsis.trim();
  if (!judul || !sinopsis) {
    state.pesanTambahFilm = "Nama film dan sinopsis tidak boleh hanya berisi spasi.";
    return;
  }

  menyimpan.value = true;
  state.pesanTambahFilm = "Menyimpan film...";
  try {
    const file = elGambar.value?.files?.[0];
    const gambar = file && file.size > 0 ? await optimalkanFoto(file) : "";
    await tambahFilm({
      judul,
      tahun: Number(isian.value.tahun),
      genre: [isian.value.genre],
      rating: Number(isian.value.rating),
      sinopsis,
      gambar,
      alt: isian.value.alt.trim(),
    });
    kosongkan();
    atur(false);
  } catch (galat) {
    console.error("film tidak dapat disimpan", galat);
    state.pesanTambahFilm =
      galat instanceof Error
        ? galat.message
        : "Film tidak dapat disimpan. Periksa ruang penyimpanan browser, lalu coba lagi.";
  } finally {
    menyimpan.value = false;
  }
}
</script>

<template>
  <section class="bagian-tambah-film" aria-labelledby="judul-tambah-film">
    <h3 id="judul-tambah-film">Tambah Film yang Pernah Ditonton</h3>
    <p>Tambahkan film beserta detail dan foto untuk melengkapi daftar tontonan.</p>
    <button
      id="tombol-tambah-film"
      ref="tombolBuka"
      type="button"
      :aria-expanded="String(terbuka)"
      aria-controls="form-tambah-film"
      @click="saatTombolBuka"
    >
      + Tambah Film
    </button>
    <form
      id="form-tambah-film"
      ref="form"
      class="form-ulasan form-tambah-film"
      :hidden="!terbuka"
      @submit.prevent="simpanFilm"
    >
      <div class="form-kolom">
        <label for="film-judul">Nama film</label>
        <input id="film-judul" ref="elJudul" v-model="isian.judul" type="text" name="judul" required minlength="2" maxlength="100" />
      </div>
      <div class="form-kolom">
        <label for="film-tahun">Tahun rilis</label>
        <input id="film-tahun" v-model="isian.tahun" type="number" name="tahun" min="1888" :max="tahunMaks" required />
      </div>
      <div class="form-kolom">
        <label for="film-genre">Genre</label>
        <select id="film-genre" v-model="isian.genre" name="genre" required>
          <option value="">Pilih genre</option>
          <option v-for="g in daftarKategori.slice(1)" :key="g">{{ g }}</option>
        </select>
      </div>
      <div class="form-kolom">
        <label for="film-rating">Rating (1 sampai 10)</label>
        <input id="film-rating" v-model="isian.rating" type="number" name="rating" min="1" max="10" step="1" required />
      </div>
      <div class="form-kolom">
        <label for="film-gambar">Unggah foto dari perangkat (opsional)</label>
        <input id="film-gambar" ref="elGambar" type="file" name="gambar" accept="image/*" />
        <small>Format gambar yang didukung perangkat, maksimal 10 MB. Foto akan dioptimalkan sebelum disimpan.</small>
      </div>
      <div class="form-kolom">
        <label for="film-sinopsis">Sinopsis</label>
        <textarea id="film-sinopsis" v-model="isian.sinopsis" name="sinopsis" rows="3" maxlength="500" required></textarea>
      </div>
      <div class="form-kolom">
        <label for="film-alt">Deskripsi foto (untuk aksesibilitas, opsional)</label>
        <input id="film-alt" v-model="isian.alt" type="text" name="alt" maxlength="200" />
      </div>
      <div class="aksi-form-film">
        <button type="submit" :disabled="menyimpan">Simpan Film</button>
        <button id="batal-tambah-film" type="button" class="atur-ulang" @click="batal">Batal</button>
      </div>
    </form>
    <p id="pesan-tambah-film" role="status" aria-live="polite">{{ state.pesanTambahFilm }}</p>
  </section>

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
