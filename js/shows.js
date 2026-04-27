// ./pitpar/js/shows.js

export const shows = [
	/*date: "AAAA/MM/DD",
	 *buyLink: "paraComprarEntradas.com",
	 *locationLink: "Para que te pasen la ubicación"
	*/
  {
	title: "Presentación de Residuos Peligrosos INCOMPLETO",
    city: "Santa Cruz de La Sierra, Bolivia",
    date: "2024-08-17",
    time: "21:30",
    place: "La casa de Jack",
    locationLink: "",
    price: "30 BOB",
    status: "SHOW CONCLUIDO"
  },
  {
	title: "YucaWaii Fest - Presentación en vivo",
    city: "Santa Cruz de La Sierra, Bolivia",
    date: "2026-05-10",
    time: "A confirmar",
    place: "El salón ámboro del Gran Hotel Santa Cruz",
    locationLink: "https://maps.app.goo.gl/To55zUaSfB4oG1kk9",
    price: "Entrada libre",
    status: "PROXIMAMENTE"
  }
];


function parseDate(dateStr) {
  const d = new Date(dateStr);
  return isNaN(d) ? null : d;
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;

  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();

  return `${day}/${month}/${year}`;
}

export function renderShows() {
  const section = document.getElementById("shows");
  section.innerHTML = "<h1>🎤 Shows</h1>";

  const today = new Date();

  const upcoming = [];
  const past = [];
  const unknown = [];

  shows.forEach(show => {
    const d = new Date(show.date);

    if (isNaN(d)) {
      unknown.push(show);
    } else if (d >= today) {
      upcoming.push(show);
    } else {
      past.push(show);
    }
  });

  upcoming.sort((a, b) => new Date(a.date) - new Date(b.date));
  past.sort((a, b) => new Date(b.date) - new Date(a.date));

  const finalList = [...upcoming, ...unknown, ...past];

  finalList.forEach(show => {
    const showDate = new Date(show.date);
    const isPast = !isNaN(showDate) && showDate < today;

    const div = document.createElement("div");
    div.classList.add("show");

    // estado visual gris
    if (isPast || show.status === "SOLD OUT" || show.status === "CANCELADO") {
      div.classList.add("disabled");
    }

    if (show.status) {
      div.setAttribute("data-status", show.status);
    }

    div.innerHTML = `
      <h2>🎶 ${show.title}</h2>

      <p>📍 ${show.city}</p>
      <p>📅 ${formatDate(show.date)}</p>
      <p>⏰ ${show.time || "A confirmar"}</p>
      <p>📌 ${show.locationLink
      ? `<a href="${show.locationLink}" target="_blank" class="location-link">${show.place}</a>`
      : show.place || ""}
      </p>

      <p>💸 ${show.price || "A confirmar"}</p>

      ${
        show.buyLink && !div.classList.contains("disabled")
          ? `<a href="${show.buyLink}" target="_blank" class="buy-btn">🎟 Comprar entrada</a>`
          : ""
      }
    `;

    section.appendChild(div);
  });
}
