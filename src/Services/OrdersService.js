import api from "./api.js";

const ORDERS_ENDPOINT = "/orders";

/**
 * Get all orders for the authenticated user.
 * GET /orders
 */
export const getOrders = async () => {
  const response = await api.get(ORDERS_ENDPOINT);
  const data = response.data;

  return Array.isArray(data)
    ? data
    : Array.isArray(data?.data)
      ? data.data
      : Array.isArray(data?.orders)
        ? data.orders
        : [];
};

/**
 * Get a single order by ID.
 * GET /orders/{id}
 */
export const getOrderById = async (orderId) => {
  if (!orderId) {
    throw new Error("Order ID is required.");
  }

  const response = await api.get(`${ORDERS_ENDPOINT}/${orderId}`);

  return response.data?.data ?? response.data;
};

/**
 * Create a new order.
 * POST /orders
 */
export const createOrder = async (checkoutData, cartItems) => {
  if (!checkoutData) {
    throw new Error("Checkout information is required.");
  }

  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    throw new Error("Your cart is empty.");
  }

  const requiredFields = [
    "firstName",
    "lastName",
    "phone",
    "email",
    "street",
    "area",
    "city",
  ];

  const missingFields = requiredFields.filter(
    (field) => !String(checkoutData[field] || "").trim(),
  );

  if (missingFields.length > 0) {
    throw new Error("Please complete all required delivery information.");
  }

  const items = cartItems.map((item) => {
    const productId = item?.product?.id;
    const quantity = Number(item?.qty);

    if (!productId || !Number.isInteger(quantity) || quantity < 1) {
      throw new Error("Invalid product or quantity in your cart.");
    }

    return {
      product_id: productId,
      quantity,
    };
  });

  const payload = {
    first_name: checkoutData.firstName.trim(),
    last_name: checkoutData.lastName.trim(),
    phone: checkoutData.phone.trim(),
    email: checkoutData.email.trim(),
    street: checkoutData.street.trim(),
    area: checkoutData.area.trim(),
    building: checkoutData.apartment?.trim() || "",
    floor: "",
    governorate: checkoutData.city.trim(),
    note: checkoutData.note?.trim() || "",
    items,
    payment_method: "cod",
  };

  const response = await api.post(ORDERS_ENDPOINT, payload);

  return response.data?.data ?? response.data;
};


const OrdersService = {
  getOrders,
  getOrderById,
  createOrder,
};

export default OrdersService;
