// ./pitpar/js/shows.js

export const shows = [
  {
    city: "Santa Cruz",
    date: "2024-08-17",
    place: "La casa de Jack",
    status: "SHOW CONCLUIDO"
  },
  {
    city: "La Paz",
    date: "A confirmar",
    place: "El bestiario",
    status: "PROXIMAMENTE"
  }
];


function parseDate(dateStr) {
  const d = new Date(dateStr);
  return isNaN(d) ? null : d;
}

export function renderShows() {
  const section = document.getElementById("shows");
  section.innerHTML = "<h1>🎤 Shows</h1>";

  const today = new Date();

  // separar shows
  const upcoming = [];
  const past = [];
  const unknown = [];

  shows.forEach(show => {
    const d = parseDate(show.date);

    if (!d) {
      unknown.push(show); // "A confirmar"
    } else if (d >= today) {
      upcoming.push(show);
    } else {
      past.push(show);
    }
  });

  // ordenar cada grupo
  upcoming.sort((a, b) => new Date(a.date) - new Date(b.date));
  past.sort((a, b) => new Date(b.date) - new Date(a.date)); // más reciente primero

  const finalList = [...upcoming, ...unknown, ...past];

  finalList.forEach(show => {
    const showDate = parseDate(show.date);
    const isPast = showDate && showDate < today;

    const div = document.createElement("div");
    div.classList.add("show");

    if (isPast) div.classList.add("past");

    // 👇 estado opcional (nuevo)
    if (show.status) div.setAttribute("data-status", show.status);

    div.innerHTML = `
      <h3>📍 ${show.city}</h3>
      <p>📅 ${show.date}</p>
      <p>📌 ${show.place || ""}</p>
    `;

    section.appendChild(div);
  });
}

