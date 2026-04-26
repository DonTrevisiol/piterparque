// ./pitpar/js/player/player.js
// ============================
// VARIABLES
// ============================

// ============================
let audio = new Audio();
let currentIndex = 0;
let songs = [];
let elements = {};
// ============================

// ============================
// FUNCIONES
// ============================

// ============================
export function initPlayer(_songs) {
  songs = _songs;

  elements = {
    trackName: document.getElementById("track-name"),
    playBtn: document.getElementById("play-pause"),
    prevBtn: document.getElementById("prev"),
    nextBtn: document.getElementById("next"),
    volumeSlider: document.getElementById("volume"),
    volumePercent: document.getElementById("volume-percent"),
    muteBtn: document.getElementById("mute"),
    progress: document.getElementById("progress"),
    timeDisplay: document.getElementById("time"),
  };

  setupEvents();
  updateVolumeUI();
}

export function playSongByIndex(index, autoplay = true) {
  if (index < 0) index = songs.length - 1;
  if (index >= songs.length) index = 0;

  currentIndex = index;
  const song = songs[currentIndex];

    if (!song) {
        console.error("❌ Song no encontrada:", currentIndex, songs);
    return;
    }

  audio.src = "/assets/music/" + song.folder.slice(0, -1) + "_mp3/" + song.file;
  elements.trackName.textContent = song.name;

  if (autoplay) {
    audio.play();
    elements.playBtn.textContent = "⏸️";
  }
}

function updateVolumeUI() {
  const { muteBtn, volumeSlider, volumePercent } = elements;

  if (audio.muted || audio.volume === 0) {
    muteBtn.textContent = "🔇";
    volumeSlider.classList.add("muted");
    volumePercent.style.opacity = "0.5";
  } else if (audio.volume < 0.5) {
    muteBtn.textContent = "🔉";
    volumeSlider.classList.remove("muted");
    volumePercent.style.opacity = "1";
  } else {
    muteBtn.textContent = "🔊";
    volumeSlider.classList.remove("muted");
    volumePercent.style.opacity = "1";
  }
}

function toggleMute() {
  audio.muted = !audio.muted;
  updateVolumeUI();
}

// ============================

export function playCustomSong({ name, src }){
  if(!src) return;
  
  audio.src = src;
  elements.trackName.textContent = name;
  
  audio.play();
  elements.playBtn.textContent = "⏸️";
}


// ============================
// EVENTOS
// ============================

// ============================
function setupEvents() {
  const {
    playBtn, prevBtn, nextBtn,
    volumeSlider, volumePercent, muteBtn,
    progress, timeDisplay
  } = elements;

  // ▶️ Play / Pause
  playBtn.addEventListener('click', () => {
    if (!audio.src) return;

    if (audio.paused) {
      audio.play();
      playBtn.textContent = "⏸️";
    } else {
      audio.pause();
      playBtn.textContent = "▶️";
    }
  });

  // 🔇 ⏮️ ⏭️
  muteBtn.addEventListener('click', toggleMute);
  prevBtn.addEventListener('click', () => playSongByIndex(currentIndex - 1));
  nextBtn.addEventListener('click', () => playSongByIndex(currentIndex + 1));
   // 🔊 volumen
  volumeSlider.addEventListener('wheel', (e) => {
  e.preventDefault();

  let step = 0.05;
  let newVolume = audio.volume;

  if (e.deltaY < 0) newVolume += step;
  else newVolume -= step;

  newVolume = Math.min(1, Math.max(0, newVolume));

  audio.volume = newVolume;
  volumeSlider.value = newVolume;
  volumePercent.textContent = `${Math.round(newVolume * 100)}%`;
  updateVolumeUI();
});
    volumeSlider.addEventListener('input', () => {
    const value = parseFloat(volumeSlider.value);

    audio.volume = value;
    volumePercent.textContent = `${Math.round(value * 100)}%`;

    if (audio.muted) audio.muted = false;

    updateVolumeUI();
    });
  // ⏱️ progreso
  audio.addEventListener('timeupdate', () => {
    const current = audio.currentTime;
    const duration = audio.duration || 0;

    progress.value = duration ? (current / duration) * 100 : 0;

    const format = (s) =>
      `${Math.floor(s/60)}:${Math.floor(s%60).toString().padStart(2,"0")}`;

    timeDisplay.textContent = `${format(current)} / ${format(duration)}`;
  });

  progress.addEventListener('input', () => {
    if (!audio.duration) return;
    audio.currentTime = (progress.value / 100) * audio.duration;
  });

  // 🔁 auto next
  audio.addEventListener('ended', () => playSongByIndex(currentIndex + 1));

  // ⌨️ teclado (con fix de formulario)
  document.addEventListener('keydown', (e) => {
  if (!audio.src) return;

  const active = document.activeElement;
  // ESTO PREVIENE QUE SE PAUSE LA CANCION MIESTRAS ESTOY ESCRIBIENDO
  if (active.closest("#contact-form")) return;
  if (active.closest("#contact-form-main")) return; 

  const preventKeys = ['Space', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
  if (preventKeys.includes(e.code)) e.preventDefault();

  // ▶️ Play / Pause
  if (e.code === 'Space') {
    if (audio.paused) {
      audio.play();
      playBtn.textContent = "⏸️";
    } else {
      audio.pause();
      playBtn.textContent = "▶️";
    }
  }
  if (e.key.toLowerCase() === 'm') {
        toggleMute();
    }

  // 🔊 Volumen
    if (e.code === 'ArrowUp') {
        audio.volume = Math.min(1, audio.volume + 0.05);
        volumeSlider.value = audio.volume;
        volumePercent.textContent = `${Math.round(audio.volume * 100)}%`;

        if (audio.muted) audio.muted = false;

        updateVolumeUI();
    }

    if (e.code === 'ArrowDown') {
        audio.volume = Math.max(0, audio.volume - 0.05);
        volumeSlider.value = audio.volume;
        volumePercent.textContent = `${Math.round(audio.volume * 100)}%`;

        if (audio.muted) audio.muted = false;

        updateVolumeUI();
    }

  // ⏪ ⏩ Navegar
  if (e.code === 'ArrowLeft' && !e.ctrlKey) {
    audio.currentTime = Math.max(0, audio.currentTime - 5);
  }

  if (e.code === 'ArrowRight' && !e.ctrlKey) {
    audio.currentTime = Math.min(audio.duration, audio.currentTime + 5);
  }

  // 🎵 Cambiar canción
  if (e.code === 'ArrowLeft' && e.ctrlKey) {
    playSongByIndex(currentIndex - 1);
  }

  if (e.code === 'ArrowRight' && e.ctrlKey) {
    playSongByIndex(currentIndex + 1);
  }
});
}
// ============================
