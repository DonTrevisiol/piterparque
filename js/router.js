/* ./pitpar/router.js */
import { renderShows } from "./shows.js";

export function navigate(section, addToHistory = true) {

  document.querySelectorAll(".section").forEach(s => {
    s.style.display = "none";
  });

  const el = document.getElementById(section);
  if (el) {
    el.style.display = "block";
  }

  // 👉 GUARDAR EN HISTORIAL
  if (addToHistory) {
    history.pushState({ section }, "", `#${section}`);
  }

  // renders especiales
  if (section === 'shows') renderShows();


  const hero = document.getElementById('hero');
  hero.style.display = (section === 'home') ? 'flex' : 'none';

  setTimeout(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, 50);
}

