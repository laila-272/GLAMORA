/**
 * Auth service layer — the ONLY place that talks to a backend.
 *
 * Expected backend contract (set VITE_AUTH_API_URL, e.g. https://api.example.com):
 *   POST {base}/auth/email/request   { email }                → 200 (backend e-mails a one-time code)
 *   POST {base}/auth/email/verify    { email, code }          → 200 { token, isNewUser, user: { id, email, firstName?, lastName?, phone? } }
 *   POST {base}/auth/google          { accessToken }          → 200 { token, isNewUser, user: {...} }
 * Error responses should be JSON with a human-readable `message`.
 * The backend must "log in if the email exists, otherwise create the account" on verify / google.
 *
 * Google needs VITE_GOOGLE_CLIENT_ID (OAuth Web client) plus the endpoint above.
 *
 * Optional local demo (no backend, no e-mail is sent): set VITE_AUTH_DEMO=true and use code 123456.
 */
const BASE = (import.meta.env.VITE_AUTH_API_URL || "").replace(/\/$/, "");
const DEMO = import.meta.env.VITE_AUTH_DEMO === "true";
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

export const CODE_LENGTH = 6;
export const DEMO_CODE = "123456";
export const authConfig = { demo: DEMO, hasBackend: !!BASE };

const NOT_CONNECTED =
  "Sign-in isn't connected to a service yet. Add VITE_AUTH_API_URL (see services/authService.js).";
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function post(path, body) {
  let res;
  try {
    res = await fetch(`${BASE}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error(
      "We couldn't reach the sign-in service. Check your connection and try again.",
    );
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok)
    throw new Error(data.message || "Something went wrong. Please try again.");
  return data;
}

// ---- demo store (localStorage) so "existing vs new email" can be exercised without a backend
const DEMO_USERS = "glamora-demo-users-v1";
const demoUsers = () => {
  try {
    return JSON.parse(localStorage.getItem(DEMO_USERS) || "{}");
  } catch {
    return {};
  }
};

export async function requestEmailCode(email) {
  if (DEMO) {
    await wait(500);
    return;
  }
  if (!BASE) throw new Error(NOT_CONNECTED);
  await post("/auth/email/request", { email });
}

export async function verifyEmailCode(email, code) {
  if (DEMO) {
    await wait(500);
    if (code !== DEMO_CODE)
      throw new Error("That code isn't right. Please check it and try again.");
    const users = demoUsers();
    const key = email.toLowerCase();
    const isNewUser = !users[key];
    if (isNewUser) {
      users[key] = {
        id: `demo-${Date.now()}`,
        email: key,
        firstName: "",
        lastName: "",
        phone: "",
      };
      localStorage.setItem(DEMO_USERS, JSON.stringify(users));
    }
    return { token: "demo-token", isNewUser, user: users[key] };
  }
  if (!BASE) throw new Error(NOT_CONNECTED);
  return post("/auth/email/verify", { email, code });
}

function loadGoogleScript() {
  return new Promise((resolve, reject) => {
    if (window.google?.accounts?.oauth2) return resolve();
    const s = document.createElement("script");
    s.src = "https://accounts.google.com/gsi/client";
    s.async = true;
    s.onload = resolve;
    s.onerror = () => reject(new Error("Google sign-in couldn't be loaded."));
    document.head.appendChild(s);
  });
}

export async function signInWithGoogle() {
  if (!GOOGLE_CLIENT_ID)
    throw new Error(
      "Google sign-in isn't set up yet. Add VITE_GOOGLE_CLIENT_ID and a backend /auth/google endpoint.",
    );
  if (!BASE) throw new Error(NOT_CONNECTED);
  await loadGoogleScript();
  const accessToken = await new Promise((resolve, reject) => {
    const client = window.google.accounts.oauth2.initTokenClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: "openid email profile",
      callback: (r) =>
        r.error
          ? reject(new Error("Google sign-in was cancelled."))
          : resolve(r.access_token),
      error_callback: () => reject(new Error("Google sign-in was cancelled.")),
    });
    client.requestAccessToken();
  });
  return post("/auth/google", { accessToken });
}
