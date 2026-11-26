import api, { getAuthHeaders } from "./api.js";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

export const CODE_LENGTH = 6;

function formatApiError(error) {
  const data = error.response?.data;

  if (data?.errors && typeof data.errors === "object") {
    const firstField = Object.keys(data.errors)[0];
    const firstMessage = firstField && data.errors[firstField]?.[0];

    if (firstMessage) return firstMessage;
  }

  return (
    data?.message || error.message || "Something went wrong. Please try again."
  );
}

// Request email verification code
export async function requestEmailCode(email) {
  try {
    const response = await api.post("/auth/register", { email });

    return response.data;
  } catch (error) {
    throw new Error(formatApiError(error));
  }
}

// Verify OTP
export async function verifyEmailCode(email, code) {
  try {
    const response = await api.post("/auth/verify-otp", {
      email,
      code,
    });

    return response.data;
  } catch (error) {
    throw new Error(formatApiError(error));
  }
}

// Google sign-in
export async function signInWithGoogle(idToken) {
  if (!GOOGLE_CLIENT_ID) {
    throw new Error(
      "Google sign-in isn't set up yet. Add VITE_GOOGLE_CLIENT_ID.",
    );
  }

  if (!idToken) {
    throw new Error("Google didn't return an ID token.");
  }

  try {
    const response = await api.post("/auth/google/token", {
      token: idToken,
    });

    return response.data;
  } catch (error) {
    throw new Error(formatApiError(error));
  }
}

// Logout
export async function logoutUser() {
  const token = localStorage.getItem("token");

  if (!token) return;

  try {
    const response = await api.post(
      "/auth/logout",
      {},
      { headers: getAuthHeaders() },
    );

    return response.data;
  } catch (error) {
    throw new Error(formatApiError(error));
  }
}
