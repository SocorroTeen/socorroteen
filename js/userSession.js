const USERS_KEY = "socorroteenUsers";
const CURRENT_USER_KEY = "socorroteenCurrentUser";

export const loadUsers = () => {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) ?? "{}");
  } catch {
    return {};
  }
};

export const saveUserProfile = (uid, profile) => {
  const users = loadUsers();
  users[uid] = profile;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const getUserProfile = (uid) => {
  const users = loadUsers();
  return users[uid] ?? null;
};

export const setCurrentUser = (uid) => {
  localStorage.setItem(CURRENT_USER_KEY, uid);
};

export const getCurrentUserUid = () => {
  return localStorage.getItem(CURRENT_USER_KEY);
};

export const clearCurrentUser = () => {
  localStorage.removeItem(CURRENT_USER_KEY);
};
