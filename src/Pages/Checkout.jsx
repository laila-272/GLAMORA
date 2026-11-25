import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../Context/CartContext.jsx";

import {
  CheckoutSteps,
  GuestBanner,
  ContactForm,
  DeliveryForm,
  DeliveryOption,
  OrderSummary,
  CheckoutBackLink,
} from "./CheckoutParts";

const KEY = "glamora-checkout-v1";

const blank = {
  email: "",
  phone: "",
  firstName: "",
  lastName: "",
  street: "",
  apartment: "",
  area: "",
  city: "",
  country: "Egypt",
  note: "",
};

const load = () => {
  try {
    return {
      ...blank,
      ...JSON.parse(localStorage.getItem(KEY) || "{}"),
    };
  } catch {
    return blank;
  }
};

export default function Checkout() {
  const { cartItems, productsLoading, productsError } = useCart();

  const navigate = useNavigate();

  const [values, setValues] = useState(load);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(values));
    } catch {
      // Ignore storage errors.
    }
  }, [values]);

  const onChange = (e) => {
    setValues((current) => ({
      ...current,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    navigate("/payment-review");
  };

  return (
    <main className="mx-auto max-w-[1240px] px-4 pb-16 pt-4 text-[#292329] md:px-6">
      <CheckoutSteps current={1} />

      <nav className="mt-6 text-[9px] text-[#888087]" aria-label="Breadcrumb">
        <Link to="/cart" className="hover:underline">
          Your cart
        </Link>{" "}
        / <span>Checkout</span>
      </nav>

      <header className="mt-3 border-b border-[#eae7e9] pb-4">
        <h1 className="font-serif text-[38px] font-medium leading-none md:text-[48px]">
          Contact &amp; delivery
        </h1>

        <p className="mt-4 text-[13px] text-[#6d656c]">
          A few details, so your scents can find their way to you.
        </p>
      </header>

      {productsLoading ? (
        <p className="py-16 text-center text-[13px]">Loading your bag...</p>
      ) : productsError ? (
        <p className="py-16 text-center text-[13px]">
          Unable to load products. Please try again.
        </p>
      ) : cartItems.length === 0 ? (
        <p className="py-16 text-center text-[13px]">
          Your bag is empty.{" "}
          <Link to="/shop" className="underline">
            Continue shopping →
          </Link>
        </p>
      ) : (
        <div className="mt-7 grid gap-8 lg:grid-cols-[64fr_33fr] lg:gap-7">
          <form onSubmit={onSubmit} className="space-y-6">
            <GuestBanner />

            <ContactForm values={values} onChange={onChange} />

            <hr className="border-[#eae7e9]" />

            <DeliveryForm values={values} onChange={onChange} />

            <DeliveryOption />

            <div className="flex flex-wrap items-center justify-between gap-4">
              <button
                type="submit"
                className="h-10 rounded-full bg-[#f72568] px-6 text-[11px] font-medium text-white"
              >
                Continue to payment
              </button>

              <CheckoutBackLink />
            </div>
          </form>

          <OrderSummary />
        </div>
      )}
    </main>
  );
}
