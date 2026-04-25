/* ./pitpar/js/letras.js */
import { albums } from "./songs.js";

let currentTranspose = 0;
const notes = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];

const letrasSection = document.getElementById("letras");

function createBackButton(onClick) {
  const back = document.createElement("button");
  back.textContent = "⬅ Volver";
  back.onclick = onClick;
  return back;
}

// =======================
// LISTA DE CANCIONES
// =======================
export function renderSongsLetras(albumIndex) {
  letrasSection.innerHTML = "";
  const album = albums[albumIndex];

  letrasSection.appendChild(createBackButton(renderAlbumsLetras));

  album.songs.forEach(song => {
    if (!song.file) return;

    const btn = document.createElement("button");
    btn.textContent = "📜 " + song.name + "  🎸";

    btn.onclick = () => toggleOptions(btn, song, albumIndex);

    letrasSection.appendChild(btn);
  });
}

// =======================
// OPCIONES (Letras / Acordes)
// =======================
function toggleOptions(button, song, albumIndex) {
  const existing = document.querySelector(".album-lyricsandchords");
  if (existing && existing.previousElementSibling === button) {
    existing.remove();
    return;
  }
  if (existing) existing.remove();

  const div = document.createElement("div");
  div.classList.add("album-lyricsandchords");

  const letrasBtn = document.createElement("button");
  letrasBtn.textContent = "📜 Letras";
  letrasBtn.onclick = () => renderLyrics(song, albumIndex);

  const acordesBtn = document.createElement("button");
  acordesBtn.textContent = "🎸 Acordes";
  acordesBtn.onclick = () => renderChords(song, albumIndex);

  div.appendChild(letrasBtn);
  div.appendChild(acordesBtn);

  button.insertAdjacentElement("afterend", div);
}

// =======================
// LETRAS
// =======================
function renderLyrics(song, albumIndex) {
  letrasSection.innerHTML = "";
  letrasSection.appendChild(createBackButton(() => renderSongsLetras(albumIndex)));

  const title = document.createElement("h2");
  title.textContent = song.name;
  letrasSection.appendChild(title);

  const lyricsDiv = document.createElement("div");
  lyricsDiv.classList.add("lyrics");

  // 👇 ELIMINA acordes tipo [C#]
  const cleanLyrics = song.lyrics.replace(/\[.*?\]/g, "");

  lyricsDiv.textContent = cleanLyrics.toUpperCase();
  
  const credits = document.createElement("div");
  credits.classList.add("song-credits");

  credits.innerHTML = `
    <p><strong>Autor:</strong> ${song.credits.author || "Desconocido"}</p>
    <p><strong>Compositor:</strong> ${song.credits.composer || "Desconocido"}</p>
  `;

  letrasSection.appendChild(lyricsDiv);
  letrasSection.appendChild(credits);
}

// =======================
// ACORDES
// =======================
function renderChords(song, albumIndex, reset = true) {

  // 👉 detectar si hay acordes en la letra
  const hasChords = /\[[^\]]+\]/.test(song.lyrics);

  // 👉 resetear tonalidad SOLO al entrar a la canción
  if (reset) currentTranspose = 0;

  letrasSection.innerHTML = "";
  letrasSection.appendChild(createBackButton(() => renderSongsLetras(albumIndex)));

  const title = document.createElement("h2");
  title.textContent = song.name + " (Acordes)";
  letrasSection.appendChild(title);

  // =====================
  // ❌ SIN ACORDES
  // =====================
  if (!hasChords) {
    const msg = document.createElement("p");
    msg.textContent = "Esta canción no tiene acordes (todavía)";
    msg.style.opacity = "0.7";
    msg.style.marginTop = "20px";

    letrasSection.appendChild(msg);

    // 👇 créditos igual se muestran
    const credits = document.createElement("div");
    credits.classList.add("song-credits");

    credits.innerHTML = `
      <p><strong>Autor:</strong> ${song.credits?.author || "Desconocido"}</p>
      <p><strong>Compositor:</strong> ${song.credits?.composer || "Desconocido"}</p>
    `;

    letrasSection.appendChild(credits);

    return; // 👈 corta ejecución
  }

  // =====================
  // 🎛 CONTROLES
  // =====================
  const controls = document.createElement("div");

  const down = document.createElement("button");
  down.textContent = "🔽 -";
  down.onclick = () => {
    currentTranspose--;
    renderChords(song, albumIndex, false);
  };

  const resetBtn = document.createElement("button");
  resetBtn.textContent = "🎯 Tonalidad original";
  resetBtn.onclick = () => {
    currentTranspose = 0;
    renderChords(song, albumIndex, false);
  };

  const up = document.createElement("button");
  up.textContent = "🔼 +";
  up.onclick = () => {
    currentTranspose++;
    renderChords(song, albumIndex, false);
  };

  controls.appendChild(down);
  controls.appendChild(resetBtn);
  controls.appendChild(up);

  letrasSection.appendChild(controls);

  // =====================
  // 🎸 RENDER
  // =====================
  const container = document.createElement("div");
  container.classList.add("lyrics");

  const lines = song.lyrics.split("\n");

  lines.forEach(line => {
    let chordLine = "";
    let lyricLine = "";

    let parts = line.split(/(\[[^\]]+\])/g);

    parts.forEach(part => {
      if (part.startsWith("[") && part.endsWith("]")) {
        const chord = part.slice(1, -1);
        const transposed = transposeChord(chord, currentTranspose);

        chordLine += transposed.padEnd(part.length, " ");
      } else {
        chordLine += " ".repeat(part.length);
        lyricLine += part;
      }
    });

    const chordDiv = document.createElement("div");
    chordDiv.innerHTML = chordLine.replace(
      /([A-Ga-g]#?)/g,
      '<span class="chord">$1</span>'
    );

    const lyricDiv = document.createElement("div");
    lyricDiv.textContent = lyricLine.toUpperCase();

    container.appendChild(chordDiv);
    container.appendChild(lyricDiv);
  });

  // =====================
  // 👤 CRÉDITOS
  // =====================
  const credits = document.createElement("div");
  credits.classList.add("song-credits");

  credits.innerHTML = `
    <p><strong>Autor:</strong> ${song.credits?.author || "Desconocido"}</p>
    <p><strong>Compositor:</strong> ${song.credits?.composer || "Desconocido"}</p>
  `;

  letrasSection.appendChild(container);
  letrasSection.appendChild(credits);
}


function transposeChord(chord, steps) {
  // Detectar si es menor por minúscula inicial
  const isMinor = chord[0] === chord[0].toLowerCase();

  // Normalizar para cálculo
  const normalized = chord.charAt(0).toUpperCase() + chord.slice(1);

  return normalized.replace(/[A-G]#?/g, (match) => {
    let index = notes.indexOf(match);
    if (index === -1) return match;

    let newIndex = (index + steps + 12) % 12;
    let newNote = notes[newIndex];

    // 👇 volver a minúscula si era menor
    if (isMinor) {
      newNote = newNote.toLowerCase();
    }

    return newNote;
  });
}



// =======================
// ÁLBUMES
// =======================
export function renderAlbumsLetras() {
  letrasSection.innerHTML = "<h1>📜 Letras y acordes 🎸: </h1>";

  albums.forEach((album, albumIndex) => {
    const div = document.createElement("div");
    div.classList.add("album");

    div.innerHTML = `
      <img src="${album.cover}" alt="${album.name}">
      <p>${album.name}</p>
    `;

    div.addEventListener("click", () => renderSongsLetras(albumIndex));

    letrasSection.appendChild(div);
  });
}
