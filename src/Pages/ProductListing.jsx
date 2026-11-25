import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ChevronDown, SlidersHorizontal } from "lucide-react";
import { useAccount } from "../Context/AccountContext";

const MAX_PRICE = 2000;

const getPrice = (product) =>
  Number(product.sale_price ?? product.original_price);

const egp = (n) => `EGP ${Number(n).toLocaleString("en-US")}`;

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

          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
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

export default function ProductListing({
  crumbs,
  title,
  subtitle,
  items = [],
  showBrand = false,
  initialGender = "",
  productHref,
}) {
  const [brand, setBrand] = useState("");
  const [gender, setGender] = useState(initialGender);
  const [size, setSize] = useState("");
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE);
  const [families, setFamilies] = useState([]);
  const [sort, setSort] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);

  const { isSaved, toggleSaved } = useAccount();

  // Brands from the actual API response.
  const brandOptions = useMemo(() => {
    const uniqueBrands = new Map();

    items.forEach((product) => {
      if (product.brand) {
        uniqueBrands.set(product.brand_id, {
          value: String(product.brand_id),
          label: product.brand.name,
        });
      }
    });

    return [...uniqueBrands.values()];
  }, [items]);

  // Genders from the actual API response.
  const genderOptions = useMemo(
    () =>
      [...new Set(items.map((product) => product.type).filter(Boolean))].map(
        (value) => ({
          value,
          label: value,
        }),
      ),
    [items],
  );

  // Sizes from the actual API response.
  const sizeOptions = useMemo(() => {
    const uniqueSizes = [
      ...new Set(items.map((product) => product.size).filter(Boolean)),
    ];

    return uniqueSizes
      .sort((a, b) => parseFloat(a) - parseFloat(b))
      .map((value) => ({
        value,
        label: value,
      }));
  }, [items]);

  // Families from the actual API response.
  const familyOptions = useMemo(() => {
    const uniqueFamilies = new Map();

    items.forEach((product) => {
      if (product.family) {
        uniqueFamilies.set(product.family.id, {
          id: product.family.id,
          name: product.family.name,
        });
      }
    });

    return [...uniqueFamilies.values()];
  }, [items]);

  const shown = useMemo(() => {
    const list = items.filter(
      (product) =>
        (!brand || String(product.brand_id) === brand) &&
        (!gender || product.type === gender) &&
        (!size || product.size === size) &&
        getPrice(product) <= maxPrice &&
        (!families.length || families.includes(product.family?.id)),
    );

    const sorted = [...list];

    if (sort === "low") {
      sorted.sort((a, b) => getPrice(a) - getPrice(b));
    }

    if (sort === "high") {
      sorted.sort((a, b) => getPrice(b) - getPrice(a));
    }

    if (sort === "new") {
      sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    return sorted;
  }, [items, brand, gender, size, maxPrice, families, sort]);

  const clear = () => {
    setBrand("");
    setGender(initialGender);
    setSize("");
    setMaxPrice(MAX_PRICE);
    setFamilies([]);
    setSort("featured");
  };

  const toggleFamily = (familyId) => {
    setFamilies((current) =>
      current.includes(familyId)
        ? current.filter((id) => id !== familyId)
        : [...current, familyId],
    );
  };

  const filters = (
    <div>
      {showBrand && (
        <Select
          label="Brand"
          value={brand}
          onChange={setBrand}
          allLabel="All brands"
          options={brandOptions}
        />
      )}

      <Select
        label="Gender"
        value={gender}
        onChange={setGender}
        allLabel="All genders"
        options={genderOptions}
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
        options={sizeOptions}
      />

      <div className="mt-5">
        <span className="mb-1.5 block text-[10px] font-medium">
          Scent family
        </span>

        <div className="grid grid-cols-2 gap-x-2 gap-y-2">
          {familyOptions.map((family) => {
            const selected = families.includes(family.id);

            return (
              <button
                key={family.id}
                type="button"
                onClick={() => toggleFamily(family.id)}
                aria-pressed={selected}
                className={`h-7 rounded-full border text-[9px] ${
                  selected
                    ? "border-[#f4256b] bg-[#fde4ee] text-[#f4256b]"
                    : "border-[#ece3e6] bg-white text-[#3a2a2d]"
                }`}
              >
                {family.name}
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
        {crumbs.map((crumb, index) => (
          <span key={crumb.label}>
            {index > 0 && " / "}

            {crumb.to ? (
              <Link to={crumb.to} className="hover:underline">
                {crumb.label}
              </Link>
            ) : (
              crumb.label
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
              onClick={() => setShowFilters((current) => !current)}
              className="flex items-center gap-1 text-[11px] lg:hidden"
              aria-expanded={showFilters}
            >
              <SlidersHorizontal size={13} />
              {showFilters ? "Hide" : "Show"}
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
              {shown.map((product) => {
                const liked = isSaved(product.id);
                const href = productHref?.(product);

                const mainImage = product.images?.find(
                  (image) => image.is_active && image.purpose === "main",
                );

                const body = (
                  <>
                    <div className="flex h-[210px] items-end justify-center px-4 pt-10 md:h-[250px]">
                      {mainImage?.path && (
                        <img
                          src={mainImage.path}
                          alt={mainImage.alt_text ?? ""}
                          loading="lazy"
                          className="max-h-full max-w-full object-contain"
                        />
                      )}
                    </div>

                    <h3 className="mt-3 font-serif text-[16px] font-semibold leading-tight">
                      {product.name}
                    </h3>

                    <p className="mt-1 text-[10px] text-[#8a7a7d]">
                      {product.brand?.name}
                      {product.notes && ` · ${product.notes}`}
                      {product.size && ` · ${product.size}`}
                    </p>

                    <p className="mt-1.5 text-[12px] font-semibold">
                      {egp(getPrice(product))}
                    </p>
                  </>
                );

                return (
                  <article key={product.id} className="relative">
                    <button
                      type="button"
                      onClick={() => toggleSaved(product.id)}
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
