<script setup>
import { onMounted, watch } from "vue";
import { profil } from "./data.js";
import {
  state,
  simpan,
  muat,
  pulihkan,
  isiProyek,
  muatUlasan,
  tandaiGagal,
} from "./state.js";
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
