// ./pitpar/js/shows.js

export const shows = [
/*
FORMATO:

{
  title: "Mi nuevo show",
  city: "Bogotá, Colombia",
  date: "25/06/2026",
  time: "20:00",
  place: "Teatro X",
  locationLink: "https://maps...",
  price: "50.000 COP",
  buyLink: "https://...",
  status: "" -> SOLO SE COLOCA STATUS EN CASO ESPECIAL
}

*/

  {
    title: "Presentación de Residuos Peligrosos INCOMPLETO",
    city: "Santa Cruz de La Sierra, Bolivia",
    date: "17/08/2024",
    time: "21:30",
    place: "La casa de Jack",
    locationLink: "",
    price: "30 BOB"
  },

  {
    title: "YucaWaii Fest - Presentación en vivo",
    city: "Santa Cruz de La Sierra, Bolivia",
    date: "10/05/2026",
    time: "18:00",
    place: "El salón ámboro del Gran Hotel Santa Cruz",
    locationLink: "https://maps.app.goo.gl/To55zUaSfB4oG1kk9",
    price: "Entrada libre"
  }

];


// ============================
// PARSE FECHA + HORA
// ============================
function parseDateTime(dateStr, timeStr = "00:00") {
  if (!dateStr) return null;

  const [day, month, year] = dateStr.split("/").map(Number);

  let hours = 0;
  let minutes = 0;

  if (timeStr && timeStr.includes(":")) {
    [hours, minutes] = timeStr.split(":").map(Number);
  }

  return new Date(year, month - 1, day, hours, minutes);
}


// ============================
// SOLO FECHA
// ============================
function parseOnlyDate(dateStr) {
  if (!dateStr) return null;

  const [day, month, year] = dateStr.split("/").map(Number);

  return new Date(year, month - 1, day);
}


// ============================
// FORMATO FECHA
// ============================
function formatDate(dateStr) {
  const d = parseOnlyDate(dateStr);

  if (!d) return dateStr;

  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();

  return `${day}/${month}/${year}`;
}


// ============================
// CUENTA REGRESIVA
// ============================
function getCountdownText(showDateTime, showDateOnly) {

  const now = new Date();

  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  // 🔥 HOY
  if (showDateOnly.getTime() === today.getTime()) {
    return "🔥 HOY";
  }

  const diff = showDateTime - now;

  // 🎤 FINALIZADO
  if (diff <= 0) {
    return "🎤 En curso / Finalizado";
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return `⏳ ${days}d ${hours}h ${minutes}m ${seconds}s`;
}


// ============================
// STATUS DINÁMICO
// ============================
function getDynamicStatus(show, showDateOnly) {

  // 👇 status manual prioritario
  if (show.status === "CANCELADO") {
    return "CANCELADO";
  }

  if (show.status === "SOLD OUT") {
    return "SOLD OUT";
  }

  const now = new Date();

  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  const eventDay = new Date(
    showDateOnly.getFullYear(),
    showDateOnly.getMonth(),
    showDateOnly.getDate()
  );

  // 🔥 HOY
  if (eventDay.getTime() === today.getTime()) {
    return "HOY";
  }

  // 🎤 SHOW CONCLUIDO
  if (eventDay < today) {
    return "SHOW CONCLUIDO";
  }

  // 🚀 FUTURO
  return "PROXIMAMENTE";
}


// ============================
// RENDER
// ============================
export function renderShows() {

  const section = document.getElementById("shows");

  section.innerHTML = "<h1>🎤 Shows</h1>";

  const now = new Date();

  const upcoming = [];
  const past = [];
  const unknown = [];

  shows.forEach(show => {

    const d = parseDateTime(show.date, show.time);

    if (!d) {
      unknown.push(show);
    }

    else if (d >= now) {
      upcoming.push(show);
    }

    else {
      past.push(show);
    }

  });

  upcoming.sort(
    (a, b) =>
      parseDateTime(a.date, a.time) -
      parseDateTime(b.date, b.time)
  );

  past.sort(
    (a, b) =>
      parseDateTime(b.date, b.time) -
      parseDateTime(a.date, a.time)
  );

  const finalList = [
    ...upcoming,
    ...unknown,
    ...past
  ];

  finalList.forEach(show => {

    const showDateTime = parseDateTime(show.date, show.time);

    const showDateOnly = parseOnlyDate(show.date);

    const dynamicStatus = getDynamicStatus(
      show,
      showDateOnly
    );

    const isPast =
      showDateTime &&
      showDateTime < now;

    const div = document.createElement("div");

    div.classList.add("show");

    // 👇 deshabilitar
    if (
      isPast ||
      dynamicStatus === "SOLD OUT" ||
      dynamicStatus === "CANCELADO"
    ) {
      div.classList.add("disabled");
    }

    // 👇 status visual
    div.setAttribute(
      "data-status",
      dynamicStatus
    );

    const countdownId =
      "countdown-" +
      Math.random()
        .toString(36)
        .substr(2, 9);

    div.innerHTML = `
      <h2>🎶 ${show.title}</h2>

      <p>📍 ${show.city}</p>

      <p>📅 ${formatDate(show.date)}</p>

      <p>⏰ ${show.time || "A confirmar"}</p>

      <p>📌 ${
        show.locationLink
          ? `<a href="${show.locationLink}" target="_blank" class="location-link">${show.place}</a>`
          : show.place || ""
      }</p>

      <p>💸 ${show.price || "A confirmar"}</p>

      ${
        showDateTime && !isPast
          ? `<p id="${countdownId}" class="countdown"></p>`
          : ""
      }

      ${
        show.buyLink &&
        !(
          isPast ||
          dynamicStatus === "SOLD OUT" ||
          dynamicStatus === "CANCELADO"
        )
          ? `<a href="${show.buyLink}" target="_blank" class="buy-btn">🎟 Comprar entrada</a>`
          : ""
      }
    `;

    section.appendChild(div);

    // ====================
    // TIMER
    // ====================
    if (showDateTime && !isPast) {

      const el =
        document.getElementById(countdownId);

      const update = () => {

        el.textContent =
          getCountdownText(
            showDateTime,
            showDateOnly
          );

        // 🔴 rojo últimos 10 min
        const diff =
          showDateTime - new Date();

        if (
          diff > 0 &&
          diff <= 10 * 60 * 1000
        ) {
          el.style.color = "red";
        }

      };

      update();

      setInterval(update, 1000);

    }

  });

}
