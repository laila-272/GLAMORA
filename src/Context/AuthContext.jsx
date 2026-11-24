import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { useAccount } from "./AccountContext";
import AuthModal from "../Pages/Auth/AuthModal.jsx";

const KEY = "glamora-auth-v1";
const AuthContext = createContext(null);

function load() {
  try {
    const d = JSON.parse(localStorage.getItem(KEY) || "null");
    return d?.user?.email ? d : null;
  } catch {
    return null;
  }
}

/** Must sit inside <AccountProvider>. Renders the sign-in modal itself, so no layout changes are needed. */
export function AuthProvider({ children }) {
  const { updateProfile, resetProfile } = useAccount();
  const [session, setSession] = useState(load); // { user, token } | null
  const [open, setOpen] = useState(false);

  const openAuth = useCallback(() => setOpen(true), []);
  const closeAuth = useCallback(() => setOpen(false), []);

  // Called after the backend confirms the code / Google token. Existing and new emails are handled by the backend.
  const login = useCallback(
    ({ user, token, isNewUser }) => {
      const next = { user, token, isNewUser: !!isNewUser };
      setSession(next);
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
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

  const signOut = useCallback(() => {
    setSession(null);
    try {
      localStorage.removeItem(KEY);
    } catch {
      /* ignore */
    }
    resetProfile();
  }, [resetProfile]);

  const value = useMemo(
    () => ({
      user: session?.user ?? null,
      isAuthenticated: !!session,
      isNewUser: !!session?.isNewUser,
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
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
