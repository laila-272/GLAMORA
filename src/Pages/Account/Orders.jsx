import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AccountLayout from "./AccountLayout";
import { egp } from "../../Context/CartContext";
import { getOrders } from "../../Services/OrdersService.js";

const TABS = [
  { key: "All", label: "All orders" },
  { key: "pending", label: "Pending" },
  { key: "delivered", label: "Delivered" },
  { key: "cancelled", label: "Cancelled" },
];

const formatDate = (date) => {
  if (!date) return "—";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "—";

  return parsedDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatStatus = (status) => {
  if (!status) return "Unknown";

  return status.charAt(0).toUpperCase() + status.slice(1).replaceAll("_", " ");
};

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case "delivered":
      return "text-[#5b6a46]";
    case "cancelled":
    case "failed":
      return "text-[#f32970]";
    default:
      return "text-[#4a424a]";
  }
};

function ItemsCell({ order }) {
  const items = order.items || [];

  return (
    <div className="text-[10px] leading-[1.7] text-[#4a424a]">
      <p>
        {items.length} {items.length === 1 ? "scent" : "scents"}
      </p>

      {items.map((item) => (
        <p key={item.id}>
          {item.product_name}
          {item.product?.size ? ` · ${item.product.size}` : ""}
          {` · Qty ${item.quantity}`}
        </p>
      ))}
    </div>
  );
}

function OrderCard({ order }) {
  return (
    <article className="border-b border-[#f1dfe5] py-5 last:border-0">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[11px] font-normal text-[#292329]">
          {order.order_number}
        </p>

        <p className={`text-[9px] ${getStatusColor(order.status)}`}>
          {formatStatus(order.status)}
        </p>
      </div>

      <p className="mt-2 text-[10px] text-[#6d656c]">
        {formatDate(order.created_at)}
      </p>

      <div className="mt-4">
        <ItemsCell order={order} />
      </div>

      <div className="mt-4 flex items-end justify-between gap-3">
        <div className="text-[11px] font-semibold leading-[1.7]">
          <p>{egp(order.total)}</p>
          <p>Merchandise {egp(order.subtotal)}</p>
          <p>Delivery {egp(order.shipping_cost)}</p>
        </div>

        <Link
          to={`/account/orders/${order.id}`}
          className="inline-flex h-8 shrink-0 items-center whitespace-nowrap rounded-full border border-[#eae7e9] bg-white px-4 text-[9px] font-medium"
        >
          View order details
        </Link>
      </div>
    </article>
  );
}

export default function MyOrders() {
  const [tab, setTab] = useState("All");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getOrders();
      setOrders(data);
    } catch (err) {
      console.error(
        "Failed to fetch orders:",
        err.response?.data || err.message,
      );

      setError(
        err.response?.status === 401
          ? "Please log in to view your orders."
          : "Unable to load your orders. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const counts = useMemo(() => {
    return TABS.reduce((result, currentTab) => {
      result[currentTab.key] =
        currentTab.key === "All"
          ? orders.length
          : orders.filter(
              (order) => order.status?.toLowerCase() === currentTab.key,
            ).length;

      return result;
    }, {});
  }, [orders]);

  const shown = useMemo(
    () =>
      tab === "All"
        ? orders
        : orders.filter((order) => order.status?.toLowerCase() === tab),
    [orders, tab],
  );

  return (
    <AccountLayout
      current="orders"
      title="My orders"
      subtitle="The scents you chose, and the journeys they take."
    >
      <div
        role="tablist"
        aria-label="Order status"
        className="flex flex-wrap gap-x-6 gap-y-3 px-1 text-[12px] sm:px-4"
      >
        {TABS.map((t) => (
          <button
            key={t.key}
            role="tab"
            type="button"
            aria-selected={tab === t.key}
            onClick={() => setTab(t.key)}
            className={`whitespace-nowrap border-b-2 pb-1 ${
              tab === t.key
                ? "border-[#292329] font-semibold"
                : "border-transparent"
            }`}
          >
            {t.label} ({counts[t.key]})
          </button>
        ))}
      </div>

      {loading ? (
        <div className="mt-5 rounded-3xl bg-[#fff5f8] py-16 text-center text-[11px] text-[#6d656c]">
          Loading your orders...
        </div>
      ) : error ? (
        <div className="mt-5 rounded-3xl bg-[#fff5f8] px-4 py-12 text-center">
          <p className="text-[12px] text-[#6d656c]">{error}</p>

          <button
            type="button"
            onClick={fetchOrders}
            className="mt-4 rounded-full border border-[#eae7e9] bg-white px-5 py-2 text-[10px]"
          >
            Try again
          </button>
        </div>
      ) : (
        <>
          <div className="mt-5 rounded-3xl bg-[#fff5f8] px-4 md:hidden">
            {shown.length > 0 ? (
              shown.map((order) => <OrderCard key={order.id} order={order} />)
            ) : (
              <p className="py-8 text-center text-[10px] text-[#6d656c]">
                No orders found.
              </p>
            )}
          </div>

          <div className="mt-5 hidden overflow-x-auto rounded-3xl bg-[#fff5f8] p-6 md:block">
            <table className="w-full min-w-[760px] text-left">
              <thead>
                <tr className="border-b border-[#f1dfe5] text-[10px] font-medium text-[#6d656c]">
                  {[
                    "Order #",
                    "Date",
                    "Status",
                    "Items",
                    "Total",
                    "Actions",
                  ].map((heading) => (
                    <th
                      key={heading}
                      scope="col"
                      className="pb-4 pr-4 font-medium"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {shown.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-[#f1dfe5] align-middle last:border-0"
                  >
                    <th
                      className="py-6 pr-4 text-[11px] font-normal"
                      scope="row"
                    >
                      {order.order_number}
                    </th>

                    <td className="py-6 pr-4 text-[10px] text-[#6d656c]">
                      {formatDate(order.created_at)}
                    </td>

                    <td
                      className={`py-6 pr-4 text-[9px] ${getStatusColor(
                        order.status,
                      )}`}
                    >
                      {formatStatus(order.status)}
                    </td>

                    <td className="py-6 pr-4">
                      <ItemsCell order={order} />
                    </td>

                    <td className="py-6 pr-4 text-[11px] font-semibold leading-[1.7]">
                      <p>{egp(order.total)}</p>
                      <p>Merchandise {egp(order.subtotal)}</p>
                      <p>Delivery {egp(order.shipping_cost)}</p>
                    </td>

                    <td className="py-6">
                      <Link
                        to={`/account/orders/${order.id}`}
                        className="inline-flex h-8 items-center whitespace-nowrap rounded-full border border-[#eae7e9] bg-white px-4 text-[9px] font-medium"
                      >
                        View order details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {shown.length === 0 && (
              <p className="py-8 text-center text-[10px] text-[#6d656c]">
                No orders found.
              </p>
            )}
          </div>
        </>
      )}

      <Link
        to="/delivery-returns"
        className="mt-5 inline-block text-[11px] text-[#f72568] underline underline-offset-2"
      >
        Need help with an order?
      </Link>
    </AccountLayout>
  );
}
