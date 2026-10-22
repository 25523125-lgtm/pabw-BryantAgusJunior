// Utilitas dari events.js P11: kompres foto sebelum disimpan.
export async function optimalkanFoto(file) {
  if (!file.type.startsWith("image/")) {
    throw new Error("Pilih file gambar yang valid.");
  }
  if (file.size > 10 * 1024 * 1024) {
    throw new Error("Ukuran foto maksimal 10 MB.");
  }

  const bitmap = await createImageBitmap(file);
  try {
    const batasUkuran = 750 * 1024;
    for (const sisiMaksimum of [1200, 900, 700]) {
      const skala = Math.min(1, sisiMaksimum / Math.max(bitmap.width, bitmap.height));
      const kanvas = document.createElement("canvas");
      kanvas.width = Math.round(bitmap.width * skala);
      kanvas.height = Math.round(bitmap.height * skala);

      const konteks = kanvas.getContext("2d");
      if (!konteks) throw new Error("Foto tidak dapat diproses oleh browser.");
      konteks.fillStyle = "#ffffff";
      konteks.fillRect(0, 0, kanvas.width, kanvas.height);
      konteks.drawImage(bitmap, 0, 0, kanvas.width, kanvas.height);

      for (const kualitas of [0.8, 0.65, 0.5]) {
        const blob = await new Promise((resolve, reject) => {
          kanvas.toBlob(
            (hasil) =>
              hasil
                ? resolve(hasil)
                : reject(new Error("Foto tidak dapat dikompres.")),
            "image/jpeg",
            kualitas,
          );
        });
        if (blob.size <= batasUkuran) {
          return await new Promise((resolve, reject) => {
            const pembaca = new FileReader();
            pembaca.onload = () => resolve(pembaca.result);
            pembaca.onerror = () =>
              reject(new Error("Foto yang diunggah tidak dapat dibaca."));
            pembaca.readAsDataURL(blob);
          });
        }
      }
    }
  } finally {
    bitmap.close();
  }

  throw new Error(
    "Foto terlalu besar untuk disimpan. Pilih foto lain dengan ukuran atau resolusi lebih kecil.",
  );
}
