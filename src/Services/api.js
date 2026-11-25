import axios from "axios";

const GUEST_TOKEN_KEY = "glamora_guest_token";

const api = axios.create({
  baseURL: "https://gallant-lightyellow-raccoon-71.hostingersite.com/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Attach authentication and guest cart tokens.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  const guestToken = localStorage.getItem(GUEST_TOKEN_KEY);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (guestToken) {
    config.headers["X-Guest-Token"] = guestToken;
  }

  return config;
});

// Save guest token returned by cart endpoints.
api.interceptors.response.use(
  (response) => {
    const guestToken = response.data?.guest_token;

    if (guestToken) {
      localStorage.setItem(GUEST_TOKEN_KEY, guestToken);
    }

    return response;
  },
  (error) => Promise.reject(error),
);

export default api;
