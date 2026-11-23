import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AccountLayout from "./AccountLayout";
import { addressLines } from "./AddressCard";
import {
  Field,
  SelectInput,
  GOVERNORATES,
  COUNTRIES,
} from "../CheckoutParts.jsx";
import { useAccount } from "../../Context/AccountContext";

const inputCls =
  "h-11 w-full rounded-2xl border border-[#eae7e9] bg-white px-4 text-[12px] text-[#292329] outline-none placeholder:text-[#b9b3b8] focus:border-[#f72568]";

const split = (full = "") => {
  const [first = "", ...rest] = full.trim().split(/\s+/);
  return { firstName: first, lastName: rest.join(" ") };
};

/** Handles both /account/addresses/new and /account/addresses/:id/edit */
export default function AddressForm() {
  const { id } = useParams();
  const { addresses } = useAccount();
  const existing = id ? addresses.find((a) => a.id === id) : null;

  if (id && !existing) {
    return (
      <AccountLayout
        current="addresses"
        title="Address not found"
        subtitle="We couldn't find that address."
      >
        <Link
          to="/account/addresses"
          className="text-[11px] text-[#f72568] underline underline-offset-2"
        >
          ← Back to address book
        </Link>
      </AccountLayout>
    );
  }
  return <Form key={id || "new"} existing={existing} />;
}

function Form({ existing }) {
  const navigate = useNavigate();
  const { profile, addresses, saveAddress } = useAccount();
  const editing = !!existing;

  const [form, setForm] = useState(() => ({
    ...split(
      existing ? existing.name : `${profile.firstName} ${profile.lastName}`,
    ),
    phone: existing?.phone ?? "",
    street: existing?.street ?? "",
    apartment: existing?.apartment ?? "",
    area: existing?.area ?? "",
    city: existing?.city ?? "",
    country: existing?.country ?? "Egypt",
    label: existing?.label ?? "",
    note: existing?.note ?? "",
    isDefault: existing ? existing.isDefault : addresses.length === 0,
  }));

  const change = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  // Browser validation (required fields, phone pattern) runs before this.
  const submit = (e) => {
    e.preventDefault();
    const t = (v) => v.trim();
    saveAddress({
      ...(existing ? { id: existing.id } : {}),
      label: t(form.label) || "Address",
      name: `${t(form.firstName)} ${t(form.lastName)}`,
      phone: t(form.phone),
      street: t(form.street),
      apartment: t(form.apartment),
      area: t(form.area),
      city: form.city,
      country: form.country,
      note: t(form.note),
      isDefault: form.isDefault,
    });
    navigate("/account/addresses");
  };

  const text = (id, label, ph, { required = true, span, attrs } = {}) => (
    <Field
      id={id}
      label={`${label}${required ? " *" : ""}`}
      className={span ? "sm:col-span-2" : ""}
    >
      <input
        id={id}
        name={id}
        required={required}
        value={form[id]}
        onChange={change}
        placeholder={ph}
        className={inputCls}
        {...attrs}
      />
    </Field>
  );

  const preview = {
    name: `${form.firstName} ${form.lastName}`.trim() || "Your name",
    street: form.street || "Street address",
    apartment: form.apartment,
    area: form.area || "Area",
    city: form.city || "City",
    country: form.country || "Country",
    phone: form.phone || "Phone number",
  };

  return (
    <AccountLayout
      current="addresses"
      title={editing ? "Edit delivery address" : "Add delivery address"}
      subtitle="A few details, so your scents can find their way to you."
    >
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px] xl:grid-cols-[minmax(0,640px)_300px] xl:gap-12">
        <form onSubmit={submit}>
          <p className="text-[9px] text-[#6d656c]">
            * Required fields · Address
          </p>

          <div className="mt-5 grid gap-x-3 gap-y-4 sm:grid-cols-2">
            {text("firstName", "First name", "Salma", {
              attrs: { autoComplete: "given-name" },
            })}
            {text("lastName", "Last name", "Hassan", {
              attrs: { autoComplete: "family-name" },
            })}
            {text("phone", "Phone number", "+20 100 123 4567", {
              span: true,
              attrs: {
                type: "tel",
                autoComplete: "tel",
                pattern: "\\+?[0-9\\s\\-]{8,16}",
                title: "Enter a valid phone number, e.g. +20 100 123 4567",
              },
            })}
            {text("street", "Street address", "18 El Nozha Street", {
              span: true,
            })}
            {text("apartment", "Apartment / Floor", "Apartment 4, Floor 2", {
              required: false,
            })}
            {text("area", "Area / District", "Heliopolis")}
            <Field id="city" label="City / Governorate *">
              <SelectInput
                id="city"
                value={form.city}
                onChange={change}
                placeholder="Select governorate"
                options={GOVERNORATES}
                required
              />
            </Field>
            <Field id="country" label="Country *">
              <SelectInput
                id="country"
                value={form.country}
                onChange={change}
                placeholder="Select country"
                options={COUNTRIES}
                required
              />
            </Field>
            {text("label", "Address label (optional)", "Home", {
              required: false,
              span: true,
            })}
            {text(
              "note",
              "Delivery note (optional)",
              "Building entrance beside the pharmacy.",
              { required: false, span: true },
            )}
          </div>

          <label className="mt-6 flex items-start gap-3">
            <input
              type="checkbox"
              name="isDefault"
              checked={form.isDefault}
              onChange={change}
              className="mt-0.5 h-4 w-4 accent-[#f72568]"
            />
            <span>
              <span className="block text-[12px]">
                Use as my default delivery address
              </span>
              <span className="mt-1 block text-[9px] text-[#6d656c]">
                You can still choose a different address at checkout.
              </span>
            </span>
          </label>

          <div className="mt-6 flex items-center gap-3">
            <button
              type="submit"
              className="h-10 rounded-full bg-[#f72568] px-6 text-[12px] font-medium text-white"
            >
              Save address
            </button>
            <button
              type="button"
              onClick={() => navigate("/account/addresses")}
              className="h-10 rounded-full border border-[#eae7e9] bg-white px-6 text-[12px] font-medium"
            >
              Cancel
            </button>
          </div>
        </form>

        <div className="self-start">
          <aside
            className="rounded-2xl bg-[#fff5f8] p-6"
            aria-labelledby="glance-title"
          >
            <h2
              id="glance-title"
              className="font-serif text-[20px] font-medium leading-tight"
            >
              Your address at a glance
            </h2>
            <h3 className="mt-4 font-serif text-[17px] font-medium leading-snug">
              {form.label.trim() || "Address"}
              {form.isDefault && " · Default delivery address"}
            </h3>
            <address className="mt-4 text-[12px] not-italic leading-[1.55] text-[#5a525a]">
              {addressLines(preview).map((l, i) => (
                <span key={i} className="block">
                  {l}
                </span>
              ))}
            </address>
            <p className="mt-5 text-[9px] text-[#6d656c]">Customer details</p>
            <p className="mt-4 text-[9px] leading-[1.5] text-[#6d656c]">
              This form also supports adding a new address. Save only once all
              required details are complete.
            </p>
          </aside>
          <Link
            to="/delivery-returns"
            className="mt-4 inline-block text-[10px] text-[#f72568] underline underline-offset-2"
          >
            Need delivery help?
          </Link>
        </div>
      </div>
    </AccountLayout>
  );
}
