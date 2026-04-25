/* ./pitpar/js/musica.js */
import { albums } from "./songs.js";
import { playSongByIndex } from "./player/player.js";

const musicaSection = document.getElementById("musica");
const songs = albums.flatMap(album => (album.songs || []).map(song => ({
  ...song,
  folder: album.folder
})));

function createBackButton(onClick) {
  const back = document.createElement("button");
  back.textContent = "⬅ Volver";
  back.onclick = onClick;
  return back;
}

function renderSongs(albumIndex) {
  musicaSection.innerHTML = "";
  const album = albums[albumIndex];

  musicaSection.appendChild(createBackButton(renderAlbums));

  album.songs.forEach(song => {
    if (!song.file) return;
    const btn = document.createElement("button");
    btn.textContent = "🎧 " + song.name;
    btn.onclick = () => playSongByIndex(songs.findIndex(s => s.file === song.file));
    musicaSection.appendChild(btn);
  });
}

export function renderAlbums() {
  musicaSection.innerHTML = "<h1>🎵 Música: </h1>";
  albums.forEach((album, albumIndex) => {
    const div = document.createElement("div");
    div.classList.add("album");
    div.innerHTML = `
      <img src="${album.cover}" alt="${album.name}">
      <p>${album.name}</p>
    `;
    div.addEventListener("click", () => renderSongs(albumIndex));
    musicaSection.appendChild(div);
  });
}
