import { useRef, useState } from "react";
import AccountLayout from "./AccountLayout";
import { useAccount } from "../../Context/AccountContext.jsx";

const input =
  "h-11 w-full rounded-2xl border border-[#eae7e9] bg-white px-4 text-[12px] text-[#292329] outline-none focus:border-[#f72568]";
const label = "mb-2 block text-[10px] font-medium";
const heading = "font-serif text-[20px] font-medium text-[#6d656c]";

export default function PersonalDetails() {
  const { profile, updateProfile } = useAccount();
  const [form, setForm] = useState(profile);
  const [editingEmail, setEditingEmail] = useState(false);
  const [saved, setSaved] = useState(false);
  const emailRef = useRef(null);

  const onChange = (e) => {
    setSaved(false);
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const toggleEmail = () => {
    if (editingEmail) return setEditingEmail(false);
    setEditingEmail(true);
    setTimeout(() => emailRef.current?.focus(), 0);
  };

  // Native validation (required, type=email, phone pattern) runs before this.
  const onSubmit = (e) => {
    e.preventDefault();
    updateProfile({
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
    });
    setEditingEmail(false);
    setSaved(true);
  };

  const onCancel = () => {
    setForm(profile);
    setEditingEmail(false);
    setSaved(false);
  };

  return (
    <AccountLayout
      current="details"
      title="Personal details"
      subtitle="A few familiar details, so everything feels like you."
    >
      <form onSubmit={onSubmit} className="max-w-[760px]">
        <h2 className={heading}>About you</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="firstName" className={label}>
              First name *
            </label>
            <input
              id="firstName"
              name="firstName"
              required
              autoComplete="given-name"
              value={form.firstName}
              onChange={onChange}
              className={input}
            />
          </div>
          <div>
            <label htmlFor="lastName" className={label}>
              Last name *
            </label>
            <input
              id="lastName"
              name="lastName"
              required
              autoComplete="family-name"
              value={form.lastName}
              onChange={onChange}
              className={input}
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="phone" className={label}>
              Phone number *
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              autoComplete="tel"
              value={form.phone}
              onChange={onChange}
              pattern="\+?[0-9\s\-]{8,16}"
              title="Enter a valid phone number, e.g. +20 100 123 4567"
              className={input}
            />
          </div>
        </div>

        <h2 className={`${heading} mt-8`}>Email address</h2>
        <div className="mt-4">
          <label htmlFor="email" className={label}>
            Email address *
          </label>
          <div className="relative">
            <input
              id="email"
              name="email"
              type="email"
              required
              ref={emailRef}
              readOnly={!editingEmail}
              value={form.email}
              onChange={onChange}
              className={`${input} pr-20 ${editingEmail ? "" : "underline underline-offset-2"}`}
            />
            <button
              type="button"
              onClick={toggleEmail}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[13px] font-medium text-[#f72568]"
            >
              {editingEmail ? "Done" : "Edit"}
            </button>
          </div>
          <p className="mt-3 text-[10px] text-[#6d656c]">
            This is the email you use to sign in. Changing it requires a
            one-time verification code.
          </p>
        </div>

        <div className="mt-6 flex items-center gap-5">
          <button
            type="submit"
            className="h-11 rounded-full bg-[#f72568] px-7 text-[12px] font-medium text-white"
          >
            Save details
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="text-[12px] text-[#f72568]"
          >
            Cancel
          </button>
        </div>
        <p
          role="status"
          className="mt-3 min-h-[16px] text-[11px] text-[#5b6a46]"
        >
          {saved && "Your details have been saved."}
        </p>
      </form>
    </AccountLayout>
  );
}
