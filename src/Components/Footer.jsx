import { useState } from "react";
import logo from "../assets/logo.png";

const columns = [
  {
    title: "SHOP",
    links: [
      { label: "Women", href: "#women" },
      { label: "Men", href: "#men" },
      { label: "Kids", href: "#kids" },
      { label: "New arrivals", href: "#new" },
    ],
  },
  {
    title: "HELP",
    links: [
      { label: "Your bag", href: "/cart" },
      { label: "Delivery & returns", href: "/delivery-returns" },
      { label: "Size guide", href: "#size-guide" },
    ],
  },
  {
    title: "BRAND",
    links: [
      { label: "Our story", href: "/our-story" },
      { label: "Materials", href: "#materials" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [openColumn, setOpenColumn] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email.trim()) return;

    console.log("Newsletter email:", email);
    setEmail("");
  };

  return (
    <footer className="bg-[#21131C]  px-5 py-10 text-[#F7F4EF] sm:px-8 sm:py-12 lg:px-[7.7%] lg:pt-14">
      {/* Footer Content */}
      <div className="mt-0 grid grid-cols-1 gap-y-7 sm:mt-0 sm:grid-cols-4 sm:gap-6 lg:mt-0 lg:grid-cols-[1.7fr_0.8fr_0.8fr_0.7fr] lg:gap-8">
        {" "}
        {/* Brand */}
        <div className="col-span-1">
          <a
            href="/"
            aria-label="Home"
            className="inline-flex mt-2 items-center justify-start transition-opacity duration-300 hover:opacity-80"
          >
            <img
              src={logo}
              alt="Nesel Logo"
              className="h-auto w-[145px] max-w-full object-contain sm:w-[165px]"
            />
          </a>
          <h3 className="mt-4 text-lg sm:mt-5 sm:text-xl lg:text-2xl">
            Woven for everyone.
          </h3>

          <p className="mt-3 max-w-sm text-xs leading-6 text-[#BDB9B5] sm:text-sm">
            Everyday clothes, thoughtfully made for every body.
          </p>
        </div>
        {/* Footer Links */}
        {columns.map((column) => {
          const isOpen = openColumn === column.title;

          return (
            <div
              key={column.title}
              className="border-b border-[#55514D] pb-4 sm:border-0 sm:pb-0"
            >
              <button
                type="button"
                onClick={() => setOpenColumn(isOpen ? null : column.title)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between text-left sm:cursor-default"
              >
                <h4 className="text-[10px] font-semibold tracking-[0.15em] sm:text-[11px]">
                  {column.title}
                </h4>

                <span
                  aria-hidden="true"
                  className="text-lg leading-none sm:hidden"
                >
                  {isOpen ? "−" : "+"}
                </span>
              </button>

              <ul
                className={`grid transition-all duration-300 sm:mt-5 sm:grid-rows-[1fr] sm:opacity-100 ${
                  isOpen
                    ? "mt-4 grid-rows-[1fr] opacity-100"
                    : "mt-0 grid-rows-[0fr] opacity-0 sm:mt-5"
                }`}
              >
                <li className="overflow-hidden">
                  <ul className="space-y-3">
                    {column.links.map((link) => (
                      <li key={link.label}>
                        <a
                          href={link.href}
                          className="text-xs text-[#BDB9B5] transition-colors duration-200 hover:text-white sm:text-sm"
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
              </ul>
            </div>
          );
        })}
      </div>

      {/* Bottom Bar */}
      <div className="mt-10 border-t border-[#55514D] pt-5 sm:mt-14 lg:mt-[65px]">
        <p className="text-[10px] text-[#A9A5A1] sm:text-[11px]">
          © {new Date().getFullYear()} nesel. Made with care in Egypt.
        </p>
      </div>
    </footer>
  );
}
