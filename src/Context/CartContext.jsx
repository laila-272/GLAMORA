import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { allProducts } from "../data/Brands.js";

export const FREE_DELIVERY_THRESHOLD = 2000;
export const DELIVERY_FEE = 60;
export const egp = (n) => `EGP ${Math.round(n).toLocaleString("en-US")}`;

// Local demo codes only (no backend). Replace with a real API later.
export const PROMOS = {
  GLAMORA10: { type: "percent", value: 10, label: "10% off" },
  WELCOME100: { type: "fixed", value: 100, label: "EGP 100 off" },
};

const STORAGE_KEY = "glamora-cart-v1";
const empty = { lines: [], promo: null };

// Only ids, volume, quantity and chosen family are stored; names, prices and
// images always come from the shared product data, so nothing is duplicated.
function load() {
  try {
    const d = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (!d) return empty;
    const lines = (Array.isArray(d.lines) ? d.lines : []).filter(
      (l) =>
        allProducts.some((p) => p.id === l.id) &&
        Number.isInteger(l.qty) &&
        l.qty >= 1,
    );
    return { lines, promo: PROMOS[d.promo] ? d.promo : null };
  } catch {
    return empty;
  }
}

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [state, setState] = useState(load);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage unavailable (private mode / quota) – cart still works in memory */
    }
  }, [state]);

  // Keep several open tabs in sync.
  useEffect(() => {
    const onStorage = (e) => e.key === STORAGE_KEY && setState(load());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const addToCart = useCallback(
    (productId, { volume, qty = 1, family } = {}) => {
      const product = allProducts.find((p) => p.id === productId);
      if (!product) return;
      const vol = volume ?? product.size;
      setState((s) => {
        const i = s.lines.findIndex(
          (l) => l.id === productId && l.volume === vol,
        );
        const lines = [...s.lines];
        if (i >= 0)
          lines[i] = {
            ...lines[i],
            qty: lines[i].qty + qty,
            family: family ?? lines[i].family,
          };
        else
          lines.push({
            id: productId,
            volume: vol,
            qty,
            family: family ?? product.family,
          });
        return { ...s, lines };
      });
    },
    [],
  );

  const removeFromCart = useCallback((key) => {
    setState((s) => ({
      ...s,
      lines: s.lines.filter((l) => `${l.id}-${l.volume}` !== key),
    }));
  }, []);

  const updateQuantity = useCallback((key, qty) => {
    const next = Math.max(1, Math.floor(qty) || 1);
    setState((s) => ({
      ...s,
      lines: s.lines.map((l) =>
        `${l.id}-${l.volume}` === key ? { ...l, qty: next } : l,
      ),
    }));
  }, []);

  const clearCart = useCallback(() => setState(empty), []);

  const applyPromo = useCallback((raw) => {
    const code = raw.trim().toUpperCase();
    if (!code) return { ok: false, message: "Enter a promo code first." };
    if (!PROMOS[code])
      return { ok: false, message: "That promo code isn't valid." };
    setState((s) => ({ ...s, promo: code }));
    return {
      ok: true,
      message: `Code ${code} applied: ${PROMOS[code].label}.`,
    };
  }, []);

  const removePromo = useCallback(
    () => setState((s) => ({ ...s, promo: null })),
    [],
  );

  const value = useMemo(() => {
    const cartItems = state.lines
      .map((l) => {
        const product = allProducts.find((p) => p.id === l.id);
        return (
          product && {
            ...l,
            key: `${l.id}-${l.volume}`,
            product,
            unitPrice: product.price,
            lineTotal: product.price * l.qty,
          }
        );
      })
      .filter(Boolean);
    const cartCount = cartItems.reduce((n, i) => n + i.qty, 0);
    const subtotal = cartItems.reduce((n, i) => n + i.lineTotal, 0);
    const rule = state.promo && PROMOS[state.promo];
    const discount = rule
      ? Math.min(
          subtotal,
          rule.type === "percent"
            ? Math.round((subtotal * rule.value) / 100)
            : rule.value,
        )
      : 0;
    const deliveryFee =
      cartItems.length === 0 || subtotal >= FREE_DELIVERY_THRESHOLD
        ? 0
        : DELIVERY_FEE;
    return {
      cartItems,
      cartCount,
      subtotal,
      discount,
      deliveryFee,
      total: subtotal - discount + deliveryFee,
      promo: rule ? { code: state.promo, label: rule.label } : null,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      applyPromo,
      removePromo,
    };
  }, [
    state,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    applyPromo,
    removePromo,
  ]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
