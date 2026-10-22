<script setup>
import { reactive, ref } from "vue";
import { aturanKolom } from "../data.js";
import { state, gagalKirimUlasan, tambahUlasan } from "../state.js";

// Urutan kolom sama dengan aturanKolom di data.js: nama, rating, komentar.
const nama = ref("");
const rating = ref("");
const komentar = ref("");
const galat = reactive(["", "", ""]);
const tombolNonaktif = ref(false);
const elNama = ref(null);
const elRating = ref(null);
const elKomentar = ref(null);

const nilaiKolom = () => [nama.value, rating.value, komentar.value].map(String);

function periksaKolom(indeks) {
  galat[indeks] = aturanKolom[indeks](nilaiKolom()[indeks]);
  return galat[indeks] === "";
}

const formSah = () =>
  aturanKolom.every((aturan, i) => aturan(nilaiKolom()[i]) === "");

function saatInput(indeks) {
  periksaKolom(indeks);
  if (state.sudahMencoba) tombolNonaktif.value = !formSah();
}

function kirim() {
  const bermasalah = [0, 1, 2].filter((i) => !periksaKolom(i));
  tombolNonaktif.value = bermasalah.length > 0;

  if (bermasalah.length > 0) {
    gagalKirimUlasan();
    [elNama, elRating, elKomentar][bermasalah[0]].value.focus();
    return;
  }

  tambahUlasan({
    nama: nama.value.trim(),
    rating: Number(String(rating.value).trim()),
    komentar: komentar.value.trim(),
  });
  nama.value = rating.value = komentar.value = "";
  galat.fill("");
  tombolNonaktif.value = false;
}
</script>

<template>
  <section id="beri-ulasan" aria-labelledby="judul-beri-ulasan" class="bawah">
    <h2 id="judul-beri-ulasan">Beri Ulasan</h2>

    <form id="form-ulasan" class="form-ulasan" novalidate @submit.prevent="kirim">
      <div class="form-kolom">
        <label for="nama">Nama</label>
        <input
          id="nama"
          ref="elNama"
          v-model="nama"
          type="text"
          name="nama"
          aria-describedby="galat-nama"
          :aria-invalid="galat[0] ? 'true' : null"
          required
          minlength="2"
          autocomplete="name"
          @input="saatInput(0)"
        />
        <span id="galat-nama" class="pesan-galat" :hidden="galat[0] === ''">{{ galat[0] }}</span>
      </div>

      <div class="form-kolom">
        <label for="rating">Rating (1 sampai 10)</label>
        <input
          id="rating"
          ref="elRating"
          v-model="rating"
          type="number"
          name="rating"
          aria-describedby="galat-rating"
          :aria-invalid="galat[1] ? 'true' : null"
          min="1"
          max="10"
          step="1"
          required
          @input="saatInput(1)"
        />
        <span id="galat-rating" class="pesan-galat" :hidden="galat[1] === ''">{{ galat[1] }}</span>
      </div>

      <div class="form-kolom">
        <label for="komentar">Komentar</label>
        <textarea
          id="komentar"
          ref="elKomentar"
          v-model="komentar"
          name="komentar"
          aria-describedby="galat-komentar"
          :aria-invalid="galat[2] ? 'true' : null"
          rows="4"
          cols="40"
          required
          maxlength="500"
          @input="saatInput(2)"
        ></textarea>
        <span id="galat-komentar" class="pesan-galat" :hidden="galat[2] === ''">{{ galat[2] }}</span>
      </div>

      <button type="submit" :disabled="tombolNonaktif">Simpan</button>
    </form>
    <p id="pesan-ulasan" role="status">{{ state.pesanUlasan }}</p>
  </section>
</template>
