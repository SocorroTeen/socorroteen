import { auth } from "./firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";
import { getUserProfile, clearCurrentUser, saveUserProfile } from "./userSession.js";

const profileName = document.getElementById("profileName");
const profileEmail = document.getElementById("profileEmail");
const profileAge = document.getElementById("profileAge");
const profileAvatar = document.getElementById("profileAvatar");
const avatarInput = document.getElementById("avatarInput");
const editNameBtn = document.getElementById("editNameBtn");
const editNameRow = document.getElementById("editNameRow");
const editNameInput = document.getElementById("editNameInput");
const saveNameBtn = document.getElementById("saveNameBtn");
const cancelNameBtn = document.getElementById("cancelNameBtn");
const editAgeBtn = document.getElementById("editAgeBtn");
const editAgeRow = document.getElementById("editAgeRow");
const editAgeInput = document.getElementById("editAgeInput");
const saveAgeBtn = document.getElementById("saveAgeBtn");
const cancelAgeBtn = document.getElementById("cancelAgeBtn");
const logoutBtn = document.getElementById("logoutBtn");

let currentUser = null;
let currentProfile = null;

const redirectToLogin = () => {
  window.location.href = "indexLogin.html";
};

const renderProfile = (user) => {
  const profile = getUserProfile(user.uid);
  currentUser = user;
  currentProfile = profile;
  
  profileName.textContent = profile?.name || user.displayName || "Usuário";
  profileEmail.textContent = user.email || "Não informado";
  profileAge.textContent = profile?.age || "—";
  
  const avatar = profile?.avatar || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%231e4db7' width='100' height='100'/%3E%3Ctext x='50' y='50' font-size='50' fill='white' text-anchor='middle' dy='.3em'%3E%F0%9F%91%A4%3C/text%3E%3C/svg%3E";
  profileAvatar.src = avatar;
};

if (editNameBtn) {
  editNameBtn.addEventListener("click", () => {
    editNameRow.classList.remove("hidden");
    editNameInput.value = profileName.textContent;
    editNameInput.focus();
  });
}

if (cancelNameBtn) {
  cancelNameBtn.addEventListener("click", () => {
    editNameRow.classList.add("hidden");
  });
}

if (saveNameBtn) {
  saveNameBtn.addEventListener("click", async () => {
    const newName = editNameInput.value.trim();
    if (!newName) return;
    
    const updatedProfile = { ...currentProfile, name: newName };
    saveUserProfile(currentUser.uid, updatedProfile);
    profileName.textContent = newName;
    editNameRow.classList.add("hidden");
  });
}

if (editAgeBtn) {
  editAgeBtn.addEventListener("click", () => {
    editAgeRow.classList.remove("hidden");
    editAgeInput.value = profileAge.textContent === "—" ? "" : profileAge.textContent;
    editAgeInput.focus();
  });
}

if (cancelAgeBtn) {
  cancelAgeBtn.addEventListener("click", () => {
    editAgeRow.classList.add("hidden");
  });
}

if (saveAgeBtn) {
  saveAgeBtn.addEventListener("click", async () => {
    const newAge = editAgeInput.value.trim();
    if (!newAge) return;
    
    const ageNum = Number(newAge);
    if (!Number.isInteger(ageNum) || ageNum < 1) {
      alert("Informe uma idade válida");
      return;
    }
    
    const updatedProfile = { ...currentProfile, age: newAge };
    saveUserProfile(currentUser.uid, updatedProfile);
    profileAge.textContent = newAge;
    editAgeRow.classList.add("hidden");
  });
}

if (avatarInput) {
  avatarInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const imageData = event.target.result;
      profileAvatar.src = imageData;
      const updatedProfile = { ...currentProfile, avatar: imageData };
      saveUserProfile(currentUser.uid, updatedProfile);
    };
    reader.readAsDataURL(file);
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    try {
      await signOut(auth);
      clearCurrentUser();
      redirectToLogin();
    } catch (error) {
      console.error("Erro ao sair:", error);
    }
  });
}

onAuthStateChanged(auth, (user) => {
  if (!user) {
    clearCurrentUser();
    redirectToLogin();
    return;
  }

  renderProfile(user);
});
