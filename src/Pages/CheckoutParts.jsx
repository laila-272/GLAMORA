import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart, egp } from "../Context/CartContext.jsx";
import { ChevronDown, Check } from "lucide-react";

const inputCls =
  "h-10 w-full rounded-xl border border-[#eae7e9] bg-white px-4 text-[11px] text-[#292329] outline-none placeholder:text-[#b9b3b8] focus:border-[#f72568]";

export const GOVERNORATES = [
  "Cairo",
  "Giza",
  "Alexandria",
  "Qalyubia",
  "Dakahlia",
  "Gharbia",
  "Sharqia",
  "Monufia",
  "Beheira",
  "Kafr El Sheikh",
  "Damietta",
  "Port Said",
  "Ismailia",
  "Suez",
  "North Sinai",
  "South Sinai",
  "Fayoum",
  "Beni Suef",
  "Minya",
  "Assiut",
  "Sohag",
  "Qena",
  "Luxor",
  "Aswan",
  "Red Sea",
  "New Valley",
  "Matrouh",
];

export const COUNTRIES = ["Egypt"];

export function Field({ id, label, className = "", children }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-[9px] text-[#6d656c]">
        {label}
      </label>
      {children}
    </div>
  );
}

export function SelectInput({
  id,
  value,
  onChange,
  placeholder,
  options,
  required,
}) {
  return (
    <div className="relative">
      <select
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        required={required}
        className={`${inputCls} appearance-none pr-9 ${
          value ? "" : "text-[#b9b3b8]"
        }`}
      >
        <option value="" disabled>
          {placeholder}
        </option>

        {options.map((option) => (
          <option key={option} value={option} className="text-[#292329]">
            {option}
          </option>
        ))}
      </select>

      <ChevronDown
        size={13}
        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#8a7a7d]"
      />
    </div>
  );
}

