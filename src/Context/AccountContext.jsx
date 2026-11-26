import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  getFavorites,
  addFavorite,
  removeFavorite,
} from "../Services/FavoritesService.js";

import { useAuth } from "./AuthContext";

export const DEFAULT_PROFILE = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
};

const STORAGE_KEY = "glamora-account-v1";
const ADDRESS_KEY = "glamora-addresses-v1";
const PREFS_KEY = "glamora-preferences-v1";

export const DEFAULT_PREFS = {
  arrivals: true,
  stories: true,
  offers: false,
};

export const DEFAULT_ADDRESSES = [];

function load() {
  try {
    return {
      ...DEFAULT_PROFILE,
      ...JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"),
    };
  } catch {
    return { ...DEFAULT_PROFILE };
  }
}

function loadPrefs() {
  try {
    return {
      ...DEFAULT_PREFS,
      ...JSON.parse(localStorage.getItem(PREFS_KEY) || "{}"),
    };
  } catch {
    return { ...DEFAULT_PREFS };
  }
}

function loadAddresses() {
  try {
    const data = JSON.parse(localStorage.getItem(ADDRESS_KEY) || "null");

    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

// Ensure exactly one default address whenever the list is not empty.
const normalize = (list) =>
  list.length && !list.some((address) => address.isDefault)
    ? list.map((address, index) => ({
        ...address,
        isDefault: index === 0,
      }))
    : list;

const AccountContext = createContext(null);

export function AccountProvider({ children }) {
  const { isAuthenticated, user } = useAuth();

  const [profile, setProfile] = useState(load);
  const [addresses, setAddresses] = useState(loadAddresses);
  const [preferences, setPreferences] = useState(loadPrefs);

  // Favorites API state.
  const [savedIds, setSavedIds] = useState([]);
  const [favoritesLoading, setFavoritesLoading] = useState(
    Boolean(isAuthenticated),
  );
  const [favoritesError, setFavoritesError] = useState("");

  // Prevent duplicate requests for the same product.
  const pendingFavorites = useRef(new Set());

  // Fetch favorites from backend.
  const fetchSaved = useCallback(async () => {
    try {
      setFavoritesLoading(true);
      setFavoritesError("");

     

      const favorites = await getFavorites();

     

      const ids = favorites.map((product) => Number(product.id));

      setSavedIds(ids);
    } catch (error) {
      

      setFavoritesError(
        error.response?.data?.message ||
          "Failed to load your saved fragrances.",
      );
    } finally {
      setFavoritesLoading(false);
    }
  }, []);

  // Load account data and favorites after authentication.
  useEffect(() => {
    if (!isAuthenticated) {
      setSavedIds([]);
      setFavoritesError("");
      setFavoritesLoading(false);

      setProfile({ ...DEFAULT_PROFILE });
      setAddresses([]);
      setPreferences({ ...DEFAULT_PREFS });

      return;
    }

    const fullName = user?.name || "";
    const nameParts = fullName.trim().split(/\s+/).filter(Boolean);

    setProfile((current) => ({
      ...current,
      email: user?.email || "",
      firstName: user?.firstName ?? nameParts[0] ?? "",
      lastName: user?.lastName ?? nameParts.slice(1).join(" "),
      phone: user?.phone ?? "",
    }));

    fetchSaved();
  }, [isAuthenticated, user, fetchSaved]);

  // Save profile.
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  }, [profile]);

  // Save addresses.
  useEffect(() => {
    localStorage.setItem(ADDRESS_KEY, JSON.stringify(addresses));
  }, [addresses]);

  // Save preferences.
  useEffect(() => {
    localStorage.setItem(PREFS_KEY, JSON.stringify(preferences));
  }, [preferences]);

  // Add / Remove favorite through API.
  const toggleSaved = useCallback(
    async (id) => {
      const productId = Number(id);

      if (!Number.isInteger(productId) || productId <= 0) {
        return;
      }

      if (!isAuthenticated) {
        throw new Error("Please login to manage your favorites.");
      }

      if (pendingFavorites.current.has(productId)) {
        return;
      }

      pendingFavorites.current.add(productId);

      const isCurrentlySaved = savedIds.includes(productId);

      try {
        if (isCurrentlySaved) {
          await removeFavorite(productId);

          setSavedIds((current) =>
            current.filter((savedId) => savedId !== productId),
          );
        } else {
          await addFavorite(productId);

          setSavedIds((current) =>
            current.includes(productId) ? current : [...current, productId],
          );
        }

        setFavoritesError("");
      } catch (error) {
        console.error("🔴 Failed to update favorite:", error);

        setFavoritesError(
          error.response?.data?.message || "Failed to update your favorites.",
        );

        throw error;
      } finally {
        pendingFavorites.current.delete(productId);
      }
    },
    [savedIds, isAuthenticated],
  );

  const isSaved = useCallback(
    (id) => savedIds.includes(Number(id)),
    [savedIds],
  );

  // Preferences.
  const updatePreferences = useCallback((patch) => {
    setPreferences((current) => ({
      ...current,
      ...patch,
    }));
  }, []);

  // Save address.
  const saveAddress = useCallback((address) => {
    setAddresses((list) => {
      const id = address.id || `addr-${Date.now()}`;
      const makeDefault = address.isDefault || list.length === 0;

      const base = address.id
        ? list.map((item) => (item.id === id ? { ...item, ...address } : item))
        : [...list, { ...address, id }];

      return normalize(
        base.map((item) =>
          makeDefault ? { ...item, isDefault: item.id === id } : item,
        ),
      );
    });
  }, []);

  // Remove address.
  const removeAddress = useCallback((id) => {
    setAddresses((list) =>
      normalize(list.filter((address) => address.id !== id)),
    );
  }, []);

  // Make address default.
  const makeDefault = useCallback((id) => {
    setAddresses((list) =>
      list.map((address) => ({
        ...address,
        isDefault: address.id === id,
      })),
    );
  }, []);

  // Update profile.
  const updateProfile = useCallback((patch) => {
    setProfile((current) => ({
      ...current,
      ...patch,
    }));
  }, []);

  // Reset local account data.
  const resetProfile = useCallback(() => {
    setProfile({ ...DEFAULT_PROFILE });
    setAddresses([]);
    setPreferences({ ...DEFAULT_PREFS });
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

      // Favorites.
      savedIds,
      toggleSaved,
      isSaved,
      favoritesLoading,
      favoritesError,
      refreshFavorites: fetchSaved,

      // Preferences.
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
      isSaved,
      favoritesLoading,
      favoritesError,
      fetchSaved,
      preferences,
      updatePreferences,
    ],
  );

  return (
    <AccountContext.Provider value={value}>{children}</AccountContext.Provider>
  );
}

export function useAccount() {
  const context = useContext(AccountContext);

  if (!context) {
    throw new Error("useAccount must be used inside <AccountProvider>");
  }

  return context;
}
