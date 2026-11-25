import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useAccount } from "./AccountContext";
import AuthModal from "../Pages/Auth/AuthModal.jsx";
import { logoutUser } from "../Pages/Auth/AuthService.js";

const KEY = "glamora-auth-v1";
const TOKEN_KEY = "token";

const AuthContext = createContext(null);

function load() {
  try {
    const data = JSON.parse(localStorage.getItem(KEY) || "null");

    if (data?.user?.email) {
      return data;
    }

    return null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const { updateProfile, resetProfile } = useAccount();

  const [session, setSession] = useState(load);
  const [open, setOpen] = useState(false);

  // Restore token when the application reloads
  useEffect(() => {
    if (session?.token) {
      localStorage.setItem(TOKEN_KEY, session.token);

      updateProfile({
        email: session.user.email,
        firstName: session.user.firstName ?? "",
        lastName: session.user.lastName ?? "",
        phone: session.user.phone ?? "",
      });
    }
  }, [session, updateProfile]);

  const openAuth = useCallback(() => {
    setOpen(true);
  }, []);

  const closeAuth = useCallback(() => {
    setOpen(false);
  }, []);

  // Login after successful OTP verification or Google authentication
  const login = useCallback(
    ({ user, token, isNewUser }) => {
      if (!token) {
        throw new Error(
          "Authentication succeeded without a token. Please check the API response.",
        );
      }

      if (!user?.email) {
        throw new Error(
          "User information is missing from the authentication response.",
        );
      }

      const next = {
        user,
        token,
        isNewUser: Boolean(isNewUser),
      };

      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(KEY, JSON.stringify(next));

      setSession(next);

      updateProfile({
        email: user.email,
        firstName: user.firstName ?? "",
        lastName: user.lastName ?? "",
        phone: user.phone ?? "",
      });

      setOpen(false);
    },
    [updateProfile],
  );

  // Logout
  const signOut = useCallback(async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(KEY);

      setSession(null);
      resetProfile();
      setOpen(false);
    }
  }, [resetProfile]);

  const value = useMemo(
    () => ({
      user: session?.user ?? null,
      isAuthenticated: Boolean(session?.token),
      isNewUser: Boolean(session?.isNewUser),
      authOpen: open,
      openAuth,
      closeAuth,
      login,
      signOut,
    }),
    [session, open, openAuth, closeAuth, login, signOut],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
      {open && <AuthModal />}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }

  return context;
}
