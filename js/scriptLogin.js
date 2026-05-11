import { auth } from "../js/firebase.js";
import {
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";
import { setCurrentUser } from "./userSession.js";

const loginForm = document.getElementById("loginForm");
const googleLoginBtn = document.getElementById("googleLoginBtn");
const appleLoginBtn = document.getElementById("appleLoginBtn");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const statusMessage = document.getElementById("statusMessage");
const submitBtn = document.getElementById("submitBtn");
const btnContent = document.getElementById("btnContent");
const btnLoading = document.getElementById("btnLoading");

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
    setCurrentUser(userCredential.user.uid);
    showStatus(`Login com ${providerName} realizado com sucesso! Redirecionando...`, "success");
    setTimeout(() => {
      window.location.href = "profile.html";
    }, 1000);
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
        setCurrentUser(userCredential.user.uid);
        showStatus("Login realizado com sucesso! Redirecionando para seu perfil...", "success");
        setTimeout(() => {
          window.location.href = "profile.html";
        }, 1000);
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


