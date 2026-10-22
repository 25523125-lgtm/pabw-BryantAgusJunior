<script setup>
import { daftarKategori } from "../data.js";
import { state, pilihKategori, aturUlang } from "../state.js";
</script>

<template>
  <div id="filter" class="baris-filter" role="group" aria-label="Filter genre film">
    <button
      v-for="kategori in daftarKategori"
      :key="kategori"
      type="button"
      :class="{ aktif: state.kategoriAktif === kategori }"
      :aria-pressed="String(state.kategoriAktif === kategori)"
      @click="pilihKategori(kategori)"
    >
      {{ kategori === "semua" ? "Semua" : kategori }}
    </button>
  </div>
  <button type="button" id="atur-ulang" class="atur-ulang" @click="aturUlang()">
    Atur ulang
  </button>
</template>
