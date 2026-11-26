import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import api from "../Services/api.js";

export const FREE_DELIVERY_THRESHOLD = 2000;
export const DELIVERY_FEE = 60;

export const egp = (n) =>
  `EGP ${Math.round(Number(n) || 0).toLocaleString("en-US")}`;

export const PROMOS = {
  GLAMORA10: { type: "percent", value: 10, label: "10% off" },
  WELCOME100: { type: "fixed", value: 100, label: "EGP 100 off" },
};

const STORAGE_KEY = "glamora-cart-promo-v1";
const GOVERNORATE_KEY = "glamora-checkout-governorate-v1";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState(null);
  const [cartLoading, setCartLoading] = useState(true);
  const [cartError, setCartError] = useState(null);

  const [governorates, setGovernorates] = useState([]);
  const [governoratesLoading, setGovernoratesLoading] = useState(true);
  const [governoratesError, setGovernoratesError] = useState(null);

  const [selectedGovernorateId, setSelectedGovernorateId] = useState(() => {
    try {
      return localStorage.getItem(GOVERNORATE_KEY) || "";
    } catch {
      return "";
    }
  });

  const [promo, setPromo] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return PROMOS[saved] ? saved : null;
    } catch {
      return null;
    }
  });

  // GET /cart
  const fetchCart = useCallback(async () => {
    try {
      setCartError(null);

      const { data } = await api.get("/cart");

      if (!data || !Array.isArray(data.items)) {
        throw new Error("Invalid cart response");
      }

      setCart(data);
      return data;
    } catch (error) {
      setCartError(error);
      throw error;
    }
  }, []);

  // GET /governorates
  const fetchGovernorates = useCallback(async () => {
    try {
      setGovernoratesError(null);

      const { data } = await api.get("/governorates");

      const list = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data?.governorates)
            ? data.governorates
            : [];

      setGovernorates(list);
      return list;
    } catch (error) {
      setGovernoratesError(error);
      console.error("Failed to load governorates:", error);
      throw error;
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadCart = async () => {
      try {
        setCartLoading(true);

        const { data } = await api.get("/cart");

        if (!data || !Array.isArray(data.items)) {
          throw new Error("Invalid cart response");
        }

        if (!cancelled) {
          setCart(data);
          setCartError(null);
        }
      } catch (error) {
        if (!cancelled) {
          setCartError(error);
          console.error("Failed to load cart:", error);
        }
      } finally {
        if (!cancelled) {
          setCartLoading(false);
        }
      }
    };

    loadCart();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadGovernorates = async () => {
      try {
        setGovernoratesLoading(true);
        setGovernoratesError(null);

        const { data } = await api.get("/governorates");

        const list = Array.isArray(data)
          ? data
          : Array.isArray(data?.data)
            ? data.data
            : Array.isArray(data?.governorates)
              ? data.governorates
              : [];

        if (!cancelled) {
          setGovernorates(list);
        }
      } catch (error) {
        if (!cancelled) {
          setGovernoratesError(error);
          console.error("Failed to load governorates:", error);
        }
      } finally {
        if (!cancelled) {
          setGovernoratesLoading(false);
        }
      }
    };

    loadGovernorates();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    try {
      if (promo) {
        localStorage.setItem(STORAGE_KEY, promo);
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // Promo remains available in memory.
    }
  }, [promo]);

  useEffect(() => {
    try {
      if (selectedGovernorateId) {
        localStorage.setItem(GOVERNORATE_KEY, selectedGovernorateId);
      } else {
        localStorage.removeItem(GOVERNORATE_KEY);
      }
    } catch {
      // Selection remains available in memory.
    }
  }, [selectedGovernorateId]);

  // POST /cart/items
  const addToCart = useCallback(
    async (productId, { qty = 1 } = {}) => {
      try {
        setCartError(null);

        await api.post("/cart/items", {
          product_id: Number(productId),
          quantity: qty,
        });

        await fetchCart();
        return true;
      } catch (error) {
        console.error("Failed to add product to cart:", error);
        setCartError(error);
        return false;
      }
    },
    [fetchCart],
  );

  // DELETE /cart/items/{productId}
  const removeFromCart = useCallback(
    async (key) => {
      const item = cart?.items?.find(
        (item) =>
          String(item.product_id) === String(key) ||
          String(item.id) === String(key),
      );

      if (!item) return false;

      try {
        setCartError(null);

        await api.delete(`/cart/items/${item.product_id}`);

        await fetchCart();
        return true;
      } catch (error) {
        console.error("Failed to remove cart item:", error);
        setCartError(error);
        return false;
      }
    },
    [cart, fetchCart],
  );

  // PATCH /cart/items/{productId}
  const updateQuantity = useCallback(
    async (key, qty) => {
      const item = cart?.items?.find(
        (item) =>
          String(item.product_id) === String(key) ||
          String(item.id) === String(key),
      );

      if (!item) return false;

      const quantity = Math.max(1, Math.floor(Number(qty)) || 1);

      try {
        setCartError(null);

        await api.patch(`/cart/items/${item.product_id}`, {
          quantity,
        });

        await fetchCart();
        return true;
      } catch (error) {
        console.error("Failed to update cart quantity:", error);
        setCartError(error);
        return false;
      }
    },
    [cart, fetchCart],
  );

  // Clear cart by deleting its items individually.
  const clearCart = useCallback(async () => {
    if (!cart?.items?.length) return true;

    try {
      setCartError(null);

      await Promise.all(
        cart.items.map((item) => api.delete(`/cart/items/${item.product_id}`)),
      );

      await fetchCart();
      setPromo(null);

      return true;
    } catch (error) {
      console.error("Failed to clear cart:", error);
      setCartError(error);
      return false;
    }
  }, [cart, fetchCart]);

  const applyPromo = useCallback((raw) => {
    const code = raw.trim().toUpperCase();

    if (!code) {
      return { ok: false, message: "Enter a promo code first." };
    }

    if (!PROMOS[code]) {
      return { ok: false, message: "That promo code isn't valid." };
    }

    setPromo(code);

    return {
      ok: true,
      message: `Code ${code} applied: ${PROMOS[code].label}.`,
    };
  }, []);

  const removePromo = useCallback(() => {
    setPromo(null);
  }, []);

  const value = useMemo(() => {
    const cartItems = (cart?.items || []).map((item) => {
      const mainImage = item.images?.find(
        (image) => image.is_active && image.purpose === "main",
      );

      const unitPrice = Number(item.unit_price) || 0;
      const lineTotal = Number(item.line_total) || 0;

      return {
        ...item,
        key: String(item.product_id),
        qty: item.quantity,
        unitPrice,
        lineTotal,
        product: {
          id: item.product_id,
          name: item.product_name,
          brand: {
            name: item.brand_name,
          },
          family: item.family,
          images: item.images || [],
          mainImage,
        },
      };
    });

    const cartCount = cartItems.reduce(
      (total, item) => total + item.quantity,
      0,
    );

    const subtotal = Number(cart?.subtotal) || 0;

    const rule = promo ? PROMOS[promo] : null;

    const discount = rule
      ? Math.min(
          subtotal,
          rule.type === "percent"
            ? Math.round((subtotal * rule.value) / 100)
            : rule.value,
        )
      : 0;

    const selectedGovernorate =
      governorates.find(
        (governorate) =>
          String(governorate.id) === String(selectedGovernorateId),
      ) || null;

    const deliveryFee =
      cartItems.length === 0 || !selectedGovernorate
        ? 0
        : selectedGovernorate.is_free_shipping
          ? 0
          : Number(selectedGovernorate.shipping_cost) || 0;

    return {
      cart,
      products: [],
      productsLoading: cartLoading,
      productsError: cartError,
      cartLoading,
      cartError,
      cartItems,
      cartCount,
      subtotal,
      discount,
      deliveryFee,
      total: subtotal - discount + deliveryFee,

      governorates,
      governoratesLoading,
      governoratesError,
      selectedGovernorate,
      selectedGovernorateId,
      setSelectedGovernorateId,
      refreshGovernorates: fetchGovernorates,

      promo: rule ? { code: promo, label: rule.label } : null,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      applyPromo,
      removePromo,
      refreshCart: fetchCart,
    };
  }, [
    cart,
    cartLoading,
    cartError,
    promo,
    governorates,
    governoratesLoading,
    governoratesError,
    selectedGovernorateId,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    applyPromo,
    removePromo,
    fetchCart,
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
