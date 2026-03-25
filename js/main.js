fetch("components/navbar.html")
  .then(res => res.text())
  .then(data => {
    document.getElementById("navbar").innerHTML = data;

    // ATIVAR LINK ATUAL AUTOMATICAMENTE
    const links = document.querySelectorAll(".menu a");
    links.forEach(link => {
      if (link.href === window.location.href) {
        link.classList.add("active");
      }
    });
  });