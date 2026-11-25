import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getProducts } from "../Services/productService.js";

export const FREE_DELIVERY_THRESHOLD = 2000;
export const DELIVERY_FEE = 60;
export const egp = (n) => `EGP ${Math.round(n).toLocaleString("en-US")}`;

export const PROMOS = {
  GLAMORA10: { type: "percent", value: 10, label: "10% off" },
  WELCOME100: { type: "fixed", value: 100, label: "EGP 100 off" },
};

const STORAGE_KEY = "glamora-cart-v1";
const empty = { lines: [], promo: null };

function load() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");

    if (!data) return empty;

    const lines = (Array.isArray(data.lines) ? data.lines : []).filter(
      (line) =>
        line.id != null &&
        line.volume != null &&
        Number.isInteger(line.qty) &&
        line.qty >= 1,
    );

    return {
      lines,
      promo: PROMOS[data.promo] ? data.promo : null,
    };
  } catch {
    return empty;
  }
}

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [state, setState] = useState(load);
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const fetchProducts = async () => {
      try {
        setProductsLoading(true);
        setProductsError(null);

        const data = await getProducts();

        if (!Array.isArray(data)) {
          throw new Error("Invalid products response");
        }

        if (!cancelled) {
          setProducts(data);
        }
      } catch (error) {
        console.error("Failed to load cart products:", error);

        if (!cancelled) {
          setProductsError(error);
        }
      } finally {
        if (!cancelled) {
          setProductsLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Cart remains available in memory.
    }
  }, [state]);

  useEffect(() => {
    const onStorage = (event) => {
      if (event.key === STORAGE_KEY) {
        setState(load());
      }
    };

    window.addEventListener("storage", onStorage);

    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const addToCart = useCallback(
    (productId, { volume, qty = 1 } = {}, productData) => {
      const product =
        productData ||
        products.find((item) => String(item.id) === String(productId));

      if (!product) {
        console.error("Product is not available in the cart.");
        return false;
      }

      const selectedVolume = volume ?? product.size;

      setState((current) => {
        const index = current.lines.findIndex(
          (line) =>
            String(line.id) === String(product.id) &&
            line.volume === selectedVolume,
        );

        const lines = [...current.lines];

        if (index >= 0) {
          lines[index] = {
            ...lines[index],
            qty: lines[index].qty + qty,
          };
        } else {
          lines.push({
            id: product.id,
            volume: selectedVolume,
            qty,
          });
        }

        return { ...current, lines };
      });

      return true;
    },
    [products],
  );

  const removeFromCart = useCallback((key) => {
    setState((current) => ({
      ...current,
      lines: current.lines.filter(
        (line) => `${line.id}-${line.volume}` !== key,
      ),
    }));
  }, []);

  const updateQuantity = useCallback((key, qty) => {
    const next = Math.max(1, Math.floor(qty) || 1);

    setState((current) => ({
      ...current,
      lines: current.lines.map((line) =>
        `${line.id}-${line.volume}` === key ? { ...line, qty: next } : line,
      ),
    }));
  }, []);

  const clearCart = useCallback(() => setState(empty), []);

  const applyPromo = useCallback((raw) => {
    const code = raw.trim().toUpperCase();

    if (!code) {
      return { ok: false, message: "Enter a promo code first." };
    }

    if (!PROMOS[code]) {
      return { ok: false, message: "That promo code isn't valid." };
    }

    setState((current) => ({ ...current, promo: code }));

    return {
      ok: true,
      message: `Code ${code} applied: ${PROMOS[code].label}.`,
    };
  }, []);

  const removePromo = useCallback(() => {
    setState((current) => ({ ...current, promo: null }));
  }, []);

  const value = useMemo(() => {
    const cartItems = state.lines
      .map((line) => {
        const product = products.find(
          (item) => String(item.id) === String(line.id),
        );

        if (!product) return null;

        const unitPrice = Number(product.sale_price ?? product.original_price);

        return {
          ...line,
          key: `${line.id}-${line.volume}`,
          product,
          unitPrice,
          lineTotal: unitPrice * line.qty,
        };
      })
      .filter(Boolean);

    const cartCount = cartItems.reduce((total, item) => total + item.qty, 0);

    const subtotal = cartItems.reduce(
      (total, item) => total + item.lineTotal,
      0,
    );

    const rule = state.promo ? PROMOS[state.promo] : null;

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
      products,
      productsLoading,
      productsError,
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
    products,
    productsLoading,
    productsError,
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
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside <CartProvider>");
  }

  return context;
}
