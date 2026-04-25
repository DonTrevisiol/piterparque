/* ./pitpar/js/app.js */
import { navigate } from "./router.js";
import { albums } from "./songs.js";
import { initPlayer, playSongByIndex } from "./player/player.js";
import { setupForm } from "./form.js";
import { renderAlbumsInstrumentales } from "./instrumentales.js"
import { setupMenu } from "./menu.js";
import { renderAlbums as renderAlbumsMusica } from "./musica.js";
import { renderAlbumsDescargas } from "./descargas.js";
import { renderAlbumsLetras } from "./letras.js";

// Inicializar navegación
window.navigate = navigate;
navigate("home");

// Inicializar menú hamburguesa
setupMenu();

// Inicializar reproductor
const songs = albums.flatMap(album => (album.songs || []).map(song => ({
  ...song,
  folder: album.folder
})));

initPlayer(songs);
playSongByIndex(0, false);
window.playSongByIndex = playSongByIndex;

document.addEventListener("click", (e) => {
  const show = e.target.closest(".show");
  if (!show) return;

  show.classList.toggle("open");
});

window.addEventListener("DOMContentLoaded", () => {
	fetch("https://piterparque.goatcounter.com/counter/piterparque.json")
  .then(res => res.json())
  .then(data => {
    const el = document.getElementById("gc-counter");
    if (el) el.textContent = "👁️ " + data.count;
  })
  .catch(() => {
    const el = document.getElementById("gc-counter");
    if (el) el.textContent = "👁️ —";
  });
});

// Render inicial
renderAlbumsMusica();
renderAlbumsDescargas();
renderAlbumsLetras();
renderAlbumsInstrumentales();
// Formularios
setupForm("contact-form", "form-status", "submit-btn"); // sugerencias
setupForm("contact-form-main", "form-status-main", "submit-btn-main"); // contacto
