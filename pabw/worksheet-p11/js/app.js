// js/app.js: perakit. Hanya mengimpor modul lain dan menjalankan aplikasi.
import { ambilProyek } from "./api.js";
import { profil, buatPerkenalan, formatKeahlian } from "./data.js";
import {
  state,
  isiProyek,
  tandaiGagal,
  pulihkan,
  muat,
  muatUlasan,
} from "./state.js";
import {
  tampilkanProfil,
  tandaiTombolAktif,
  tampilkanGalat,
  aturMemuat,
} from "./dom.js";
import { pasangPendengar } from "./events.js";

async function mulai() {
  tampilkanProfil({
    nama: profil.nama,
    deskripsi: buatPerkenalan(profil),
    genre: formatKeahlian(profil.keahlian),
  });

  pulihkan(muat()); // pilihan terakhir, atau nilai bawaan
  muatUlasan();
  tandaiTombolAktif(state.kategoriAktif); // tombol sudah benar sebelum data tiba
  pasangPendengar();

  aturMemuat(true);
  try {
    isiProyek(await ambilProyek()); // isiProyek memanggil render(state)
  } catch (galat) {
    tampilkanGalat(
      "Data gagal dimuat. Periksa koneksi, lalu muat ulang halaman.",
    );
    tandaiGagal();
    console.error(galat.message);
  } finally {
    aturMemuat(false);
  }
}

mulai();
