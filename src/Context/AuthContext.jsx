import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import AuthModal from "../Pages/Auth/AuthModal.jsx";
import { logoutUser } from "../Services/AuthService.js";

const KEY = "glamora-auth-v1";
const TOKEN_KEY = "token";

const AuthContext = createContext(null);

function load() {
  try {
    const data = JSON.parse(localStorage.getItem(KEY) || "null");

    if (data?.user?.email && data?.token) {
     

      return data;
    }

    
    return null;
  } catch (error) {
    
    return null;
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(load);
  const [open, setOpen] = useState(false);

  // Restore Sanctum token when application reloads.
  useEffect(() => {
    if (!session?.token) return;

    localStorage.setItem(TOKEN_KEY, session.token);

   
  }, [session]);

  const openAuth = useCallback(() => {
    setOpen(true);
  }, []);

  const closeAuth = useCallback(() => {
    setOpen(false);
  }, []);

  // Login after OTP verification or Google authentication.
  const login = useCallback(({ user, token, isNewUser }) => {
   

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
    setOpen(false);
  }, []);

  // Logout.
  const signOut = useCallback(async () => {
   
    try {
      await logoutUser();
    } catch (error) {
      console.error("🔴 Logout API error:", error);
    } finally {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(KEY);

      

      setSession(null);
      setOpen(false);

      
    }
  }, []);

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
