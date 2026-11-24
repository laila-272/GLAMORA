import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { useAccount } from "../../Context/AccountContext";

// Link targets for the "You might find it here." card. Only the routes marked ✓ exist in the app today;
// change the others here once those pages exist.
const HELP_LINKS = [
  // { label: "Help & scent guide", to: "/delivery-returns" }, // placeholder: no scent-guide page yet
  { label: "Delivery & returns", to: "/delivery-returns" }, // ✓
  // { label: "Notes & care", to: "/shop" }, // placeholder: no notes & care page yet
  { label: "My orders", to: "/account/orders" }, // ✓
];
const TOPICS = [
  "Scent advice",
  "Delivery & returns",
  "Product care",
  "Account",
  "Other",
];

const field =
  "h-11 w-full rounded-xl border border-[#eae7e9] bg-white px-4 text-[12px] text-[#292329] outline-none placeholder:text-[#b9b3b8] focus:border-[#f72568]";
const label = "mb-2 block text-[10px] font-medium";

export default function Contact() {
  const { profile } = useAccount();
  const [form, setForm] = useState({
    name: `${profile.firstName} ${profile.lastName}`.trim(),
    email: profile.email,
    topic: "",
    order: "",
    message: "",
  });
  const [messageError, setMessageError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const change = (e) => {
    setSubmitted(false);
    if (e.target.name === "message") setMessageError("");
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  // Native validation handles required fields and the email format before this runs.
  const submit = (e) => {
    e.preventDefault();
    if (!form.message.trim()) {
      setMessageError("Please tell us a little more.");
      return;
    }
    // No backend/endpoint exists yet: this is a demo submission and nothing is sent.
    setSubmitted(true);
    setForm((f) => ({ ...f, topic: "", order: "", message: "" }));
  };

  return (
    <main className="mx-auto max-w-[1240px] px-4 pb-20 pt-6 text-[#292329] md:px-6">
      <nav className="text-[10px] text-[#6d656c]" aria-label="Breadcrumb">
        <Link to="/" className="hover:underline">
          Home
        </Link>{" "}
        /{" "}
        <Link to="/delivery-returns" className="hover:underline">
          Help
        </Link>{" "}
        / <span>Contact</span>
      </nav>

      <header className="mt-3">
        <h1 className="font-serif text-[40px] font-medium leading-none md:text-[52px]">
          Need a hand?
        </h1>
        <p className="mt-5 text-[12px] text-[#6d656c]">
          Ask about a scent, your delivery or a return. Tell us a little more.
        </p>
      </header>

      <div className="mt-8 grid gap-10 lg:grid-cols-[300px_1fr] lg:gap-12">
        <aside>
          <h2 className="font-serif text-[24px] font-medium leading-tight">
            A little help, thoughtfully.
          </h2>
          <p className="mt-4 text-[12px] leading-[1.6] text-[#4a424a]">
            Include your order reference if your question is about a purchase.
            For a question about a scent, share its name and volume.
          </p>

          <section
            className="mt-6 rounded-3xl bg-[#fff5f8] p-6"
            aria-labelledby="find-title"
          >
            <h3
              id="find-title"
              className="font-serif text-[18px] font-medium leading-tight"
            >
              You might find it here.
            </h3>
            <ul className="mt-4 space-y-3.5">
              {HELP_LINKS.map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.to}
                    className="text-[10px] text-[#f72568] underline underline-offset-2"
                  >
                    {l.label} →
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <p className="mt-5 text-[9px] leading-[1.5] text-[#6d656c]">
            Contact form. Submission routing and response times are not
            established here.
          </p>
        </aside>

        <form onSubmit={submit} noValidate={false}>
          <p className="text-[9px] text-[#6d656c]">* Required fields</p>

          <div className="mt-4 grid gap-x-3 gap-y-4 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className={label}>
                Your name *
              </label>
              <input
                id="name"
                name="name"
                required
                autoComplete="name"
                value={form.name}
                onChange={change}
                className={field}
              />
            </div>
            <div>
              <label htmlFor="email" className={label}>
                Email address *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                value={form.email}
                onChange={change}
                className={field}
              />
            </div>
            <div>
              <label htmlFor="topic" className={label}>
                What can we help with? *
              </label>
              <div className="relative">
                <select
                  id="topic"
                  name="topic"
                  required
                  value={form.topic}
                  onChange={change}
                  className={`${field} appearance-none pr-9 ${form.topic ? "" : "text-[#b9b3b8]"}`}
                >
                  <option value="" disabled>
                    Choose a topic
                  </option>
                  {TOPICS.map((t) => (
                    <option key={t} value={t} className="text-[#292329]">
                      {t}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={13}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#8a7a7d]"
                />
              </div>
            </div>
            <div>
              <label htmlFor="order" className={label}>
                Order reference (optional)
              </label>
              <input
                id="order"
                name="order"
                placeholder="GLAMORA-1940"
                value={form.order}
                onChange={change}
                className={field}
              />
            </div>
          </div>

          <p className="mt-4 text-[9px] text-[#6d656c]">
            Topics: {TOPICS.join(" · ")}
          </p>

          <div className="mt-4">
            <label htmlFor="message" className={label}>
              Your message *
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={5}
              value={form.message}
              onChange={change}
              aria-invalid={!!messageError}
              aria-describedby={messageError ? "message-error" : undefined}
              placeholder="I’d like some guidance on returning Dior J’adore from my order. I ordered a different bottle volume than intended."
              className={`${field} h-auto min-h-[100px] resize-y py-3 leading-[1.5]`}
            />
            <p
              id="message-error"
              role="alert"
              className="mt-1 min-h-[14px] text-[10px] text-[#f72568]"
            >
              {messageError}
            </p>
          </div>

          <p className="text-[9px] text-[#6d656c]">
            Please do not include payment card details or verification codes.
          </p>

          <button
            type="submit"
            className="mt-4 h-10 w-full rounded-full bg-[#f72568] text-[12px] font-medium text-white"
          >
            Send message
          </button>

          <p
            role="status"
            className="mt-3 min-h-[16px] text-[11px] text-[#5b6a46]"
          >
            {submitted &&
              "Thank you — your message passed our checks, but this is a demo form and nothing was sent. Real delivery needs a backend endpoint."}
          </p>

          <p className="mt-2 border-t border-[#eae7e9] pt-3 text-[9px] leading-[1.5] text-[#6d656c]">
            Your supplied email is the contact detail for this question. No
            brand email address or phone number is assumed.
          </p>
        </form>
      </div>
    </main>
  );
}
