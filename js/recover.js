import { resetarSenha } from "./auth.js";

const recoverForm = document.getElementById("recoverForm");
const emailInput = document.getElementById("email");
const statusMessage = document.getElementById("statusMessage");
const submitBtn = document.getElementById("submitBtn");
const btnContent = document.getElementById("btnContent");
const btnLoading = document.getElementById("btnLoading");

const showStatus = (message, type = "error") => {
  if (!statusMessage) return;
  statusMessage.textContent = message;
  statusMessage.classList.remove("hidden", "is-error", "is-success");
  statusMessage.classList.add(type === "success" ? "is-success" : "is-error");
};

const clearStatus = () => {
  if (!statusMessage) return;
  statusMessage.textContent = "";
  statusMessage.classList.add("hidden");
  statusMessage.classList.remove("is-error", "is-success");
};

if (recoverForm && emailInput && submitBtn && btnContent && btnLoading) {
  recoverForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearStatus();

    const email = emailInput.value.trim();

    if (!email) {
      showStatus("Informe um e-mail para recuperar a senha.");
      return;
    }

    submitBtn.disabled = true;
    btnContent.style.display = "none";
    btnLoading.style.display = "block";

    try {
      await resetarSenha(email);
      showStatus("Solicitação de recuperação enviada. Verifique sua caixa de entrada e spam.", "success");
    } catch (error) {
      let mensagem = "Não foi possível enviar o link de recuperação.";

      if (error?.code === "auth/invalid-email") {
        mensagem = "O e-mail informado é inválido.";
      } else if (error?.code === "auth/user-not-found") {
        mensagem = "Não existe conta cadastrada com esse e-mail.";
      } else if (error?.code === "auth/network-request-failed") {
        mensagem = "Falha de rede ao falar com o Firebase.";
      }

      console.error("Erro ao enviar recuperação:", error?.code, error?.message);
      showStatus(`${mensagem} (${error?.code ?? "sem-codigo"})`);
    } finally {
      submitBtn.disabled = false;
      btnContent.style.display = "block";
      btnLoading.style.display = "none";
    }
  });
}
