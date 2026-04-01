const currentScriptUrl = new URL(document.currentScript.src, window.location.href);
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
    "sobre.html": buildProjectUrl("pages/sobre.html").href
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
  })
  .catch((error) => {
    console.error("Erro ao carregar navbar:", error);
  });
