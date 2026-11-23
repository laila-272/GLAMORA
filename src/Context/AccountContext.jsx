import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

// Demo profile. There is no auth/backend in the project, so the profile is kept in localStorage.
export const DEFAULT_PROFILE = {
  firstName: "Salma",
  lastName: "Hassan",
  phone: "+20 100 123 4567",
  email: "salma.hassan@example.com",
};
const STORAGE_KEY = "glamora-account-v1";
const ADDRESS_KEY = "glamora-addresses-v1";
const SAVED_KEY = "glamora-wishlist-v1";
const PREFS_KEY = "glamora-preferences-v1";

// Demo defaults: the three products shown in the Saved scents design.
export const DEFAULT_SAVED = [1, 2, 3];
export const DEFAULT_PREFS = { arrivals: true, stories: true, offers: false };

function loadSaved() {
  try {
    const d = JSON.parse(localStorage.getItem(SAVED_KEY) || "null");
    return Array.isArray(d) ? d.filter(Number.isInteger) : DEFAULT_SAVED;
  } catch {
    return DEFAULT_SAVED;
  }
}
function loadPrefs() {
  try {
    return {
      ...DEFAULT_PREFS,
      ...JSON.parse(localStorage.getItem(PREFS_KEY) || "{}"),
    };
  } catch {
    return DEFAULT_PREFS;
  }
}

export const DEFAULT_ADDRESSES = [
  {
    id: "home",
    label: "Home",
    name: "Salma Hassan",
    street: "18 El Nozha Street",
    apartment: "Apartment 4, Floor 2",
    area: "Heliopolis",
    city: "Cairo",
    country: "Egypt",
    phone: "+20 100 123 4567",
    note: "Building entrance beside the pharmacy.",
    isDefault: true,
  },
  {
    id: "work",
    label: "Work",
    name: "Salma Hassan",
    street: "12 Example Avenue",
    apartment: "Office 6",
    area: "Maadi",
    city: "Cairo",
    country: "Egypt",
    phone: "+20 100 123 4567",
    isDefault: false,
  },
];

function loadAddresses() {
  try {
    const d = JSON.parse(localStorage.getItem(ADDRESS_KEY) || "null");
    return Array.isArray(d) ? d : DEFAULT_ADDRESSES;
  } catch {
    return DEFAULT_ADDRESSES;
  }
}

// Exactly one default address whenever the list is not empty.
const normalize = (list) =>
  list.length && !list.some((a) => a.isDefault)
    ? list.map((a, i) => ({ ...a, isDefault: i === 0 }))
    : list;

function load() {
  try {
    return {
      ...DEFAULT_PROFILE,
      ...JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"),
    };
  } catch {
    return DEFAULT_PROFILE;
  }
}

const AccountContext = createContext(null);

export function AccountProvider({ children }) {
  const [profile, setProfile] = useState(load);
  const [addresses, setAddresses] = useState(loadAddresses);
  const [savedIds, setSavedIds] = useState(loadSaved);
  const [preferences, setPreferences] = useState(loadPrefs);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch {
      /* ignore */
    }
  }, [profile]);

  useEffect(() => {
    try {
      localStorage.setItem(ADDRESS_KEY, JSON.stringify(addresses));
    } catch {
      /* ignore */
    }
  }, [addresses]);

  useEffect(() => {
    try {
      localStorage.setItem(SAVED_KEY, JSON.stringify(savedIds));
      localStorage.setItem(PREFS_KEY, JSON.stringify(preferences));
    } catch {
      /* ignore */
    }
  }, [savedIds, preferences]);

  // Wishlist shared by the shop, product pages and the Saved scents page.
  const toggleSaved = useCallback(
    (id) =>
      setSavedIds((l) =>
        l.includes(id) ? l.filter((x) => x !== id) : [...l, id],
      ),
    [],
  );
  const updatePreferences = useCallback(
    (patch) => setPreferences((p) => ({ ...p, ...patch })),
    [],
  );

  const saveAddress = useCallback((addr) => {
    setAddresses((list) => {
      const id = addr.id || `addr-${Date.now()}`;
      const makeDefault = addr.isDefault || list.length === 0;
      const base = addr.id
        ? list.map((a) => (a.id === id ? { ...a, ...addr } : a))
        : [...list, { ...addr, id }];
      return normalize(
        base.map((a) => (makeDefault ? { ...a, isDefault: a.id === id } : a)),
      );
    });
  }, []);
  const removeAddress = useCallback(
    (id) => setAddresses((l) => normalize(l.filter((a) => a.id !== id))),
    [],
  );
  const makeDefault = useCallback(
    (id) =>
      setAddresses((l) => l.map((a) => ({ ...a, isDefault: a.id === id }))),
    [],
  );

  const updateProfile = useCallback(
    (patch) => setProfile((p) => ({ ...p, ...patch })),
    [],
  );
  const resetProfile = useCallback(() => {
    setProfile(DEFAULT_PROFILE);
    setAddresses(DEFAULT_ADDRESSES);
    setSavedIds(DEFAULT_SAVED);
    setPreferences(DEFAULT_PREFS);
  }, []);

  const value = useMemo(
    () => ({
      profile,
      fullName: `${profile.firstName} ${profile.lastName}`.trim(),
      updateProfile,
      resetProfile,
      addresses,
      saveAddress,
      removeAddress,
      makeDefault,
      savedIds,
      toggleSaved,
      isSaved: (id) => savedIds.includes(id),
      preferences,
      updatePreferences,
    }),
    [
      profile,
      updateProfile,
      resetProfile,
      addresses,
      saveAddress,
      removeAddress,
      makeDefault,
      savedIds,
      toggleSaved,
      preferences,
      updatePreferences,
    ],
  );
  return (
    <AccountContext.Provider value={value}>{children}</AccountContext.Provider>
  );
}

export function useAccount() {
  const ctx = useContext(AccountContext);
  if (!ctx) throw new Error("useAccount must be used inside <AccountProvider>");
  return ctx;
}
