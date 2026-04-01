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
const statusMessage = document.getElementById("statusMessage");
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

const showStatus = (message, type = "error") => {
  if (!statusMessage) {
    return;
  }

  statusMessage.textContent = message;
  statusMessage.classList.remove("hidden", "is-error", "is-success");
  statusMessage.classList.add(type === "success" ? "is-success" : "is-error");
};

const clearStatus = () => {
  if (!statusMessage) {
    return;
  }

  statusMessage.textContent = "";
  statusMessage.classList.add("hidden");
  statusMessage.classList.remove("is-error", "is-success");
};

const signInWithProvider = async (provider, providerName) => {
  try {
    const userCredential = await signInWithPopup(auth, provider);
    console.log(`${providerName} login:`, userCredential.user);
    showStatus(`Login com ${providerName} realizado com sucesso!`, "success");
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
    showStatus(`${mensagem} (${error.code ?? "sem-codigo"})`);
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
    clearStatus();

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) {
      showStatus("Preencha todos os campos.");
      return;
    }

    submitBtn.disabled = true;
    btnContent.style.display = "none";
    btnLoading.style.display = "block";

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(userCredential.user);
        showStatus("Login realizado com sucesso!", "success");
        alert("Login realizado com sucesso!");
      })
      .catch((error) => {
        let mensagem = "Nao foi possivel realizar login.";

        if (error.code === "auth/user-not-found") {
          mensagem = "Usuario nao existe.";
        } else if (error.code === "auth/wrong-password") {
          mensagem = "Senha incorreta.";
        } else if (error.code === "auth/invalid-credential") {
          mensagem = "E-mail ou senha invalidos.";
        } else if (error.code === "auth/invalid-email") {
          mensagem = "O e-mail informado e invalido.";
        } else if (error.code === "auth/network-request-failed") {
          mensagem = "Falha de rede ao falar com o Firebase.";
        } else if (error.code === "auth/too-many-requests") {
          mensagem = "Muitas tentativas. Aguarde um pouco e tente novamente.";
        }

        console.error("Erro ao logar:", error.code, error.message);
        showStatus(`${mensagem} (${error.code ?? "sem-codigo"})`);
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
    clearStatus();
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) {
      showStatus("Preencha todos os campos.");
      return;
    }

    if (password.length < 6) {
      showStatus("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    registerBtn.disabled = true;
    registerContent.style.display = "none";
    registerLoading.style.display = "block";

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(userCredential.user);
        showStatus("Conta criada com sucesso! Agora voce pode fazer login.", "success");
        alert("Conta criada com sucesso! Agora voce pode fazer login.");
      })
      .catch((error) => {
        let mensagem = "Nao foi possivel criar a conta.";

        if (error.code === "auth/email-already-in-use") {
          mensagem = "Este e-mail ja esta em uso.";
        } else if (error.code === "auth/weak-password") {
          mensagem = "Senha muito fraca.";
        } else if (error.code === "auth/invalid-email") {
          mensagem = "E-mail invalido.";
        } else if (error.code === "auth/network-request-failed") {
          mensagem = "Falha de rede ao falar com o Firebase.";
        } else if (error.code === "auth/operation-not-allowed") {
          mensagem = "Cadastro por e-mail e senha nao esta ativado no Firebase.";
        }

        console.error("Erro ao criar conta:", error.code, error.message);
        showStatus(`${mensagem} (${error.code ?? "sem-codigo"})`);
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
    clearStatus();
    const email = recoveryEmailInput.value.trim();

    if (!email) {
      showStatus("Informe um e-mail para recuperar a senha.");
      return;
    }

    resetarSenha(email)
      .then(() => {
        showStatus("Solicitacao de recuperacao enviada. Verifique sua caixa de entrada e spam.", "success");
      })
      .catch(() => {});
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
