import axios from "axios";

export const GUEST_TOKEN_KEY = "glamora_guest_token";

const api = axios.create({
  baseURL: "https://gallant-lightyellow-raccoon-71.hostingersite.com/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getGuestHeaders = () => {
  const guestToken = localStorage.getItem(GUEST_TOKEN_KEY);

  return guestToken ? { "X-Guest-Token": guestToken } : {};
};

export const saveGuestToken = (guestToken) => {
  if (guestToken) {
    localStorage.setItem(GUEST_TOKEN_KEY, guestToken);
  }
};

export default api;
