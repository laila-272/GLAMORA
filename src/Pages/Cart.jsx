import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus } from "lucide-react";
import { useCart, egp, FREE_DELIVERY_THRESHOLD } from "../Context/CartContext.jsx";

const WORDS = [
  "",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
];

export default function Cart() {
  const navigate = useNavigate();
  const {
    cartItems,
    cartCount,
    subtotal,
    discount,
    deliveryFee,
    total,
    promo,
    updateQuantity,
    removeFromCart,
    applyPromo,
    removePromo,
  } = useCart();
  const [code, setCode] = useState("");
  const [feedback, setFeedback] = useState(null); // { ok, message }

  const n = cartItems.length;
  const subtitle =
    n === 0
      ? "Your bag is waiting for its first scent."
      : `${WORDS[n] || n} favourite ${n === 1 ? "scent" : "scents"}, ready to become your own.`;

  const remaining = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);
  const progress = Math.min(100, (subtotal / FREE_DELIVERY_THRESHOLD) * 100);

  const onApply = () => {
    const res = applyPromo(code);
    setFeedback(res);
    if (res.ok) setCode("");
  };
  const onRemovePromo = () => {
    removePromo();
    setFeedback(null);
  };

  return (
    <main className="mx-auto max-w-[1240px] px-4 pb-16 pt-3 text-[#292329] md:px-6">
      <nav className="text-[10px] text-[#888087]" aria-label="Breadcrumb">
        <Link to="/" className="hover:underline">
          Home
        </Link>{" "}
        / <span>Your cart</span>
      </nav>

      <header className="mt-5 border-b border-[#f1eeef] pb-5">
        <h1 className="font-serif text-[40px] font-medium leading-none md:text-[52px]">
          Your cart
        </h1>
        <p className="mt-4 text-[14px] text-[#6d656c]">{subtitle}</p>
      </header>

      {n === 0 ? (
        <div className="py-20 text-center">
          <p className="font-serif text-2xl">Your bag is empty.</p>
          <Link
            to="/shop"
            className="mt-4 inline-block text-[12px] underline underline-offset-2"
          >
            Continue shopping →
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-8 lg:grid-cols-[65fr_35fr] lg:gap-10">
          {/* Items */}
          <section>
            <div className="flex items-center justify-between text-[12px]">
              <span className="font-medium">
                {cartCount} {cartCount === 1 ? "item" : "items"}
              </span>
              <Link to="/shop" className="underline underline-offset-2">
                Continue shopping →
              </Link>
            </div>

            <ul>
              {cartItems.map((it) => (
                <li
                  key={it.key}
                  className="flex items-center gap-4 border-b border-[#f1eeef] py-5 last:border-0 sm:gap-8"
                >
                  <Link
                    to={`/product/${it.product.id}`}
                    className="flex h-[110px] w-[84px] shrink-0 items-center justify-center sm:w-[110px]"
                  >
                    <img
                      src={it.product.img}
                      alt={it.product.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <Link
                      to={`/product/${it.product.id}`}
                      className="font-serif text-[16px] font-semibold leading-tight"
                    >
                      {it.product.name}
                    </Link>
                    <p className="mt-2 text-[11px] text-[#888087]">
                      {it.family} · {it.volume}ml · Qty {it.qty}
                    </p>
                    <p className="mt-1.5 text-[12px] font-semibold">
                      {egp(it.lineTotal)}
                    </p>
                    <div className="mt-2 flex h-9 w-[110px] items-center justify-between rounded-full border border-[#292329] px-3">
                      <button
                        type="button"
                        aria-label="Decrease quantity"
                        onClick={() => updateQuantity(it.key, it.qty - 1)}
                        disabled={it.qty <= 1}
                        className="disabled:opacity-30"
                      >
                        <Minus size={11} />
                      </button>
                      <span className="text-[12px]" aria-live="polite">
                        {it.qty}
                      </span>
                      <button
                        type="button"
                        aria-label="Increase quantity"
                        onClick={() => updateQuantity(it.key, it.qty + 1)}
                      >
                        <Plus size={11} />
                      </button>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFromCart(it.key)}
                    className="self-center text-[11px] underline underline-offset-2"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-4 rounded-2xl bg-[#faf8f3] p-5">
              <p className="text-[13px] font-semibold text-[#5b6a46]">
                {remaining > 0
                  ? `You're ${egp(remaining)} away from free delivery.`
                  : "Free delivery unlocked — your order ships on us."}
              </p>
              <div
                className="mt-3 h-1 w-full overflow-hidden rounded-full bg-[#f6dfe6]"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={FREE_DELIVERY_THRESHOLD}
                aria-valuenow={Math.min(subtotal, FREE_DELIVERY_THRESHOLD)}
              >
                <div
                  className="h-full rounded-full bg-[#5b6a46] transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="mt-3 text-[10px] text-[#6d656c]">
                {egp(subtotal)} of {egp(FREE_DELIVERY_THRESHOLD)} · Based on
                merchandise subtotal.
              </p>
            </div>
          </section>

          {/* Summary */}
          <aside className="self-start rounded-2xl bg-[#fff6f8] p-6">
            <h2 className="font-serif text-[22px] font-semibold leading-none">
              Order summary
            </h2>

            <dl className="mt-5 grid grid-cols-[1fr_1fr] gap-y-3 text-[12px] text-[#6d656c]">
              <dt>Subtotal</dt>
              <dd className="font-medium text-[#292329]">{egp(subtotal)}</dd>
              {discount > 0 && (
                <>
                  <dt>Promo ({promo.code})</dt>
                  <dd className="font-medium text-[#5b6a46]">
                    −{egp(discount)}
                  </dd>
                </>
              )}
              <dt>Delivery</dt>
              <dd className="font-medium text-[#292329]">{egp(deliveryFee)}</dd>
            </dl>

            <div className="mt-4 grid grid-cols-[1fr_1fr] items-baseline border-t border-[#f1dfe5] pt-4">
              <span className="text-[16px]">Total</span>
              <span className="text-[20px] font-semibold">{egp(total)}</span>
            </div>

            <div className="mt-6">
              <label htmlFor="promo" className="text-[11px] font-medium">
                Promo code
              </label>
              <div className="mt-2 flex gap-2">
                <input
                  id="promo"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && onApply()}
                  placeholder="Enter code"
                  disabled={!!promo}
                  className="h-9 min-w-0 flex-1 rounded-full border border-[#eae7e9] bg-white px-4 text-[11px] outline-none disabled:bg-[#faf6f7]"
                />
                <button
                  type="button"
                  onClick={onApply}
                  disabled={!!promo}
                  className="h-9 rounded-full border border-[#eae7e9] bg-white px-5 text-[11px] disabled:opacity-40"
                >
                  Apply
                </button>
              </div>
              <p
                className={`mt-2 text-[10px] ${promo || feedback?.ok ? "text-[#5b6a46]" : feedback ? "text-[#f32970]" : "text-[#888087]"}`}
                role="status"
              >
                {promo
                  ? `${promo.code} applied: ${promo.label}.`
                  : feedback
                    ? feedback.message
                    : "No promo code applied."}
                {promo && (
                  <button
                    type="button"
                    onClick={onRemovePromo}
                    className="ml-2 text-[#292329] underline"
                  >
                    Remove
                  </button>
                )}
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/checkout")}
              className="mt-5 h-11 w-full rounded-full bg-[#f32970] text-[12px] font-medium text-white"
            >
              Continue to checkout →
            </button>
            <p className="mt-5 text-[10px] text-[#6d656c]">
              Cash on delivery available. Easy 14-day returns.
            </p>
            <Link
              to="/delivery-returns"
              className="mt-4 inline-block text-[11px] underline underline-offset-2"
            >
              Delivery &amp; returns
            </Link>
          </aside>
        </div>
      )}
    </main>
  );
}
