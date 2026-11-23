import { Link } from "react-router-dom";
import { brands, countFor } from "../data/Brands.js";
import "../index.css";

export default function Brands() {
  return (
    <main className="mx-auto max-w-[1240px] px-4 pb-16 pt-3 text-[#1f1416] md:px-6">
      <nav className="text-[10px] text-[#5a4a4d]" aria-label="Breadcrumb">
        <Link to="/" className="hover:underline">
          Home
        </Link>{" "}
        / <span>Brands</span>
      </nav>

      <header className="mt-5">
        <h1 className="font-serif text-[40px] font-medium leading-none md:text-[48px]">
          Brands
        </h1>
        <div className="mt-3 flex items-end justify-between gap-4">
          <p className="text-[13px]">
            Find your favourite fragrance house. Explore our brands, A–Z.
          </p>
          <span className="shrink-0 text-[10px] font-medium uppercase tracking-wide">
            {brands.length} Brands
          </span>
        </div>
      </header>

      <section className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {brands.map((b) => {
          const n = countFor(b.slug);
          return (
            <Link
              key={b.slug}
              to={`/brands/${b.slug}`}
              className="rounded-2xl border border-[#efe5e8] bg-white p-3"
            >
              <img
                src={b.image}
                alt={b.name}
                className="aspect-[3/2] w-full rounded-lg object-cover"
              />
              <h2 className="mt-4 font-serif text-[22px] font-medium leading-tight">
                {b.name}
              </h2>
              <div className="mt-4 flex items-center justify-between text-[10px]">
                <span className="text-[#3a2a2d]">
                  {n} {n === 1 ? "fragrance" : "fragrances"}
                </span>
                <span className="text-[#f4256b]">Shop brand →</span>
              </div>
            </Link>
          );
        })}
      </section>
    </main>
  );
}
