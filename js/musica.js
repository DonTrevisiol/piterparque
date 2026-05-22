/* ./pitpar/js/musica.js */

import { albums } from "./songs.js";
import { playSongByIndex, playCustomSong } from "./player/player.js";

const musicaSection = document.getElementById("musica");

const allSongs = albums.flatMap(album =>
  (album.songs || []).map(song => ({
    ...song,
    folder: album.folder,
    cover: album.cover
  }))
);

let currentTranspose = 0;

const notes = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];

// =========================
// BACK BUTTON
// =========================
function createBackButton(onClick) {
  const back = document.createElement("button");
  back.textContent = "⬅ Volver";
  back.onclick = onClick;
  return back;
}

// =========================
// DESCARGAS
// =========================
function downloadFile(song, album, format, instrumental = false) {

  let url = "";
  let fileName = "";

  // =====================
  // INSTRUMENTAL
  // =====================
  if (instrumental) {

    if (!song.instrumental) {
      alert("No existe instrumental");
      return;
    }

    if (format === "mp3") {
      url = song.instrumental;
      fileName = song.name + "_instrumental.mp3";
    }

    else if (format === "wav") {

      if (!song.instrumentalDownloads?.wav) {
        alert("No existe WAV instrumental");
        return;
      }

      url = song.instrumentalDownloads.wav;
      fileName = song.name + "_instrumental.wav";
    }
  }

  // =====================
  // CANCIÓN NORMAL
  // =====================
  else {

    if (format === "mp3") {

      const folder =
        "assets/music/" +
        album.folder.slice(0, -1) +
        "_mp3/";

      fileName = song.file;
      url = folder + fileName;
    }

    else if (format === "wav") {

      if (!song.downloads?.wav) {
        alert("Esta canción no tiene WAV");
        return;
      }

      url = song.downloads.wav;
      fileName = song.file.replace(".mp3", ".wav");
    }
  }

  const a = document.createElement("a");

  a.href = url;
  a.download = fileName;
  a.target = "_blank";
  a.rel = "noopener noreferrer";

  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// =========================
// ÁLBUMES
// =========================
export function renderAlbums() {

  musicaSection.innerHTML = "<h1>🎵 Música</h1>";

  albums.forEach((album, albumIndex) => {

    const div = document.createElement("div");

    div.classList.add("album");

    div.innerHTML = `
      <img src="${album.cover}" alt="${album.name}">
      <p>${album.name}</p>
    `;

    div.onclick = () => renderSongs(albumIndex);

    musicaSection.appendChild(div);
  });
}

// =========================
// LISTA DE CANCIONES
// =========================
function renderSongs(albumIndex) {

  musicaSection.innerHTML = "";

  const album = albums[albumIndex];

  musicaSection.appendChild(
    createBackButton(renderAlbums)
  );

  // =====================
  // DESCARGA ÁLBUM
  // =====================
  const albumBtn = document.createElement("button");

  albumBtn.textContent =
    "📦 Descargar álbum completo";

  albumBtn.onclick = () => {

    const existing =
      document.querySelector(".album-download-options");

    if (
      existing &&
      existing.previousElementSibling === albumBtn
    ) {
      existing.remove();
      return;
    }

    if (existing) existing.remove();

    const div = document.createElement("div");

    div.classList.add("album-download-options");

    const mp3Btn = document.createElement("button");

    mp3Btn.textContent = "⬇ MP3";

    mp3Btn.onclick = () => {

      if (!album.zip?.mp3) {
        alert("No existe ZIP MP3");
        return;
      }

      window.open(album.zip.mp3, "_blank");
    };

    const wavBtn = document.createElement("button");

    wavBtn.textContent = "⬇ WAV";

    wavBtn.onclick = () => {

      if (!album.zip?.wav) {
        alert("No existe ZIP WAV");
        return;
      }

      window.open(album.zip.wav, "_blank");
    };

    div.appendChild(mp3Btn);
    div.appendChild(wavBtn);

    albumBtn.insertAdjacentElement(
      "afterend",
      div
    );
  };

  musicaSection.appendChild(albumBtn);

  // =====================
  // CANCIONES
  // =====================
  album.songs.forEach(song => {

    if (!song.file) return;

    const btn = document.createElement("button");

    btn.textContent = "🎵 " + song.name;

    btn.onclick = () =>
      renderSongDetail(song, album, albumIndex);

    musicaSection.appendChild(btn);
  });
}

// =========================
// DETALLE
// =========================
function renderSongDetail(song, album, albumIndex) {

  musicaSection.innerHTML = "";

  musicaSection.appendChild(
    createBackButton(() =>
      renderSongs(albumIndex)
    )
  );

  const title = document.createElement("h2");

  title.textContent = song.name;

  musicaSection.appendChild(title);

  // =====================
  // ESCUCHAR
  // =====================
  const playBtn = document.createElement("button");

  playBtn.textContent = "▶ Escuchar";

  playBtn.onclick = () => {

    const index =
      allSongs.findIndex(
        s => s.file === song.file
      );

    playSongByIndex(index);
  };

  musicaSection.appendChild(playBtn);

  // =====================
  // DESCARGAR
  // =====================
  createDownloadSection(song, album);

  // =====================
  // INSTRUMENTAL
  // =====================
  createInstrumentalSection(song, album);

  // =====================
  // LETRAS
  // =====================
  createLyricsSection(song);

  // =====================
  // ACORDES
  // =====================
  createChordsSection(song);
}

// =========================
// DESCARGAS
// =========================
function createDownloadSection(song, album) {

  const btn = document.createElement("button");

  btn.textContent = "⬇ Descargar";

  btn.onclick = () => {

    const existing =
      document.querySelector(".download-options");

    if (
      existing &&
      existing.previousElementSibling === btn
    ) {
      existing.remove();
      return;
    }

    if (existing) existing.remove();

    const div = document.createElement("div");

    div.classList.add("download-options");

    const mp3Btn =
      document.createElement("button");

    mp3Btn.textContent = "⬇ MP3";

    mp3Btn.onclick = () =>
      downloadFile(song, album, "mp3");

    const wavBtn =
      document.createElement("button");

    wavBtn.textContent = "⬇ WAV";

    wavBtn.onclick = () =>
      downloadFile(song, album, "wav");

    div.appendChild(mp3Btn);
    div.appendChild(wavBtn);

    btn.insertAdjacentElement(
      "afterend",
      div
    );
  };

  musicaSection.appendChild(btn);
}

// =========================
// INSTRUMENTAL
// =========================
function createInstrumentalSection(song, album) {

  const btn = document.createElement("button");

  btn.textContent = "🎤 Instrumental";
  if (!song.instrumental) {
    btn.disabled = true;
    btn.style.opacity = "0.5";
    btn.style.cursor = "not-allowed";
  }

  btn.onclick = () => {

    const existing =
      document.querySelector(".instrumental-options");

    if (
      existing &&
      existing.previousElementSibling === btn
    ) {
      existing.remove();
      return;
    }

    if (existing) existing.remove();

    const div = document.createElement("div");

    div.classList.add("instrumental-options");

    // ESCUCHAR
    const playBtn =
      document.createElement("button");

    playBtn.textContent = "▶ Escuchar";

    playBtn.onclick = () => {

      playCustomSong({
        name: song.name + " (Instrumental)",
        src: song.instrumental,
        cover: album.cover
      });
    };

    // DESCARGAR
    const downloadBtn =
      document.createElement("button");

    downloadBtn.textContent = "⬇ Descargar";

    downloadBtn.onclick = () => {

      const existingDownloads =
        div.querySelector(".instrumental-downloads");

      if (existingDownloads) {
        existingDownloads.remove();
        return;
      }

      const downloads =
        document.createElement("div");

      downloads.classList.add(
        "instrumental-downloads"
      );

      const mp3Btn =
        document.createElement("button");

      mp3Btn.textContent = "⬇ MP3";

      mp3Btn.onclick = () =>
        downloadFile(
          song,
          album,
          "mp3",
          true
        );

      const wavBtn =
        document.createElement("button");

      wavBtn.textContent = "⬇ WAV";

      wavBtn.onclick = () =>
        downloadFile(
          song,
          album,
          "wav",
          true
        );

      downloads.appendChild(mp3Btn);
      downloads.appendChild(wavBtn);

      downloadBtn.insertAdjacentElement("afterend", downloads);
    };

    div.appendChild(playBtn);
    div.appendChild(downloadBtn);

    btn.insertAdjacentElement(
      "afterend",
      div
    );
  };

  musicaSection.appendChild(btn);
}

// =========================
// LETRAS
// =========================
function createLyricsSection(song) {

  const btn = document.createElement("button");

  btn.textContent = "📜 Letras";

  btn.onclick = () => {

    const existing =
      document.querySelector(".lyrics-container");

    if (
      existing &&
      existing.previousElementSibling === btn
    ) {
      existing.remove();
      return;
    }

    if (existing) existing.remove();

    const div = document.createElement("div");

    div.classList.add("lyrics-container");

    const lyrics =
      song.lyrics.replace(/\[.*?\]/g, "");

    div.innerHTML = `
      <pre>${lyrics.toUpperCase()}</pre>

      <div class="song-credits">
        <p><strong>Autor:</strong>
        ${song.credits?.author || "Desconocido"}</p>

        <p><strong>Compositor:</strong>
        ${song.credits?.composer || "Desconocido"}</p>
      </div>
    `;

    btn.insertAdjacentElement(
      "afterend",
      div
    );
  };

  musicaSection.appendChild(btn);
}

// =========================
// ACORDES
// =========================
function createChordsSection(song) {

  const hasChords =
    /\[[^\]]+\]/.test(song.lyrics);



  const btn = document.createElement("button");

  btn.textContent = "🎸 Acordes";

  // Deshabilitado visualmente:
  if (!hasChords) {
    btn.disabled = true;
    btn.style.opacity = "0.5";
    btn.style.cursor = "not-allowed";
  }

  btn.onclick = () => {

    const existing =
      document.querySelector(".chords-container");

    if (
      existing &&
      existing.previousElementSibling === btn
    ) {
      existing.remove();
      return;
    }

    if (existing) existing.remove();

    currentTranspose = 0;

    renderChordBlock(btn, song);
  };

  musicaSection.appendChild(btn);
}

