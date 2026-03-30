import { auth } from "../js/firebase.js";
import {
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";
import { resetarSenha } from "./auth.js";

const loginForm = document.getElementById("loginForm");
const googleLoginBtn = document.getElementById("googleLoginBtn");
const appleLoginBtn = document.getElementById("appleLoginBtn");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const submitBtn = document.getElementById("submitBtn");
const btnContent = document.getElementById("btnContent");
const btnLoading = document.getElementById("btnLoading");
const registerBtn = document.getElementById("registerBtn");
const registerContent = document.getElementById("registerContent");
const registerLoading = document.getElementById("registerLoading");
const toggleRecoveryBtn = document.getElementById("toggleRecuperacaoBtn");
const recoveryPanel = document.getElementById("recoveryPanel");
const recoveryEmailInput = document.getElementById("emailRecuperacao");
const recoverBtn = document.getElementById("btnRecuperar");

const signInWithProvider = async (provider, providerName) => {
  try {
    const userCredential = await signInWithPopup(auth, provider);
    console.log(`${providerName} login:`, userCredential.user);
    alert(`Login com ${providerName} realizado com sucesso!`);
  } catch (error) {
    let mensagem = `Nao foi possivel entrar com ${providerName}.`;

    if (error.code === "auth/popup-closed-by-user") {
      mensagem = `A janela de login com ${providerName} foi fechada antes de concluir.`;
    } else if (error.code === "auth/popup-blocked") {
      mensagem = `O navegador bloqueou o popup de login com ${providerName}.`;
    } else if (error.code === "auth/operation-not-allowed") {
      mensagem = `O provedor ${providerName} nao esta ativado no Firebase.`;
    } else if (error.code === "auth/account-exists-with-different-credential") {
      mensagem = "Ja existe uma conta com esse e-mail usando outro metodo de login.";
    }

    console.error(`Erro no login com ${providerName}:`, error.code, error.message);
    alert(mensagem);
  }
};

if (googleLoginBtn) {
  googleLoginBtn.addEventListener("click", () => {
    const provider = new GoogleAuthProvider();
    signInWithProvider(provider, "Google");
  });
}

if (appleLoginBtn) {
  appleLoginBtn.addEventListener("click", () => {
    const provider = new OAuthProvider("apple.com");
    provider.addScope("email");
    provider.addScope("name");
    signInWithProvider(provider, "Apple");
  });
}

if (loginForm && emailInput && passwordInput && submitBtn && btnContent && btnLoading) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) {
      alert("Preencha todos os campos");
      return;
    }

    submitBtn.disabled = true;
    btnContent.style.display = "none";
    btnLoading.style.display = "block";

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        alert("Login realizado com sucesso!");
        console.log(userCredential.user);
      })
      .catch((error) => {
        let mensagem = "Erro ao logar";

        if (error.code === "auth/user-not-found") {
          mensagem = "Usuario nao existe";
        } else if (error.code === "auth/wrong-password") {
          mensagem = "Senha incorreta";
        }

        alert(mensagem);
      })
      .finally(() => {
        submitBtn.disabled = false;
        btnContent.style.display = "block";
        btnLoading.style.display = "none";
      });
  });
}

if (registerBtn && registerContent && registerLoading && emailInput && passwordInput) {
  registerBtn.addEventListener("click", () => {
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) {
      alert("Preencha todos os campos");
      return;
    }

    if (password.length < 6) {
      alert("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    registerBtn.disabled = true;
    registerContent.style.display = "none";
    registerLoading.style.display = "block";

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        alert("Conta criada com sucesso! Agora voce pode fazer login.");
        console.log(userCredential.user);
      })
      .catch((error) => {
        let mensagem = "Erro ao criar conta";

        if (error.code === "auth/email-already-in-use") {
          mensagem = "Este e-mail ja esta em uso";
        } else if (error.code === "auth/weak-password") {
          mensagem = "Senha muito fraca";
        } else if (error.code === "auth/invalid-email") {
          mensagem = "E-mail invalido";
        }

        alert(mensagem);
      })
      .finally(() => {
        registerBtn.disabled = false;
        registerContent.style.display = "block";
        registerLoading.style.display = "none";
      });
  });
}

if (recoverBtn && recoveryEmailInput) {
  recoverBtn.addEventListener("click", () => {
    const email = recoveryEmailInput.value.trim();

    if (!email) {
      alert("Informe um e-mail para recuperar a senha");
      return;
    }

    resetarSenha(email);
  });
}

if (toggleRecoveryBtn && recoveryPanel && recoveryEmailInput) {
  toggleRecoveryBtn.addEventListener("click", () => {
    const panelWasHidden = recoveryPanel.classList.contains("hidden");

    recoveryPanel.classList.toggle("hidden");

    if (panelWasHidden) {
      recoveryEmailInput.value = emailInput ? emailInput.value.trim() : "";
      recoveryEmailInput.focus();
    }
  });
}
