<script setup>
import { onMounted, watch } from "vue";
import { profil } from "./data.js";
import { state, simpan, muat, pulihkan, isiProyek, muatUlasan, tandaiGagal } from "./state.js";
import { ambilProyek } from "./api.js";
import KepalaProfil from "./components/KepalaProfil.vue";
import TombolFilter from "./components/TombolFilter.vue";
import DaftarProyek from "./components/DaftarProyek.vue";
import FormKontak from "./components/FormKontak.vue";

onMounted(async () => {
  pulihkan(muat()); // pilihan terakhir dari localStorage
  muatUlasan();
  try {
    await isiProyek(await ambilProyek()); // data/proyek.json
  } catch (galat) {
    tandaiGagal(
      "Daftar film gagal dimuat. Periksa koneksi dan izin penyimpanan browser, lalu muat ulang halaman.",
    );
    console.error(galat);
  } finally {
    state.memuat = false;
  }
});

// Setiap perubahan state tersimpan otomatis; tidak ada pemanggilan simpan() di fungsi pengubah.
watch(state, (nilai) => simpan(nilai), { deep: true });
</script>

<template>
  <KepalaProfil :profil="profil" />

  <div class="isi">
    <aside class="sisi" aria-label="Menu Samping">
      <h3>Menu Samping</h3>
      <nav class="menu-samping">
        <ul>
          <li><a href="#daftar-film">Daftar Film</a></li>
          <li><a href="#tabel-film">Tabel Rating</a></li>
          <li><a href="#beri-ulasan">Form Ulasan</a></li>
        </ul>
      </nav>
    </aside>

    <main class="utama">
      <section id="daftar-film" aria-labelledby="judul-daftar-film">
        <h2 id="judul-daftar-film">Daftar Film</h2>
        <p>Film favorit saya yang pernah saya tonton, dari animasi sampai aksi dan petualangan. Pilih genre untuk menyaring daftarnya.</p>

        <TombolFilter />
        <DaftarProyek />
      </section>

      <FormKontak />
    </main>
  </div>

  <footer>
    <p>Bryant Agus Junior Saputra · 25523125 · 2026</p>
  </footer>
</template>
