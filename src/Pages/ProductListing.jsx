import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ChevronDown, SlidersHorizontal } from "lucide-react";
import { brands } from "../data/Brands.js";
import { useAccount } from "../Context/AccountContext";
import womenImg from "../assets/e/01/women.png";
import menImg from "../assets/e/01/men.png";
import unisexImg from "../assets/e/01/uni.png";
import newImg from "../assets/e/01/new.png";
import giftImg from "../assets/e/01/gift.png";
const FAMILIES = ["Floral", "Woody", "Oriental", "Fresh"];
const MAX_PRICE = 2000;
const egp = (n) => `EGP ${n.toLocaleString("en-US")}`;

function Select({ label, value, onChange, options, allLabel }) {
  return (
    <div className="mt-5">
      <label className="mb-1.5 block text-[10px] font-medium">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 w-full appearance-none rounded-full border border-[#ece3e6] bg-white pl-4 pr-8 text-[10px] text-[#3a2a2d] outline-none"
        >
          <option value="">{allLabel}</option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={12}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#8a7a7d]"
        />
      </div>
    </div>
  );
}

/**
 * Shared catalog layout (header + filters + sort + grid) used by /shop and /brands/:brandName.
 * crumbs: [{ label, to? }]   items: products to list   showBrand: adds the Brand dropdown
 * productHref(p): optional link target for a product card (cards are plain if omitted)
 */
export default function ProductListing({
  crumbs,
  title,
  subtitle,
  items,
  showBrand = false,
  initialGender = "",
  productHref,
}) {
  const [brand, setBrand] = useState("");
  const [gender, setGender] = useState(initialGender);
  const [size, setSize] = useState("");
  const [conc, setConc] = useState("");
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE);
  const [families, setFamilies] = useState([]);
  const [sort, setSort] = useState("featured");
  const { isSaved, toggleSaved } = useAccount();
  const [showFilters, setShowFilters] = useState(false);

  const uniq = (key) => [...new Set(items.map((p) => p[key]))];

  const shown = useMemo(() => {
    const list = items.filter(
      (p) =>
        (!brand || p.brand === brand) &&
        (!gender || p.gender === gender) &&
        (!size || String(p.size) === size) &&
        (!conc || p.concentration === conc) &&
        p.price <= maxPrice &&
        (!families.length || families.includes(p.family)),
    );
    const sorted = [...list];
    if (sort === "low") sorted.sort((a, b) => a.price - b.price);
    if (sort === "high") sorted.sort((a, b) => b.price - a.price);
    if (sort === "new") sorted.sort((a, b) => b.added - a.added);
    return sorted;
  }, [items, brand, gender, size, conc, maxPrice, families, sort]);

  const clear = () => {
    setBrand("");
    setGender("");
    setSize("");
    setConc("");
    setMaxPrice(MAX_PRICE);
    setFamilies([]);
  };
  const toggleFamily = (f) =>
    setFamilies((cur) =>
      cur.includes(f) ? cur.filter((x) => x !== f) : [...cur, f],
    );

  const filters = (
    <div>
      {showBrand && (
        <Select
          label="Brand"
          value={brand}
          onChange={setBrand}
          allLabel="All brands"
          options={brands.map((b) => ({ value: b.slug, label: b.name }))}
        />
      )}
      <Select
        label="Gender"
        value={gender}
        onChange={setGender}
        allLabel="All genders"
        options={uniq("gender").map((v) => ({ value: v, label: v }))}
      />

      <div className="mt-5">
        <span className="mb-1.5 block text-[10px] font-medium">Price</span>
        <div className="flex h-9 items-center gap-2 rounded-full border border-[#ece3e6] bg-white px-3 text-[9px] text-[#5a4a4d]">
          <span className="whitespace-nowrap">EGP 0</span>
          <input
            type="range"
            min={0}
            max={MAX_PRICE}
            step={50}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            aria-label="Maximum price"
            className="h-1 min-w-0 flex-1 accent-[#f4256b]"
          />
          <span className="whitespace-nowrap">{egp(maxPrice)}</span>
        </div>
      </div>

      <Select
        label="Size"
        value={size}
        onChange={setSize}
        allLabel="All sizes"
        options={uniq("size")
          .sort((a, b) => a - b)
          .map((v) => ({ value: String(v), label: `${v}ml` }))}
      />
      <Select
        label="Concentration"
        value={conc}
        onChange={setConc}
        allLabel="All concentrations"
        options={uniq("concentration").map((v) => ({ value: v, label: v }))}
      />

      <div className="mt-5">
        <span className="mb-1.5 block text-[10px] font-medium">
          Scent family
        </span>
        <div className="grid grid-cols-2 gap-x-2 gap-y-2">
          {FAMILIES.map((f) => {
            const on = families.includes(f);
            return (
              <button
                key={f}
                type="button"
                onClick={() => toggleFamily(f)}
                aria-pressed={on}
                className={`h-7 rounded-full border text-[9px] ${on ? "border-[#f4256b] bg-[#fde4ee] text-[#f4256b]" : "border-[#ece3e6] bg-white text-[#3a2a2d]"}`}
              >
                {f}
              </button>
            );
          })}
        </div>
      </div>

      <button
        type="button"
        onClick={clear}
        className="mt-6 text-[10px] underline underline-offset-2"
      >
        Clear filters
      </button>
    </div>
  );

  return (
    <main className="mx-auto max-w-[1240px] px-4 pb-16 pt-3 text-[#1f1416] md:px-6">
      <nav className="text-[10px] text-[#5a4a4d]" aria-label="Breadcrumb">
        {crumbs.map((c, i) => (
          <span key={c.label}>
            {i > 0 && " / "}
            {c.to ? (
              <Link to={c.to} className="hover:underline">
                {c.label}
              </Link>
            ) : (
              c.label
            )}
          </span>
        ))}
      </nav>

      <header className="mt-6">
        <h1 className="font-serif text-[40px] font-medium leading-none md:text-[48px]">
          {title}
        </h1>
        <div className="mt-4 flex items-end justify-between gap-4">
          <p className="text-[13px]">{subtitle}</p>
          <span className="shrink-0 text-[10px] font-medium uppercase tracking-wide">
            {shown.length} {shown.length === 1 ? "item" : "items"}
          </span>
        </div>
      </header>

      <div className="mt-8 grid gap-6 lg:grid-cols-[190px_1fr] lg:gap-10">
        <aside>
          <div className="flex items-center justify-between">
            <h2 className="text-[17px] font-medium">Filter</h2>
            <button
              type="button"
              onClick={() => setShowFilters((s) => !s)}
              className="flex items-center gap-1 text-[11px] lg:hidden"
              aria-expanded={showFilters}
            >
              <SlidersHorizontal size={13} /> {showFilters ? "Hide" : "Show"}
            </button>
          </div>
          <div className={`${showFilters ? "block" : "hidden"} lg:block`}>
            {filters}
          </div>
        </aside>

        <section>
          <div className="flex items-center justify-end gap-3 text-[11px]">
            <label htmlFor="sort" className="font-medium">
              Sort by
            </label>
            <div className="relative">
              <select
                id="sort"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="h-9 appearance-none rounded-full border border-[#ece3e6] bg-white pl-4 pr-8 text-[11px] outline-none"
              >
                <option value="featured">Featured</option>
                <option value="low">Price: Low to High</option>
                <option value="high">Price: High to Low</option>
                <option value="new">Newest</option>
              </select>
              <ChevronDown
                size={12}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#8a7a7d]"
              />
            </div>
          </div>

          {shown.length === 0 ? (
            <p className="py-16 text-center text-[13px] text-[#5a4a4d]">
              No fragrances match these filters.{" "}
              <button type="button" onClick={clear} className="underline">
                Clear filters
              </button>
            </p>
          ) : (
            <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3">
              {shown.map((p) => {
                const liked = isSaved(p.id);
                const href = productHref?.(p);
                const body = (
                  <>
                    <div className="flex h-[210px] items-end justify-center px-4 pt-10 md:h-[250px]">
                      <img
                        src={p.img}
                        alt={p.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <h3 className="mt-3 font-serif text-[16px] font-semibold leading-tight">
                      {p.name}
                    </h3>
                    <p className="mt-1 text-[10px] text-[#8a7a7d]">
                      {p.brandName} · {p.note} · {p.size}ml
                    </p>
                    <p className="mt-1.5 text-[12px] font-semibold">
                      {egp(p.price)}
                    </p>
                  </>
                );
                return (
                  <article key={p.id} className="relative">
                    {p.isNew && (
                      <span className="absolute left-0 top-0 z-10 rounded-full border border-[#f4256b] bg-white px-2 py-0.5 text-[8px] font-medium text-[#f4256b]">
                        New
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => toggleSaved(p.id)}
                      aria-pressed={liked}
                      aria-label={
                        liked ? "Remove from wishlist" : "Add to wishlist"
                      }
                      className="absolute right-0 top-0 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-[#fff1f6]"
                    >
                      <Heart
                        size={13}
                        className={
                          liked
                            ? "fill-[#f4256b] text-[#f4256b]"
                            : "text-[#f4256b]"
                        }
                      />
                    </button>
                    {href ? (
                      <Link to={href} className="block">
                        {body}
                      </Link>
                    ) : (
                      body
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