function renderChordBlock(button, song) {

  const old =
    document.querySelector(".chords-container");

  if (old) old.remove();

  const container =
    document.createElement("div");

  container.classList.add("chords-container");

  // CONTROLES
  const controls =
    document.createElement("div");

  const down =
    document.createElement("button");

  down.textContent = "🔽 -";

  down.onclick = () => {
    currentTranspose--;
    renderChordBlock(button, song);
  };

  const reset =
    document.createElement("button");

  reset.textContent =
    "🎯 Original";

  reset.onclick = () => {
    currentTranspose = 0;
    renderChordBlock(button, song);
  };

  const up =
    document.createElement("button");

  up.textContent = "🔼 +";

  up.onclick = () => {
    currentTranspose++;
    renderChordBlock(button, song);
  };

  controls.appendChild(down);
  controls.appendChild(reset);
  controls.appendChild(up);

  container.appendChild(controls);

  // LETRA + ACORDES
  const lyricsDiv =
    document.createElement("div");

  lyricsDiv.classList.add("lyrics");

  const lines =
    song.lyrics.split("\n");

  lines.forEach(line => {

    let chordLine = "";
    let lyricLine = "";

    const parts =
      line.split(/(\[[^\]]+\])/g);

    parts.forEach(part => {

      if (
        part.startsWith("[") &&
        part.endsWith("]")
      ) {

        const chord =
          part.slice(1, -1);

        const transposed =
          transposeChord(
            chord,
            currentTranspose
          );

        chordLine +=
          transposed.padEnd(
            part.length,
            " "
          );

      } else {

        chordLine +=
          " ".repeat(part.length);

        lyricLine += part;
      }
    });

    const chordDiv =
      document.createElement("div");

    chordDiv.innerHTML =
      chordLine.replace(
        /([A-G]#?(m|maj|min|sus|add|dim|aug)?\d*)/g,
        '<span class="chord">$1</span>'
      );

    const lyricDiv =
      document.createElement("div");

    lyricDiv.textContent =
      lyricLine.toUpperCase();

    lyricsDiv.appendChild(chordDiv);
    lyricsDiv.appendChild(lyricDiv);
  });

  container.appendChild(lyricsDiv);

  // CRÉDITOS
  const credits =
    document.createElement("div");

  credits.classList.add("song-credits");

  credits.innerHTML = `
    <p><strong>Autor:</strong>
    ${song.credits?.author || "Desconocido"}</p>

    <p><strong>Compositor:</strong>
    ${song.credits?.composer || "Desconocido"}</p>
  `;

  container.appendChild(credits);

  button.insertAdjacentElement(
    "afterend",
    container
  );
}

// =========================
// TRANSPOSICIÓN
// =========================
function transposeChord(chord, steps) {

  const isMinor =
    chord[0] === chord[0].toLowerCase();

  const normalized =
    chord.charAt(0).toUpperCase() +
    chord.slice(1);

  let result =
    normalized.replace(/[A-G]#?/g, match => {

      const index =
        notes.indexOf(match);

      if (index === -1) return match;

      const newIndex =
        (index + steps + 12) % 12;

      return notes[newIndex];
    });

  if (isMinor) {
    result += "m";
  }

  return result;
}
