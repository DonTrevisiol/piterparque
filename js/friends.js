/* ./pitpar/js/friends.js */

// =======================
// DATA
// =======================
export const friends = [
  {
    name: "Lo vi x TV",
    img: "assets/img/amigos/lo_vi_x_tv.jpg",
    links: {
      instagram: "https://www.instagram.com/lo.vi.x.tv/",
      spotify: "https://open.spotify.com/intl-es/album/0c7VXnIbMgTc6xY1Xa7Ki1",
      youtube: "https://music.youtube.com/playlist?list=OLAK5uy_lgv6BVfj_WPeOoHEupJsb3JK9Nf0pxSIA"

    }
  },
  {
    name: "Claudel y sin fronteras",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7BVfeeBOz2FGOCchHYHIX9aoblx6h_8J_ww&s",
    links: {
      instagram: "https://www.instagram.com/claudelysinfronteras",
      youtube: "http://www.youtube.com/@claudelysinfronteras",
      facebook: "https://www.facebook.com/Claudelysinfronteras"
    }
  },
  {
    name: "CR5",
    img: "assets/img/amigos/crfive.jpg",
    links: {
      youtube: "https://youtube.com/@crfive5?si=0MJ1wuqNtcLF41lY"
    }
  }
];

// =======================
// ICONOS
// =======================
const socialIcons = {
  instagram: "assets/img/social/instagram.svg",
  youtube: "assets/img/social/youtube.svg",
  facebook: "assets/img/social/facebook.svg",
  tiktok: "assets/img/social/tiktok.svg",
  twitter: "assets/img/social/x.svg",
  soundcloud: "assets/img/social/sound_cloud.svg",
  messenger: "assets/img/social/messenger.svg",
  spotify: "assets/img/social/spotify.svg"
};

// =======================
// RENDER AMIGOS
// =======================
export function renderFriends() {
  const container = document.querySelector(".friends");
  container.innerHTML = "";

  friends.forEach((friend, index) => {
    const div = document.createElement("div");
    div.classList.add("friend");

    div.innerHTML = `
      <img src="${friend.img}" alt="${friend.name}">
      <p>${friend.name}</p>
    `;

    div.addEventListener("click", () => openModal(index));

    container.appendChild(div);
  });
}

// =======================
// ABRIR MODAL
// =======================
function openModal(index) {
  const friend = friends[index];

  const modal = document.getElementById("friend-modal");
  const name = document.getElementById("friend-name");
  const linksContainer = document.getElementById("friend-links");

  name.textContent = friend.name;
  linksContainer.innerHTML = "";

  // 🔥 SOLO recorre las redes que EXISTEN
  Object.entries(friend.links).forEach(([key, url]) => {
    
    // 👇 si no hay icono definido, lo ignora
    if (!socialIcons[key]) return;

    const a = document.createElement("a");
    a.href = url;
    a.target = "_blank";
    a.classList.add("friend-icon-link");

    const img = document.createElement("img");
    img.src = socialIcons[key];
    img.alt = key;

    a.appendChild(img);
    linksContainer.appendChild(a);
  });

  modal.classList.remove("hidden");
}

// =======================
// CERRAR MODAL
// =======================
export function initFriendsModal() {
  const modal = document.getElementById("friend-modal");

  modal.addEventListener("click", (e) => {
    if (e.target.id === "friend-modal") {
      modal.classList.add("hidden");
    }
  });
}
