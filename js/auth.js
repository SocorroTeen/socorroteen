import { auth } from "./firebase.js";
import {
  sendPasswordResetEmail,
  sendEmailVerification,
  updatePassword,
  updateEmail
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";

export const resetarSenha = (email) => {
  return sendPasswordResetEmail(auth, email)
    .then(() => {
      alert("E-mail de redefinicao enviado!");
    })
    .catch((error) => {
      let mensagem = "Nao foi possivel enviar o e-mail de recuperacao.";

      if (error.code === "auth/invalid-email") {
        mensagem = "O e-mail informado e invalido.";
      } else if (error.code === "auth/missing-email") {
        mensagem = "Informe um e-mail para continuar.";
      } else if (error.code === "auth/user-not-found") {
        mensagem = "Nao existe conta cadastrada com esse e-mail.";
      } else if (error.code === "auth/too-many-requests") {
        mensagem = "Muitas tentativas. Aguarde um pouco e tente novamente.";
      } else if (error.code === "auth/unauthorized-continue-uri") {
        mensagem = "O dominio de retorno nao esta autorizado no Firebase.";
      } else if (error.code === "auth/network-request-failed") {
        mensagem = "Falha de rede ao falar com o Firebase.";
      }

      console.error("Erro ao enviar recuperacao:", error.code, error.message);
      alert(mensagem);
      throw error;
    });
};

export const verificarEmail = () => {
  if (!auth.currentUser) return alert("Usuario nao logado!");

  return sendEmailVerification(auth.currentUser)
    .then(() => alert("Link de verificacao enviado!"));
};

export const alterarSenha = (novaSenha) => {
  const user = auth.currentUser;
  if (!user) return alert("Usuario nao logado!");

  return updatePassword(user, novaSenha)
    .then(() => alert("Senha atualizada!"))
    .catch((error) => {
      if (error.code === "auth/requires-recent-login") {
        alert("Por seguranca, faca login novamente antes de alterar a senha.");
      }
    });
};

export const alterarEmail = (novoEmail) => {
  if (!auth.currentUser) return alert("Usuario nao logado!");

  return updateEmail(auth.currentUser, novoEmail)
    .then(() => alert("E-mail atualizado!"))
    .catch((error) => console.error("Erro:", error.message));
};
