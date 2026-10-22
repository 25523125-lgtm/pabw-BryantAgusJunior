<script setup>
import { buatPerkenalan, formatKeahlian } from "../data.js";

// Hanya membaca props; tidak pernah mengubahnya.
const props = defineProps({
  profil: { type: Object, required: true },
});
</script>

<template>
  <header id="beranda">
    <div class="header-baris navbar">
      <div class="brand">
        <h1>{{ props.profil.nama }}</h1>
        <p>{{ buatPerkenalan(props.profil) }}</p>
        <p>Genre: {{ formatKeahlian(props.profil.keahlian) }}</p>
      </div>
      <div class="header-kanan">
        <fieldset class="pilihan-tema" aria-label="Pilihan tema">
          <legend>Tema</legend>
          <label class="opsi-tema">
            <input type="radio" name="tema" id="tema-terang" checked />
            Terang
          </label>
          <label class="opsi-tema">
            <input type="radio" name="tema" id="tema-gelap" />
            Gelap
          </label>
        </fieldset>
        <nav aria-label="Navigasi utama">
          <ul>
            <li><a href="#beranda">Beranda</a></li>
            <li><a href="#daftar-film">Daftar Film</a></li>
            <li><a href="#beri-ulasan">Beri Ulasan</a></li>
          </ul>
        </nav>
      </div>
    </div>
  </header>
</template>
