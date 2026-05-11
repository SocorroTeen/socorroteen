import { auth } from "./firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";
import { getUserProfile } from "./userSession.js";

const currentScriptUrl = new URL(import.meta.url);
const projectRootUrl = new URL("../", currentScriptUrl);

const buildProjectUrl = (relativePath) => new URL(relativePath, projectRootUrl);

const ensureNavbarCss = () => {
  const existing = document.querySelector('link[data-navbar-css="true"]');
  if (existing) {
    return;
  }

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = buildProjectUrl("css/navbar.css").href;
  link.dataset.navbarCss = "true";
  document.head.appendChild(link);
};

const wireNavbarPaths = () => {
  const logoImg = document.querySelector(".navbar .logo-img");
  if (logoImg) {
    logoImg.src = buildProjectUrl("assets/logo.png").href;
  }

  const pathMap = {
    "index.html": buildProjectUrl("index.html").href,
    "indexLogin.html": buildProjectUrl("pages/indexLogin.html").href,
    "primeiros-socorros.html": buildProjectUrl("pages/primeiros-socorros.html").href,
    "socorro-ia.html": buildProjectUrl("pages/socorro-ia.html").href,
    "simulador.html": buildProjectUrl("pages/simulador.html").href,
    "ranking.html": buildProjectUrl("pages/ranking.html").href,
    "sobre.html": buildProjectUrl("pages/sobre.html").href,
    "profile.html": buildProjectUrl("pages/profile.html").href
  };

  document.querySelectorAll(".navbar a[href]").forEach((link) => {
    const href = link.getAttribute("href");
    if (!href) {
      return;
    }

    const filename = href.split("/").pop();
    if (pathMap[filename]) {
      link.href = pathMap[filename];
    }
  });
};

const markActiveLink = () => {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  const links = document.querySelectorAll(".menu a, .mobile-menu a");

  links.forEach((link) => {
    const href = link.getAttribute("href");
    if (!href) {
      return;
    }

    const linkPage = href.split("/").pop();
    if (linkPage === currentPage) {
      link.classList.add("active");
    }
  });
};

const logout = async () => {
  try {
    await signOut(auth);
    localStorage.removeItem("socorroteenCurrentUser");
    window.location.href = buildProjectUrl("pages/indexLogin.html").href;
  } catch (error) {
    console.error("Erro ao sair:", error);
  }
};

const updateUserArea = (user) => {
  const userArea = document.getElementById("userArea");
  const mobileUserArea = document.getElementById("mobileUserArea");
  const profileHref = buildProjectUrl("pages/profile.html").href;

  if (!userArea || !mobileUserArea) {
    return;
  }

  if (!user) {
    userArea.innerHTML = ``;
    mobileUserArea.innerHTML = ``;
    return;
  }

  const profile = getUserProfile(user.uid);
  const age = profile?.age || "—";

  userArea.innerHTML = `
    <a class="user-profile-btn" href="${profileHref}" title="Meu Perfil">👤 ${age}</a>
  `;

  mobileUserArea.innerHTML = `
    <a class="mobile-link" href="${profileHref}">👤 Perfil (${age} anos)</a>
  `;
};

window.toggleMenu = () => {
  const mobileMenu = document.getElementById("mobileMenu");
  if (mobileMenu) {
    mobileMenu.classList.toggle("show");
  }
};

ensureNavbarCss();

fetch(buildProjectUrl("components/navbar.html").href)
  .then((response) => {
    if (!response.ok) {
      throw new Error(`Falha ao carregar navbar: ${response.status}`);
    }

    return response.text();
  })
  .then((data) => {
    const container = document.getElementById("navbar-container");
    if (!container) {
      return;
    }

    container.innerHTML = data;
    wireNavbarPaths();
    markActiveLink();

    onAuthStateChanged(auth, (user) => {
      if (!user) {
        localStorage.removeItem("socorroteenCurrentUser");
      }
      updateUserArea(user);
    });
  })
  .catch((error) => {
    console.error("Erro ao carregar navbar:", error);
  });
