const chat = document.getElementById("chat");

function sendMessage() {
  const input = document.getElementById("input");
  const text = input.value;

  if (!text) return;

  // mensagem do usuário
  addMessage(text, "user");

  // resposta fake da IA
  setTimeout(() => {
    addMessage("⚠️ Mantenha a calma e siga os passos básicos de primeiros socorros.", "bot");
  }, 1000);

  input.value = "";
}

function addMessage(text, type) {
  const div = document.createElement("div");
  div.classList.add("message", type);
  div.innerText = text;
  chat.appendChild(div);

  chat.scrollTop = chat.scrollHeight;
}

/* MODAL */
function openModal(tipo) {
  const modal = document.getElementById("modal");
  const title = document.getElementById("modalTitle");
  const text = document.getElementById("modalText");

  modal.style.display = "block";
  title.innerText = tipo;

  if (tipo === "Desmaio") {
    text.innerText = "Deite a pessoa, levante as pernas e chame ajuda.";
  }

  if (tipo === "Engasgo") {
    text.innerText = "Faça a manobra de Heimlich.";
  }

  if (tipo === "Parada Cardíaca") {
    text.innerText = "Inicie RCP imediatamente.";
  }

  if (tipo === "Crise Epiléptica") {
    text.innerText = "Proteja a pessoa e não segure.";
  }
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
}