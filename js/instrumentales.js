/* ./pitpar/js/instrumentales.js */

import { albums } from "./songs.js";
import { playCustomSong } from "./player/player.js";

const section = document.getElementById("instrumentales");

function createBackButton(onClick) {
  const back = document.createElement("button");
  back.textContent = "⬅ Volver";
  back.onclick = onClick;
  return back;
}

// =====================
// ÁLBUMES
// =====================
export function renderAlbumsInstrumentales() {
  section.innerHTML = "<h1>🎤 Instrumentales</h1>";

  albums.forEach((album, index) => {
    const div = document.createElement("div");
    div.classList.add("album");

    div.innerHTML = `
      <img src="${album.cover}" alt="${album.name}">
      <p>${album.name}</p>
    `;

    div.onclick = () => renderSongsInstrumentales(index);

    section.appendChild(div);
  });
}

// =====================
// CANCIONES
// =====================
function renderSongsInstrumentales(albumIndex) {
  section.innerHTML = "";

  const album = albums[albumIndex];

  section.appendChild(createBackButton(renderAlbumsInstrumentales));

  album.songs.forEach(song => {
    const btn = document.createElement("button");

	if (!song.instrumental) {
	  btn.textContent = "🚫 " + song.name;
	  btn.disabled = true;

	  btn.onclick = () => {
		alert("Esta canción aún no tiene instrumental");
	  };

	} else {
	  btn.textContent = "🎤 " + song.name;
	  btn.onclick = () => toggleOptions(btn, song, album);
	}

    section.appendChild(btn);
  });
}

// =====================
// OPCIONES
// =====================
function toggleOptions(button, song, album) {
  const existing = document.querySelector(".instrumental-options");
  if (existing && existing.previousElementSibling === button) {
    existing.remove();
    return;
  }
  if (existing) existing.remove();

  const div = document.createElement("div");
  div.classList.add("instrumental-options");

  // ▶ reproducir
  const playBtn = document.createElement("button");
  playBtn.textContent = "▶ Escuchar";
  playBtn.onclick = () => {
    const audioPath = song.instrumental;
    playCustomSong({name: song.name + " (Instrumental)", src: audioPath});
  };

  // ⬇ descargar
  const downloadBtn = document.createElement("button");
  downloadBtn.textContent = "⬇ Descargar";
  downloadBtn.onclick = () => {
    const a = document.createElement("a");
    a.href = song.instrumental;
    a.download = song.instrumental.split("/").pop();
    a.click();
  };

  div.appendChild(playBtn);
  div.appendChild(downloadBtn);

  button.insertAdjacentElement("afterend", div);
}
