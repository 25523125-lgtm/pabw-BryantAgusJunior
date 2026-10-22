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

  pulihkan(muat());
  muatUlasan();
  tandaiTombolAktif(state.kategoriAktif);
  pasangPendengar();

  aturMemuat(true);
  try {
    await isiProyek(await ambilProyek());
  } catch (galat) {
    tampilkanGalat(
      "Daftar film gagal dimuat. Periksa koneksi dan izin penyimpanan browser, lalu muat ulang halaman.",
    );
    tandaiGagal();
    console.error(galat);
  } finally {
    aturMemuat(false);
  }
}

mulai();
