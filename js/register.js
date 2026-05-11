import { auth } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  updateProfile
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";
import { saveUserProfile, setCurrentUser } from "./userSession.js";

const registerForm = document.getElementById("registerForm");
const nameInput = document.getElementById("name");
const ageInput = document.getElementById("age");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");
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

const validateAge = (ageValue) => {
  const ageNumber = Number(ageValue);
  return Number.isInteger(ageNumber) && ageNumber > 0;
};

if (registerForm && nameInput && ageInput && emailInput && passwordInput && confirmPasswordInput && submitBtn && btnContent && btnLoading) {
  registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearStatus();

    const name = nameInput.value.trim();
    const age = ageInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    if (!name || !age || !email || !password || !confirmPassword) {
      showStatus("Preencha todos os campos.");
      return;
    }

    if (!validateAge(age)) {
      showStatus("Informe uma idade válida.");
      return;
    }

    if (password.length < 6) {
      showStatus("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      showStatus("As senhas não conferem.");
      return;
    }

    submitBtn.disabled = true;
    btnContent.style.display = "none";
    btnLoading.style.display = "block";

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      saveUserProfile(userCredential.user.uid, { name, age, email });
      setCurrentUser(userCredential.user.uid);
      showStatus("Conta criada com sucesso! Redirecionando para seu perfil...", "success");
      setTimeout(() => {
        window.location.href = "profile.html";
      }, 1200);
    } catch (error) {
      let mensagem = "Não foi possível criar a conta.";

      if (error.code === "auth/email-already-in-use") {
        mensagem = "Este e-mail já está em uso.";
      } else if (error.code === "auth/weak-password") {
        mensagem = "Senha muito fraca.";
      } else if (error.code === "auth/invalid-email") {
        mensagem = "E-mail inválido.";
      } else if (error.code === "auth/network-request-failed") {
        mensagem = "Falha de rede ao falar com o Firebase.";
      } else if (error.code === "auth/operation-not-allowed") {
        mensagem = "Cadastro por e-mail e senha não está ativado no Firebase.";
      }

      console.error("Erro ao criar conta:", error.code, error.message);
      showStatus(`${mensagem} (${error.code ?? "sem-codigo"})`);
    } finally {
      submitBtn.disabled = false;
      btnContent.style.display = "block";
      btnLoading.style.display = "none";
    }
  });
}