export function CheckoutSteps({ current = 1 }) {
  const steps = ["Contact & delivery", "Payment & review", "Confirmation"];

  return (
    <ol className="mx-auto mt-4 flex max-w-[820px] items-center justify-between gap-2 px-4 text-[11px]">
      {steps.map((label, index) => {
        const number = index + 1;
        const active = number === current;
        const completed = number < current;

        return (
          <li
            key={label}
            className="flex items-center gap-2"
            aria-current={active ? "step" : undefined}
          >
            <span
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-medium ${
                active || completed
                  ? "bg-[#f72568] text-white"
                  : "bg-[#fde8ef] text-[#6d656c]"
              }`}
            >
              {completed ? <Check size={13} /> : number}
            </span>

            <span
              className={`${
                active ? "text-[#f72568]" : "hidden text-[#6d656c] sm:inline"
              }`}
            >
              {label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

export function GuestBanner() {
  const [note, setNote] = useState(false);

  return (
    <section className="flex items-center justify-between gap-4 rounded-2xl bg-[#fff5f8] px-5 py-4">
      <div>
        <h2 className="text-[11px] font-semibold">Continue as a guest</h2>

        <p className="mt-1 text-[9px] text-[#6d656c]">
          {note
            ? "Sign in isn't available yet — you can keep going as a guest."
            : "No account needed. Already part of GLAMORA?"}
        </p>
      </div>

      <button
        type="button"
        onClick={() => setNote(true)}
        className="h-7 shrink-0 rounded-full border border-[#eae7e9] bg-white px-5 text-[10px] font-medium"
      >
        Sign in
      </button>
    </section>
  );
}

const sectionTitle = "font-serif text-[22px] font-semibold leading-tight";

export function ContactForm({ values, onChange }) {
  return (
    <section aria-labelledby="contact-title">
      <h2 id="contact-title" className={sectionTitle}>
        Contact details
      </h2>

      <p className="mt-2 text-[9px] text-[#6d656c]">
        Enter your contact and delivery details.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Field id="email" label="Email address">
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="salma.hassan@example.com"
            value={values.email}
            onChange={onChange}
            className={inputCls}
          />
        </Field>

        <Field id="phone" label="Phone number">
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            required
            placeholder="+20 100 123 4567"
            pattern="\+?[0-9\s\-]{8,16}"
            title="Enter a valid phone number, e.g. +20 100 123 4567"
            value={values.phone}
            onChange={onChange}
            className={inputCls}
          />
        </Field>
      </div>
    </section>
  );
}

export function DeliveryForm({ values, onChange }) {
  const text = (id, label, placeholder, extra = {}) => (
    <Field id={id} label={label} className={extra.className}>
      <input
        id={id}
        name={id}
        type="text"
        placeholder={placeholder}
        value={values[id]}
        onChange={onChange}
        required={extra.required !== false}
        autoComplete={extra.auto}
        className={inputCls}
      />
    </Field>
  );

  return (
    <section aria-labelledby="delivery-title">
      <h2 id="delivery-title" className={sectionTitle}>
        Delivery address
      </h2>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {text("firstName", "First name", "Salma", {
          auto: "given-name",
        })}

        {text("lastName", "Last name", "Hassan", {
          auto: "family-name",
        })}

        {text("street", "Street address", "18 El Nozha Street", {
          className: "sm:col-span-2",
          auto: "street-address",
        })}

        {text("apartment", "Apartment / Floor", "Apartment 4, Floor 2", {
          required: false,
        })}

        {text("area", "Area / District", "Heliopolis")}

        <Field id="city" label="City / Governorate">
          <SelectInput
            id="city"
            value={values.city}
            onChange={onChange}
            placeholder="Select governorate"
            options={GOVERNORATES}
            required
          />
        </Field>

        <Field id="country" label="Country">
          <SelectInput
            id="country"
            value={values.country}
            onChange={onChange}
            placeholder="Select country"
            options={COUNTRIES}
            required
          />
        </Field>

        <Field
          id="note"
          label="Delivery note (optional)"
          className="sm:col-span-2"
        >
          <input
            id="note"
            name="note"
            type="text"
            placeholder="Building entrance beside the pharmacy."
            value={values.note}
            onChange={onChange}
            className={inputCls}
          />
        </Field>
      </div>
    </section>
  );
}

export function DeliveryOption() {
  const { deliveryFee } = useCart();

  return (
    <fieldset className="rounded-xl border border-[#eae7e9] p-4">
      <legend className="sr-only">Delivery option</legend>

      <label className="flex items-center gap-2 text-[11px] font-medium">
        <input
          type="radio"
          name="delivery"
          checked
          readOnly
          className="h-2.5 w-2.5 accent-[#292329]"
        />
        Standard delivery — {egp(deliveryFee)}
      </label>

      <p className="mt-2 text-[10px] leading-[1.5] text-[#6d656c]">
        Free delivery over EGP 2,000 merchandise subtotal. Confirm delivery
        timing and availability before ordering.
      </p>
    </fieldset>
  );
}

export function OrderSummary() {
  const {
    cartItems,
    cartCount,
    subtotal,
    discount,
    deliveryFee,
    total,
    productsLoading,
    productsError,
  } = useCart();

  return (
    <aside
      className="self-start rounded-2xl bg-[#fff5f8] p-6"
      aria-labelledby="summary-title"
    >
      <h2
        id="summary-title"
        className="font-serif text-[22px] font-semibold leading-none"
      >
        Order summary
      </h2>

      <p className="mt-3 text-[9px] text-[#6d656c]">
        {cartCount} {cartCount === 1 ? "item" : "items"} · All prices in EGP
      </p>

      {productsLoading ? (
        <p className="py-8 text-center text-[11px] text-[#6d656c]">
          Loading products...
        </p>
      ) : productsError ? (
        <p className="py-8 text-center text-[11px] text-[#6d656c]">
          Unable to load products. Please try again.
        </p>
      ) : (
        <ul className="mt-5 space-y-4 border-b border-[#f1dfe5] pb-5">
          {cartItems.map((item) => {
            const mainImage = item.product.images?.find(
              (image) => image.is_active && image.purpose === "main",
            );

            return (
              <li key={item.key} className="flex items-center gap-5">
                <div className="flex h-[64px] w-[56px] shrink-0 items-center justify-center">
                  {mainImage?.path && (
                    <img
                      src={mainImage.path}
                      alt={mainImage.alt_text || item.product.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  )}
                </div>

                <div className="min-w-0 text-[11px]">
                  <p className="font-semibold">{item.product.name}</p>

                  <p className="mt-1.5 text-[10px] text-[#6d656c]">
                    {item.product.family?.name} · {item.volume} · Qty {item.qty}
                  </p>

                  <p className="mt-1.5 font-semibold">{egp(item.lineTotal)}</p>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <dl className="mt-4 grid grid-cols-2 gap-y-2.5 text-[11px] text-[#292329]">
        <dt>Subtotal</dt>
        <dd className="font-semibold">{egp(subtotal)}</dd>

        {discount > 0 && (
          <>
            <dt>Promo</dt>
            <dd className="font-semibold">−{egp(discount)}</dd>
          </>
        )}

        <dt>Delivery</dt>
        <dd className="font-semibold">{egp(deliveryFee)}</dd>
      </dl>

      <div className="mt-4 grid grid-cols-2 items-baseline">
        <span className="text-[14px]">Total</span>
        <span className="text-[16px] font-semibold">{egp(total)}</span>
      </div>

      <p className="mt-5 text-[9px] text-[#6d656c]">
        Easy 14-day returns. Cash on delivery available.
      </p>
    </aside>
  );
}

export function CheckoutBackLink() {
  return (
    <Link to="/cart" className="text-[10px] underline underline-offset-2">
      ← Return to cart
    </Link>
  );
}
