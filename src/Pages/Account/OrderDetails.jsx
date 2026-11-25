import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CheckCircle2, Package, Wallet } from "lucide-react";

import AccountLayout from "./AccountLayout";
import Modal from "./Modal";
import { useAccount } from "../../Context/AccountContext.jsx";
import { egp } from "../../Context/CartContext.jsx";
import { getOrderById } from "../../Services/OrdersService.js";

const inputCls =
  "w-full rounded-xl border border-[#eae7e9] bg-white px-4 text-[12px] outline-none placeholder:text-[#b9b3b8] focus:border-[#f72568]";

const REASONS = [
  "Not what I expected",
  "Changed my mind",
  "Arrived damaged",
  "Wrong item received",
  "Other",
];

const formatDate = (date) => {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatStatus = (status) => {
  if (!status) return "Unknown";

  return status
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

function ReturnModal({ order, onClose, onDone }) {
  const [picked, setPicked] = useState([]);
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [error, setError] = useState("");

  const toggle = (id) => {
    setPicked((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id],
    );
  };

  const submit = (e) => {
    e.preventDefault();

    if (!picked.length) {
      setError("Choose at least one scent to return.");
      return;
    }

    if (!reason) {
      setError("Please select a reason.");
      return;
    }

    onDone(
      order.items
        .filter((item) => picked.includes(item.id))
        .map((item) => item.product_name),
    );
  };

  return (
    <Modal title="Request a return" onClose={onClose}>
      <form onSubmit={submit}>
        <p className="mt-3 text-[11px] text-[#6d656c]">
          Easy 14-day returns for {order.order_number}.
        </p>

        <fieldset className="mt-5">
          <legend className="mb-2 text-[10px] font-medium">
            Which scents would you like to return?
          </legend>

          {order.items.map((item) => (
            <label
              key={item.id}
              className="mb-2 flex items-center gap-2 text-[12px]"
            >
              <input
                type="checkbox"
                checked={picked.includes(item.id)}
                onChange={() => toggle(item.id)}
                className="accent-[#f72568]"
              />
              {item.product_name} · {item.product?.size || "—"} · Qty{" "}
              {item.quantity}
            </label>
          ))}
        </fieldset>

        <label
          htmlFor="reason"
          className="mb-2 mt-4 block text-[10px] font-medium"
        >
          Reason
        </label>

        <select
          id="reason"
          required
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className={`${inputCls} h-10`}
        >
          <option value="" disabled>
            Select a reason
          </option>

          {REASONS.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <label
          htmlFor="details"
          className="mb-2 mt-4 block text-[10px] font-medium"
        >
          Tell us why (optional)
        </label>

        <textarea
          id="details"
          rows={3}
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          className={`${inputCls} py-3`}
        />

        <p
          role="alert"
          className="mt-2 min-h-[14px] text-[10px] text-[#f72568]"
        >
          {error}
        </p>

        <div className="mt-3 flex items-center gap-5">
          <button
            type="submit"
            className="h-10 rounded-full bg-[#f72568] px-6 text-[12px] font-medium text-white"
          >
            Submit request
          </button>

          <button
            type="button"
            onClick={onClose}
            className="text-[12px] text-[#f72568]"
          >
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
}

function ContactModal({ order, onClose, onDone }) {
  const { profile } = useAccount();

  const [email, setEmail] = useState(profile?.email || order.email || "");
  const [message, setMessage] = useState("");

  const submit = (e) => {
    e.preventDefault();
    onDone();
  };

  return (
    <Modal title="Contact about this order" onClose={onClose}>
      <form onSubmit={submit}>
        <p className="mt-3 text-[11px] text-[#6d656c]">
          Order {order.order_number} · {formatDate(order.created_at)}
        </p>

        <label
          htmlFor="c-email"
          className="mb-2 mt-5 block text-[10px] font-medium"
        >
          Your email
        </label>

        <input
          id="c-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`${inputCls} h-10`}
        />

        <label
          htmlFor="c-msg"
          className="mb-2 mt-4 block text-[10px] font-medium"
        >
          How can we help?
        </label>

        <textarea
          id="c-msg"
          rows={4}
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={`${inputCls} py-3`}
        />

        <div className="mt-5 flex items-center gap-5">
          <button
            type="submit"
            className="h-10 rounded-full bg-[#f72568] px-6 text-[12px] font-medium text-white"
          >
            Send message
          </button>

          <button
            type="button"
            onClick={onClose}
            className="text-[12px] text-[#f72568]"
          >
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
}

function StatusBadge({ status }) {
  const normalized = String(status || "").toLowerCase();

  const isDelivered = normalized === "delivered";
  const isCancelled = normalized === "cancelled";

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-[10px] font-medium ${
        isDelivered
          ? "bg-green-50 text-green-700"
          : isCancelled
            ? "bg-red-50 text-red-600"
            : "bg-amber-50 text-amber-700"
      }`}
    >
      {formatStatus(status)}
    </span>
  );
}

export default function OrderDetails() {
  const { orderId } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modal, setModal] = useState(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadOrder = async () => {
      try {
        setLoading(true);
        setError("");
        setOrder(null);

        const data = await getOrderById(orderId);

        if (!cancelled) {
          setOrder(data);
        }
      } catch (err) {
        console.error("Failed to load order:", err);

        if (!cancelled) {
          setError(
            err.response?.data?.message ||
              "Unable to load this order. Please try again.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    if (orderId) {
      loadOrder();
    }

    return () => {
      cancelled = true;
    };
  }, [orderId]);

  if (loading) {
    return (
      <AccountLayout
        current="orders"
        title="Loading your order"
        subtitle="Please wait while we retrieve your order details."
      >
        <div className="py-16 text-center text-[12px] text-[#777078]">
          Loading order details...
        </div>
      </AccountLayout>
    );
  }

  if (error || !order) {
    return (
      <AccountLayout
        current="orders"
        title="Order not found"
        subtitle={error || "We couldn't find that order."}
      >
        <Link
          to="/account/orders"
          className="text-[11px] text-[#f72568] underline underline-offset-2"
        >
          ← Back to my orders
        </Link>
      </AccountLayout>
    );
  }

  const items = order.items || [];
  const payment = order.latest_payment || order.payments?.[0];

  const delivered = String(order.status).toLowerCase() === "delivered";

  const address = [
    order.street,
    order.building,
    order.floor ? `Floor ${order.floor}` : null,
    order.area,
    order.governorate,
  ].filter(Boolean);

  const customerName =
    order.customer_name ||
    [order.first_name, order.last_name].filter(Boolean).join(" ");

  return (
    <AccountLayout
      current="orders"
      title="Your order, thoughtfully."
      subtitle={`${order.order_number || `#${order.id}`} · Order · ${formatDate(order.created_at)}`}
    >
      <div className="grid gap-8 xl:grid-cols-[1fr_280px]">
        <div>
          <Link
            to="/account/orders"
            className="text-[10px] text-[#f72568] underline underline-offset-2"
          >
            ← Back to my orders
          </Link>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-serif text-[24px] font-medium leading-tight">
              Purchased scents
            </h2>

            <StatusBadge status={order.status} />
          </div>

          <ul className="mt-5">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex items-center gap-5 border-b border-[#f1eeef] py-4 md:gap-8"
              >
                <div className="flex h-[80px] w-[70px] shrink-0 items-center justify-center rounded-xl bg-[#fff5f8]">
                  {item.product?.image ? (
                    <img
                      src={item.product.image}
                      alt={item.product_name}
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <Package
                      size={25}
                      strokeWidth={1.2}
                      className="text-[#d7a5b6]"
                    />
                  )}
                </div>

                <div className="min-w-0">
                  <p className="text-[13px] font-semibold">
                    {item.product_name}
                  </p>

                  <p className="mt-2 text-[11px] text-[#6d656c]">
                    {item.product?.type || "Fragrance"} ·{" "}
                    {item.product?.size || "—"} · Qty {item.quantity}
                  </p>

                  <p className="mt-2 text-[12px] font-semibold">
                    {egp(item.subtotal)}
                  </p>

                  <p className="mt-1 text-[10px] text-[#888087]">
                    {egp(item.unit_price)} each
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <section className="mt-7 border-t border-[#f1eeef] pt-5">
            <h2 className="font-serif text-[22px] font-medium leading-tight">
              Delivery address
            </h2>

            <div className="mt-4 text-[12px] leading-[1.8] text-[#4a424a]">
              <p className="font-semibold">{customerName}</p>

              {address.map((line, index) => (
                <p key={index}>{line}</p>
              ))}

              <p>{order.phone}</p>
              <p>{order.email}</p>
            </div>

            {order.note && (
              <p className="mt-4 text-[11px] text-[#6d656c]">
                Delivery note: {order.note}
              </p>
            )}
          </section>

          {payment && (
            <section className="mt-7 border-t border-[#f1eeef] pt-5">
              <h2 className="font-serif text-[22px] font-medium leading-tight">
                Payment information
              </h2>

              <div className="mt-4 flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#fff5f8] text-[#f72568]">
                  <Wallet size={17} />
                </div>

                <div className="text-[11px]">
                  <p className="font-semibold">
                    {payment.payment_method_label ||
                      formatStatus(payment.payment_method)}
                  </p>

                  <p className="mt-1 text-[#777078]">
                    Payment status: {formatStatus(payment.status)}
                  </p>

                  {payment.reference && (
                    <p className="mt-1 text-[#888087]">
                      Reference: {payment.reference}
                    </p>
                  )}
                </div>
              </div>

              {payment.payment_url && payment.status !== "paid" && (
                <a
                  href={payment.payment_url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex h-10 items-center justify-center rounded-full bg-[#f72568] px-6 text-[11px] font-medium text-white"
                >
                  Continue payment
                </a>
              )}
            </section>
          )}
        </div>

        <div className="space-y-5 self-start">
          <section
            className="rounded-2xl bg-[#fff5f8] p-5"
            aria-labelledby="total-title"
          >
            <h2
              id="total-title"
              className="font-serif text-[20px] font-medium leading-none"
            >
              Order total
            </h2>

            <dl className="mt-5 grid grid-cols-2 gap-y-3 text-[11px] text-[#4a424a]">
              <dt>Subtotal</dt>
              <dd className="text-right font-semibold text-[#292329]">
                {egp(order.subtotal)}
              </dd>

              <dt>Delivery</dt>
              <dd className="text-right font-semibold text-[#292329]">
                {egp(order.shipping_cost)}
              </dd>
            </dl>

            <div className="mt-4 grid grid-cols-2 items-baseline border-t border-[#f0e2e7] pt-4">
              <span className="text-[14px]">Total</span>

              <span className="text-right text-[18px] font-semibold">
                {egp(order.total)}
              </span>
            </div>

            <p className="mt-4 text-[9px] text-[#6d656c]">
              All prices in EGP · Totals
            </p>
          </section>

          <section
            className="rounded-2xl bg-[#fff5f8] p-5"
            aria-labelledby="help-title"
          >
            <h2
              id="help-title"
              className="font-serif text-[20px] font-medium leading-none"
            >
              A little help
            </h2>

            <p className="mt-4 text-[11px] leading-[1.5] text-[#4a424a]">
              {delivered
                ? "Easy 14-day returns. Choose the scent you'd like to return and tell us why."
                : "You can contact us if you need help with this order."}
            </p>

            {delivered && (
              <button
                type="button"
                onClick={() => setModal("return")}
                className="mt-4 h-10 w-full rounded-full bg-[#f72568] text-[12px] font-medium text-white"
              >
                Request a return
              </button>
            )}

            <button
              type="button"
              onClick={() => setModal("contact")}
              className="mt-3 text-[10px] text-[#f72568] underline underline-offset-2"
            >
              Contact about this order →
            </button>

            <p
              role="status"
              className="mt-3 min-h-[14px] text-[10px] text-[#5b6a46]"
            >
              {status}
            </p>
          </section>
        </div>
      </div>

      {modal === "return" && (
        <ReturnModal
          order={order}
          onClose={() => setModal(null)}
          onDone={(names) => {
            setStatus(
              `Return requested for ${names.join(" and ")}. (Demo: nothing is sent yet.)`,
            );
            setModal(null);
          }}
        />
      )}

      {modal === "contact" && (
        <ContactModal
          order={order}
          onClose={() => setModal(null)}
          onDone={() => {
            setStatus(
              "Your message is ready to send. (Demo: nothing is sent yet.)",
            );
            setModal(null);
          }}
        />
      )}
    </AccountLayout>
  );
}
