import { useState } from "react";
import { Link } from "react-router-dom";
import { Check, Pencil, Wallet } from "lucide-react";

import { useCart, egp } from "../Context/CartContext.jsx";
import { CheckoutSteps } from "./CheckoutParts";

const KEY = "glamora-checkout-v1";

const getCheckoutData = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "{}");
  } catch {
    return {};
  }
};

function DeliveryCard({ values }) {
  const fullName = [values.firstName, values.lastName]
    .filter(Boolean)
    .join(" ");

  const address = [values.street, values.apartment, values.area]
    .filter(Boolean)
    .join(", ");

  return (
    <section className="rounded-xl bg-[#fff5f8] p-4 md:p-5">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-[20px] font-semibold">Deliver to</h2>

        <Link
          to="/checkout"
          className="text-[10px] underline underline-offset-2"
        >
          Edit
        </Link>
      </div>

      <div className="mt-3 space-y-1 text-[10px] leading-[1.6]">
        <p className="font-semibold">{fullName}</p>

        <p>{address}</p>

        <p>{[values.city, values.country].filter(Boolean).join(", ")}</p>

        <p className="text-[#777078]">{values.phone} · Delivery address</p>
      </div>

      <div className="mt-3 border-t border-[#f0e2e7] pt-3">
        <p className="text-[10px]">Contact: {values.email}</p>

        <p className="mt-2 text-[10px] text-[#777078]">
          Standard delivery · Customer details
        </p>

        {values.note && (
          <p className="mt-2 text-[10px] text-[#777078]">
            Delivery note: {values.note}
          </p>
        )}
      </div>
    </section>
  );
}

function CashOnDelivery() {
  return (
    <section>
      <h2 className="font-serif text-[19px] font-medium">Choose how to pay</h2>

      <label className="mt-3 flex min-h-[65px] cursor-pointer items-center gap-4 rounded-xl border border-[#f72568] bg-white px-4 py-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center text-[#f72568]">
          <Wallet size={20} strokeWidth={1.5} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold">Cash on delivery</p>

          <p className="mt-1 text-[9px] text-[#777078]">
            Pay when your order arrives
          </p>
        </div>

        <input
          type="radio"
          name="payment"
          value="cod"
          checked
          readOnly
          className="h-3.5 w-3.5 accent-[#f72568]"
        />
      </label>
    </section>
  );
}

function PaymentOrderSummary() {
  const { cartItems, cartCount, subtotal, discount, deliveryFee, total } =
    useCart();

  return (
    <aside className="self-start rounded-xl bg-[#fff5f8] p-5 md:p-6">
      <h2 className="font-serif text-[20px] font-semibold">Order summary</h2>

      <p className="mt-2 text-[9px] text-[#888087]">
        {cartCount} {cartCount === 1 ? "item" : "items"} · All prices in EGP
      </p>

      <ul className="mt-5 space-y-4 border-b border-[#f0e2e7] pb-4">
        {cartItems.map((item) => (
          <li key={item.key} className="flex items-center gap-4">
            <div className="flex h-[65px] w-[48px] shrink-0 items-center justify-center">
              <img
                src={item.product.img}
                alt={item.product.name}
                className="max-h-full max-w-full object-contain"
              />
            </div>

            <div className="min-w-0 text-[10px]">
              <p className="font-semibold">{item.product.name}</p>

              <p className="mt-1 text-[#777078]">
                {item.family || item.product.family} · {item.volume}ml · Qty{" "}
                {item.qty}
              </p>

              <p className="mt-1 font-semibold">{egp(item.lineTotal)}</p>
            </div>
          </li>
        ))}
      </ul>

      <dl className="mt-4 space-y-2.5 text-[10px]">
        <div className="flex justify-between">
          <dt>Subtotal</dt>
          <dd className="font-semibold">{egp(subtotal)}</dd>
        </div>

        {discount > 0 && (
          <div className="flex justify-between">
            <dt>Promo</dt>
            <dd className="font-semibold">−{egp(discount)}</dd>
          </div>
        )}

        <div className="flex justify-between">
          <dt>Delivery</dt>
          <dd className="font-semibold">{egp(deliveryFee)}</dd>
        </div>
      </dl>

      <div className="mt-4 flex items-center justify-between border-t border-[#f0e2e7] pt-3">
        <span className="text-[14px] font-semibold">Total</span>

        <span className="text-[15px] font-semibold">{egp(total)}</span>
      </div>

      <p className="mt-4 text-[9px] text-[#888087]">Easy 14-day returns.</p>
    </aside>
  );
}

export default function PaymentReview() {
  const { cartItems, total } = useCart();

  const [confirmed, setConfirmed] = useState(false);

  const values = getCheckoutData();

  const placeOrder = () => {
    // Frontend demo only. Connect this action to the order API later.
    setConfirmed(true);
  };

  if (cartItems.length === 0) {
    return (
      <main className="mx-auto max-w-[1240px] px-4 py-20 text-center">
        <h1 className="font-serif text-2xl">Your bag is empty.</h1>

        <Link
          to="/shop"
          className="mt-4 inline-block text-[12px] text-[#f72568] underline"
        >
          Explore fragrances
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-[1240px] px-4 pb-16 pt-4 text-[#292329] md:px-6">
      <CheckoutSteps current={confirmed ? 3 : 2} />

      <nav className="mt-6 text-[9px] text-[#888087]">
        <Link to="/cart" className="hover:underline">
          Your cart
        </Link>{" "}
        / Checkout
      </nav>

      <header className="mt-3 border-b border-[#eae7e9] pb-3">
        <h1 className="font-serif text-[30px] font-medium leading-tight md:text-[38px]">
          {confirmed ? "Order confirmation" : "Payment & review"}
        </h1>

        <p className="mt-2 text-[11px] text-[#6d656c]">
          {confirmed
            ? "Your order details are ready."
            : "One last look. Make sure everything feels right."}
        </p>
      </header>

      {confirmed ? (
        <div className="mx-auto max-w-[500px] py-16 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#fff5f8]">
            <Check size={28} className="text-[#f72568]" />
          </div>

          <h2 className="mt-5 font-serif text-[24px]">Thank you!</h2>

          <p className="mt-2 text-[11px] leading-6 text-[#777078]">
            This is a frontend confirmation preview. Connect the order API to
            submit and confirm real orders.
          </p>

          <Link
            to="/shop"
            className="mt-5 inline-flex h-10 items-center justify-center rounded-full bg-[#f72568] px-7 text-[11px] text-white"
          >
            Continue shopping
          </Link>
        </div>
      ) : (
        <div className="mt-5 grid items-start gap-7 lg:grid-cols-[64fr_36fr]">
          <div className="space-y-4">
            <button
              type="button"
              onClick={placeOrder}
              className="h-[38px] rounded-xl bg-[#f72568] px-5 text-[10px] font-medium text-white transition-colors hover:bg-[#df1758]"
            >
              Place order — Pay {egp(total)} on delivery
            </button>

            <DeliveryCard values={values} />

            <CashOnDelivery />

            <Link
              to="/checkout"
              className="inline-flex items-center gap-1 text-[10px] text-[#777078] hover:text-[#f72568]"
            >
              ← Back to delivery
            </Link>

            <p className="text-[9px] text-[#888087]">
              By placing your order, you agree to our terms and returns policy.
            </p>
          </div>

          <PaymentOrderSummary />
        </div>
      )}
    </main>
  );
}
