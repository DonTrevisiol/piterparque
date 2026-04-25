/* ./pitpar/router.js */
import { renderShows } from "./shows.js";
import { renderAlbumsInstrumentales } from "./instrumentales.js"
export function navigate(section) {
	
  document.querySelectorAll(".section").forEach(s => {
    s.style.display = "none";
  });

  const el = document.getElementById(section);
  if (el) {
    el.style.display = "block";
  }
  
  if (section === 'shows') {
	  renderShows()
  }
  if (section === 'instrumentales'){
	  renderAlbumsInstrumentales();
  }
  
  const hero = document.getElementById('hero');
  if (section === 'home') {
	  hero.style.display = 'flex';
  } else {
	  hero.style.display = 'none';
  }
  requestAnimationFrame(() => {
	  window.scrollTo(0, 0);
  });  
}
