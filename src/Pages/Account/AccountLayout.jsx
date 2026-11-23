import { Link, useNavigate } from "react-router-dom";
import { useAccount } from "../../Context/AccountContext.jsx";

const NAV = [
  { key: "overview", label: "Overview" }, // page not built yet → shown as disabled
  { key: "details", label: "Personal details", to: "/account" },
  { key: "orders", label: "My orders", to: "/account/orders" },
  { key: "addresses", label: "Address book", to: "/account/addresses" },
  { key: "saved", label: "Saved scents", to: "/account/saved" },
  { key: "prefs", label: "Preferences", to: "/account/preferences" },
];

/** Shared shell for all account pages: breadcrumb, heading, sidebar and content slot. */
export default function AccountLayout({ current, title, subtitle, children }) {
  const { fullName, profile, resetProfile } = useAccount();
  const navigate = useNavigate();

  const signOut = () => {
    resetProfile(); // demo only: no real session exists yet
    navigate("/");
  };

  return (
    <main className="mx-auto max-w-[1240px] px-4 pb-20 pt-6 text-[#292329] md:px-6">
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

      <header className="mt-4 border-b border-[#eae7e9] pb-5">
        <h1 className="font-serif text-[40px] font-medium leading-none md:text-[52px]">
          {title}
        </h1>
        <p className="mt-5 text-[13px] text-[#6d656c]">{subtitle}</p>
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-[200px_1fr] lg:gap-10">
        <aside>
          <p className="font-serif text-[20px] font-medium leading-tight">
            {fullName}
          </p>
          <p className="mt-2 break-all text-[9px] text-[#6d656c]">
            {profile.email}
          </p>

          <nav
            aria-label="Account"
            className="mt-6 flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible"
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
                  className={`${base} ${active ? "border-[#f72568] bg-[#fff5f8] font-medium text-[#f72568]" : "border-transparent hover:text-[#f72568]"}`}
                >
                  {n.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-3 border-t border-[#eae7e9] pt-3 text-[10px]">
            <button
              type="button"
              onClick={signOut}
              className="text-[#f72568] underline underline-offset-2"
            >
              Sign out
            </button>
            <p className="mt-3 text-[#6d656c]">Need a hand?</p>
            <Link
              to="/delivery-returns"
              className="mt-2 inline-block text-[#f72568] underline underline-offset-2"
            >
              Visit help →
            </Link>
          </div>
        </aside>

        <section>{children}</section>
      </div>
    </main>
  );
}
