import { Link } from "react-router-dom";
// import "../Styles/Home.css";

const PLACES = [
  { label: "Women", to: "/shop?category=women" },
  { label: "Men", to: "/shop?category=men" },
  { label: "Unisex", to: "/shop?category=unisex" },
  { label: "Visit help →", to: "/delivery-returns" },
];

// Rendered by the catch-all route inside <Layout />, so Navbar and Footer come from the layout.
export default function NotFound() {
  return (
    <main className="mx-auto max-w-[1240px] px-4 pb-24 pt-6 text-[#292329] md:px-6">
      <nav className="text-[10px] text-[#6d656c]" aria-label="Breadcrumb">
        <Link to="/" className="hover:underline">
          Home
        </Link>{" "}
        / <span>Page not found</span>
      </nav>

      <div className="mt-16 max-w-[400px] md:mt-24">
        <p
          className="font-serif text-[96px] font-light leading-none text-[#f72568] md:text-[112px]"
          aria-label="Error 404"
        >
          404
        </p>
        <h1 className="mt-8 font-script text-[40px] leading-tight md:text-[46px]">
          A fleeting note.
        </h1>
        <p className="mt-6 text-[13px] leading-[1.6] text-[#5a525a]">
          We couldn’t find this page. It may have moved, or the address might
          need another look.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/"
            className="inline-flex h-10 items-center rounded-full bg-[#f72568] px-6 text-[12px] font-medium text-white"
          >
            Return home →
          </Link>
          <Link
            to="/shop"
            className="inline-flex h-10 items-center rounded-full border border-[#eae7e9] bg-white px-6 text-[12px] font-medium"
          >
            Shop all scents
          </Link>
        </div>

        <hr className="mt-7 border-[#eae7e9]" />
        <p className="mt-4 text-[10px] text-[#6d656c]">
          A few familiar places to find your way.
        </p>
        <ul className="mt-4 flex flex-wrap gap-5 text-[10px]">
          {PLACES.map((p) => (
            <li key={p.label}>
              <Link
                to={p.to}
                className="text-[#f72568] underline underline-offset-2"
              >
                {p.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
