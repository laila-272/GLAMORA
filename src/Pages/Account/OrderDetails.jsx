import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import AccountLayout from "./AccountLayout";
import Modal from "./Modal";
import { addressLines } from "./AddressCard";
import { useAccount } from "../../Context/AccountContext.jsx";
import { egp } from "../../Context/CartContext";
import { getOrder } from "../../data/Orders.js";

const inputCls =
  "w-full rounded-xl border border-[#eae7e9] bg-white px-4 text-[12px] outline-none placeholder:text-[#b9b3b8] focus:border-[#f72568]";
const REASONS = [
  "Not what I expected",
  "Changed my mind",
  "Arrived damaged",
  "Wrong item received",
  "Other",
];

// Demo only: both forms confirm on screen, nothing is sent to a server yet.
function ReturnModal({ order, onClose, onDone }) {
  const [picked, setPicked] = useState([]);
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [error, setError] = useState("");

  const toggle = (id) =>
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  const submit = (e) => {
    e.preventDefault();
    if (!picked.length) return setError("Choose at least one scent to return.");
    onDone(
      order.items
        .filter((i) => picked.includes(i.productId))
        .map((i) => i.name),
    );
  };

  return (
    <Modal title="Request a return" onClose={onClose}>
      <form onSubmit={submit}>
        <p className="mt-3 text-[11px] text-[#6d656c]">
          Easy 14-day returns for {order.id}.
        </p>
        <fieldset className="mt-5">
          <legend className="mb-2 text-[10px] font-medium">
            Which scents would you like to return?
          </legend>
          {order.items.map((i) => (
            <label
              key={i.productId}
              className="mb-2 flex items-center gap-2 text-[12px]"
            >
              <input
                type="checkbox"
                checked={picked.includes(i.productId)}
                onChange={() => toggle(i.productId)}
                className="accent-[#f72568]"
              />
              {i.name} · {i.volume}ml
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
          {REASONS.map((r) => (
            <option key={r}>{r}</option>
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
  const [email, setEmail] = useState(profile.email);
  const [message, setMessage] = useState("");

  const submit = (e) => {
    e.preventDefault();
    onDone();
  };

  return (
    <Modal title="Contact about this order" onClose={onClose}>
      <form onSubmit={submit}>
        <p className="mt-3 text-[11px] text-[#6d656c]">
          Order {order.id} · {order.date}
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

export default function OrderDetails() {
  const { orderId } = useParams();
  const order = getOrder(orderId);
  const [modal, setModal] = useState(null); // "return" | "contact" | null
  const [status, setStatus] = useState("");

  if (!order) {
    return (
      <AccountLayout
        current="orders"
        title="Order not found"
        subtitle="We couldn't find that order."
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

  const delivered = order.status === "Delivered";

  return (
    <AccountLayout
      current="orders"
      title="Your order, thoughtfully."
      subtitle={`${order.id} · Order · ${order.date}`}
    >
      <div className="grid gap-8 xl:grid-cols-[1fr_280px]">
        <div>
          <Link
            to="/account/orders"
            className="text-[10px] text-[#f72568] underline underline-offset-2"
          >
            ← Back to my orders
          </Link>

          <h2 className="mt-5 font-serif text-[24px] font-medium leading-tight">
            Purchased scents
          </h2>
          <ul className="mt-5">
            {order.items.map((i) => (
              <li
                key={i.productId}
                className="flex items-center gap-8 border-b border-[#f1eeef] py-4"
              >
                <div className="flex h-[80px] w-[70px] shrink-0 items-center justify-center">
                  <img
                    src={i.img}
                    alt={i.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <div>
                  <p className="text-[13px] font-semibold">{i.name}</p>
                  <p className="mt-2 text-[11px] text-[#6d656c]">
                    {i.family} · {i.volume}ml · Qty {i.qty}
                  </p>
                  <p className="mt-2 text-[12px] font-semibold">
                    {egp(i.lineTotal)}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <h2 className="mt-6 font-serif text-[22px] font-medium leading-tight">
            {order.address.label} · Default delivery address
          </h2>
          <address className="mt-4 text-[12px] not-italic leading-[1.6] text-[#4a424a]">
            {addressLines(order.address).map((l, i) => (
              <span key={i} className="block">
                {l}
              </span>
            ))}
          </address>
          <p className="mt-4 text-[10px] text-[#6d656c]">Customer details</p>
          <p className="mt-3 text-[10px] text-[#4a424a]">
            Contact: {order.email}
          </p>
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
                {egp(order.merchandise)}
              </dd>
              <dt>Delivery</dt>
              <dd className="text-right font-semibold text-[#292329]">
                {egp(order.delivery)}
              </dd>
            </dl>
            <div className="mt-4 grid grid-cols-2 items-baseline">
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
                ? "Easy 14-day returns. Choose the scent you’d like to return and tell us why."
                : "This order was cancelled, so there is nothing to return."}
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
