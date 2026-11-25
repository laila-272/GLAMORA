import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAccount } from "../../Context/AccountContext.jsx";
import { useAuth } from "../../Context/AuthContext.jsx";

const NAV = [
  { key: "overview", label: "Overview" },
  { key: "details", label: "Personal details", to: "/account" },
  { key: "orders", label: "My orders", to: "/account/orders" },
  { key: "addresses", label: "Address book", to: "/account/addresses" },
  { key: "saved", label: "Saved scents", to: "/account/saved" },
  { key: "prefs", label: "Preferences", to: "/account/preferences" },
];

export default function AccountLayout({ current, title, subtitle, children }) {
  const { fullName, profile } = useAccount();
  const { signOut } = useAuth();

  const navigate = useNavigate();
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async () => {
    if (signingOut) return;

    setSigningOut(true);

    try {
      await signOut();
      navigate("/", { replace: true });
    } finally {
      setSigningOut(false);
    }
  };

  const handleNavigation = (e) => {
    const selected = NAV.find((item) => item.key === e.target.value);

    if (selected?.to) {
      navigate(selected.to);
    }
  };

  return (
    <main className="mx-auto max-w-[1240px] px-4 pb-14 pt-5 text-[#292329] sm:px-6 md:pb-20 md:pt-6">
      {/* Breadcrumb */}
      <nav className="text-[10px] text-[#6d656c]" aria-label="Breadcrumb">
        <Link to="/" className="hover:underline">
          Home
        </Link>{" "}
        /{" "}
        <Link to="/account" className="hover:underline">
          My account
        </Link>{" "}
        / <span>{title}</span>
      </nav>

      {/* Header */}
      <header className="mt-4 border-b border-[#eae7e9] pb-4 sm:pb-5">
        <h1 className="font-serif text-[34px] font-medium leading-tight sm:text-[40px] md:text-[52px]">
          {title}
        </h1>

        <p className="mt-3 text-[12px] text-[#6d656c] sm:mt-5 sm:text-[13px]">
          {subtitle}
        </p>
      </header>

      <div className="mt-5 grid min-w-0 gap-5 lg:mt-8 lg:grid-cols-[200px_1fr] lg:gap-10">
        {/* Sidebar */}
        <aside className="min-w-0">
          {/* User Info */}
          <div>
            <p className="truncate font-serif text-[18px] font-medium leading-tight lg:text-[20px]">
              {fullName}
            </p>

            <p className="mt-1 break-all text-[9px] text-[#6d656c]">
              {profile.email}
            </p>
          </div>

          {/* Mobile Dropdown */}
          <div className="relative mt-4 lg:hidden">
            <label htmlFor="account-navigation" className="sr-only">
              Account navigation
            </label>

            <select
              id="account-navigation"
              value={current}
              onChange={handleNavigation}
              className="h-11 w-full appearance-none rounded-xl border border-[#eae7e9] bg-[#fff5f8] px-4 pr-10 text-[11px] text-[#292329] outline-none focus:border-[#f72568]"
            >
              {NAV.map((item) => (
                <option key={item.key} value={item.key} disabled={!item.to}>
                  {item.label}
                </option>
              ))}
            </select>

            <svg
              className="pointer-events-none absolute right-4 top-1/2 h-3 w-3 -translate-y-1/2 text-[#6d656c]"
              viewBox="0 0 12 12"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M2 4L6 8L10 4"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Desktop Navigation */}
          <nav
            aria-label="Account"
            className="mt-6 hidden lg:flex lg:flex-col lg:gap-1"
          >
            {NAV.map((n) => {
              const base =
                "block whitespace-nowrap border-l-2 px-3 py-2.5 text-[11px]";

              if (!n.to) {
                return (
                  <span
                    key={n.key}
                    aria-disabled="true"
                    title="Coming soon"
                    className={`${base} cursor-not-allowed border-transparent text-[#a9a2a8]`}
                  >
                    {n.label}
                  </span>
                );
              }

              const active = n.key === current;

              return (
                <Link
                  key={n.key}
                  to={n.to}
                  aria-current={active ? "page" : undefined}
                  className={`${base} ${
                    active
                      ? "border-[#f72568] bg-[#fff5f8] font-medium text-[#f72568]"
                      : "border-transparent hover:text-[#f72568]"
                  }`}
                >
                  {n.label}
                </Link>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="mt-3 flex items-center justify-between gap-3 border-t border-[#eae7e9] pt-3 text-[10px] lg:block">
            <button
              type="button"
              onClick={handleSignOut}
              disabled={signingOut}
              className="shrink-0 text-[#f72568] underline underline-offset-2 disabled:opacity-50"
            >
              {signingOut ? "Signing out..." : "Sign out"}
            </button>

            <div className="flex items-center gap-2 lg:mt-3 lg:block">
              <p className="text-[#6d656c]">Need a hand?</p>

              <Link
                to="/delivery-returns"
                className="whitespace-nowrap text-[#f72568] underline underline-offset-2 lg:mt-2 lg:inline-block"
              >
                Visit help →
              </Link>
            </div>
          </div>
        </aside>

        {/* Page Content */}
        <section className="min-w-0">{children}</section>
      </div>
    </main>
  );
}
