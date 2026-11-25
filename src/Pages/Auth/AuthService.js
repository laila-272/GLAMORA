/**
 * Auth service
 *
 * POST /auth/register
 * POST /auth/verify-otp
 * POST /auth/google/token
 * POST /auth/logout
 */

const BASE = (
  import.meta.env.VITE_AUTH_API_URL ||
  "https://gallant-lightyellow-raccoon-71.hostingersite.com/api"
).replace(/\/$/, "");

const DEMO = import.meta.env.VITE_AUTH_DEMO === "true";
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

const TOKEN_KEY = "token";

export const CODE_LENGTH = 6;
export const DEMO_CODE = "123456";

export const authConfig = {
  demo: DEMO,
  hasBackend: !!BASE,
};

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function formatApiError(data) {
  if (data?.errors && typeof data.errors === "object") {
    const firstField = Object.keys(data.errors)[0];
    const firstMessage = firstField && data.errors[firstField]?.[0];
    if (firstMessage) return firstMessage;
  }
  return data?.message || "Something went wrong. Please try again.";
}

// API request
async function post(path, body = {}, authenticated = false) {
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  const token = localStorage.getItem(TOKEN_KEY);

  if (authenticated && token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response;

  try {
    response = await fetch(`${BASE}${path}`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error(
      "We couldn't reach the service. Check your connection and try again.",
    );
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (import.meta.env.DEV) {
      console.error(`[AuthService] ${path} failed (${response.status}):`, data);
    }
    throw new Error(formatApiError(data));
  }

  return data;
}

function splitName(fullName = "") {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  return {
    firstName: parts[0] || "",
    lastName: parts.slice(1).join(" "),
  };
}

// Normalize backend authentication response
function normalizeAuthResponse(response, fallbackEmail = "") {
  const result = response?.data ?? response ?? {};

  const token =
    result.token ?? result.access_token ?? result.accessToken ?? null;

  const userData = result.user ?? result.customer ?? {};
  const derived = splitName(userData.name ?? "");

  const user = {
    ...userData,
    name: userData.name ?? "",
    email: userData.email ?? result.email ?? fallbackEmail,
    firstName: userData.firstName ?? userData.first_name ?? derived.firstName,
    lastName: userData.lastName ?? userData.last_name ?? derived.lastName,
    phone: userData.phone ?? "",
  };

  return {
    token,
    user,
    isNewUser: Boolean(result.isNewUser ?? result.is_new_user ?? false),
  };
}

// Demo users storage
const DEMO_USERS = "glamora-demo-users-v1";

function demoUsers() {
  try {
    return JSON.parse(localStorage.getItem(DEMO_USERS) || "{}");
  } catch {
    return {};
  }
}

// Register / request verification code
export async function requestEmailCode(email) {
  if (DEMO) {
    await wait(500);

    return {
      status: "pending_verification",
      email,
    };
  }

  return post("/auth/register", { email });
}

// Verify OTP
export async function verifyEmailCode(email, code) {
  if (DEMO) {
    await wait(500);

    if (code !== DEMO_CODE) {
      throw new Error("That code isn't right. Please check it and try again.");
    }

    const users = demoUsers();
    const key = email.toLowerCase();
    const isNewUser = !users[key];

    if (isNewUser) {
      users[key] = {
        id: `demo-${Date.now()}`,
        email: key,
        name: "",
        firstName: "",
        lastName: "",
        phone: "",
      };

      localStorage.setItem(DEMO_USERS, JSON.stringify(users));
    }

    return {
      token: "demo-token",
      isNewUser,
      user: users[key],
    };
  }

  const response = await post("/auth/verify-otp", {
    email,
    code,
  });

  return normalizeAuthResponse(response, email);
}

// Google sign-in using ID Token
export async function signInWithGoogle(idToken) {
  if (!GOOGLE_CLIENT_ID) {
    throw new Error(
      "Google sign-in isn't set up yet. Add VITE_GOOGLE_CLIENT_ID.",
    );
  }

  if (!BASE) {
    throw new Error("Authentication service isn't connected.");
  }

  if (!idToken) {
    throw new Error("Google didn't return an ID token.");
  }

  const response = await post("/auth/google/token", {
    token: idToken,
  });

  return normalizeAuthResponse(response);
}

// Logout
export async function logoutUser() {
  if (DEMO) return;

  const token = localStorage.getItem(TOKEN_KEY);

  if (!token) return;

  return post("/auth/logout", {}, true);
}
