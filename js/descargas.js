/* ./pitpar/js/descargas.js */
import { albums } from "./songs.js";

const descargasSection = document.getElementById("descargas");

function createBackButton(onClick) {
  const back = document.createElement("button");
  back.textContent = "⬅ Volver";
  back.onclick = onClick;
  return back;
}

// Toggle opciones de descarga
export function toggleDownloadOptions(button, song, album) {
  const existing = document.querySelector(".download-options");
  if (existing && existing.previousElementSibling === button) { existing.remove(); return; }
  if (existing) existing.remove();

  const div = document.createElement("div");
  div.classList.add("download-options");

  const mp3Btn = document.createElement("button");
  mp3Btn.textContent = "⬇ MP3";
  mp3Btn.onclick = () => downloadFile(song, album, "mp3");

  const wavBtn = document.createElement("button");
  wavBtn.textContent = "⬇ WAV";
  wavBtn.onclick = () => downloadFile(song, album, "wav");

  div.appendChild(mp3Btn);
  div.appendChild(wavBtn);

  button.insertAdjacentElement("afterend", div);
}

function downloadFile(song, album, format) {
  let url = "";
  let fileName = "";

  // =========================
  // 🎵 DESCARGA DE CANCIÓN
  // =========================
  if (song) {

    // MP3 → LOCAL
    if (format === "mp3") {
      const folder = "assets/music/" + album.folder.slice(0, -1) + "_mp3/";
      fileName = song.file;
      url = folder + fileName;
    }

    // WAV → GOOGLE DRIVE
    else {
      if (!song.downloads || !song.downloads.wav) {
        alert("⚠️ Esta canción no tiene versión WAV disponible");
        return;
      }

      url = song.downloads.wav; // ya lo tienes en formato directo
      fileName = song.file.replace(".mp3", ".wav");
    }
  }

  // =========================
  // 📦 DESCARGA DE ÁLBUM
  // =========================
  else {
    if (!album.zip || !album.zip[format]) {
      alert(`⚠️ No hay álbum en ${format.toUpperCase()}`);
      return;
    }

    url = album.zip[format]; // ya directo desde Drive
    fileName = `${album.folder.slice(0, -1)}_${format}.zip`;
  }

  // =========================
  // 🚀 EJECUTAR DESCARGA
  // =========================
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.target = "_blank"; // importante para Google Drive
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export function renderSongsDescargas(albumIndex) {
  descargasSection.innerHTML = "";
  const album = albums[albumIndex];

  descargasSection.appendChild(createBackButton(renderAlbumsDescargas));

  const albumBtn = document.createElement("button");
  albumBtn.textContent = "📦 Álbum " + album.name + " COMPLETO";
  albumBtn.onclick = () => toggleDownloadOptions(albumBtn, null, album);
  descargasSection.appendChild(albumBtn);

  album.songs.forEach(song => {
    if (!song.file) return;
    const btn = document.createElement("button");
    btn.textContent = "📦 " + song.name;
    btn.onclick = () => toggleDownloadOptions(btn, song, album);
    descargasSection.appendChild(btn);
  });
}

export function renderAlbumsDescargas() {
  descargasSection.innerHTML = "<h1>📦 DESCARGAS:</h1>";
  albums.forEach((album, albumIndex) => {
    const div = document.createElement("div");
    div.classList.add("album");
    div.innerHTML = `
      <img src="${album.cover}" alt="${album.name}">
      <p>${album.name}</p>
    `;
    div.addEventListener("click", () => renderSongsDescargas(albumIndex));
    descargasSection.appendChild(div);
  });
}
