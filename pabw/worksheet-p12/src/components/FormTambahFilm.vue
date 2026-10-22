<script setup>
import { nextTick, ref } from "vue";
import { daftarKategori } from "../data.js";
import { state, tambahFilm } from "../state.js";
import { optimalkanFoto } from "../foto.js";

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
</template>
