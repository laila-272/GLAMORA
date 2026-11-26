import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Heart, Search as SearchIcon } from "lucide-react";

import { getProducts } from "../Services/productService.js";
import { useAccount } from "../Context/AccountContext";
import { egp } from "../Context/CartContext";
import "../Styles/Home.css";

const SUGGESTIONS = [
  "evening scents",
  "floral perfumes",
  "oud",
  "gift sets",
  "perfumes for her",
  "fresh citrus",
  "warm woods",
];

const EMPTY_SUGGESTIONS = ["Oud", "Floral", "Musk"];

const STOPWORDS = new Set([
  "scent",
  "scents",
  "perfume",
  "perfumes",
  "fragrance",
  "fragrances",
  "for",
  "the",
  "a",
  "and",
  "of",
]);

const ALIASES = {
  her: ["women"],
  him: ["men"],
  his: ["men"],
  man: ["men"],
  woman: ["women"],
  evening: ["oriental", "woody"],
  warm: ["woody", "oriental"],
  woods: ["woody"],
  citrus: ["fresh"],
  spicy: ["oriental"],
};

const norm = (value) =>
  String(value || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’']/g, "");

function getProductImage(product) {
  const images = product.images || [];

  return (
    images.find((image) => image.is_active && image.purpose === "main") ||
    images.find((image) => image.is_active) ||
    images[0]
  );
}

function getProductPrice(product) {
  return Number(product.sale_price ?? product.original_price);
}

function haystack(product) {
  const image = getProductImage(product);

  const text = norm(
    [
      product.name,
      product.brand?.name,
      product.notes,
      product.type,
      product.family?.name,
      product.family?.description,
      product.brand?.description,
      product.size,
    ]
      .filter(Boolean)
      .join(" "),
  );

  return {
    text,
    words: new Set(text.split(/[^a-z0-9]+/).filter(Boolean)),
  };
}

export function searchProducts(query, products = []) {
  const tokens = norm(query)
    .split(/[^a-z0-9]+/)
    .filter((token) => token && !STOPWORDS.has(token));

  if (!tokens.length) return [];

  return products.filter((product) => {
    const { text, words } = haystack(product);

    return tokens.every((token) =>
      ALIASES[token]
        ? ALIASES[token].some((alias) => words.has(alias))
        : text.includes(token),
    );
  });
}

function ProductCard({ product }) {
  const { isSaved, toggleSaved } = useAccount();

  const liked = isSaved(product.id);
  const image = getProductImage(product);

  return (
    <article className="relative">
      <button
        type="button"
        onClick={() => toggleSaved(product.id)}
        aria-pressed={liked}
        aria-label={
          liked
            ? `Remove ${product.name} from saved scents`
            : `Save ${product.name}`
        }
        className="absolute right-0 top-0 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-[#fff0f4]"
      >
        <Heart
          size={13}
          className={liked ? "fill-[#f72568] text-[#f72568]" : "text-[#f72568]"}
        />
      </button>

      <Link to={`/product/${product.id}`} className="block">
        <div className="flex h-[260px] items-end justify-center px-4 pt-8 md:h-[340px]">
          {image?.path ? (
            <img
              src={image.path}
              alt={image.alt_text || product.name}
              className="max-h-full max-w-full object-contain"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[#f8f5f6] text-[11px] text-[#888087]">
              Image unavailable
            </div>
          )}
        </div>

        <h3 className="mt-4 font-serif text-[16px] font-semibold leading-tight">
          {product.name}
        </h3>

        <p className="mt-1.5 text-[10px] text-[#888087]">
          {product.brand?.name}
          {product.family?.name && ` · ${product.family.name}`}
          {product.size && ` · ${product.size}`}
        </p>

        <p className="mt-2 text-[12px] font-semibold">
          {egp(getProductPrice(product))}
        </p>
      </Link>
    </article>
  );
}

function SearchEmptyState({ query, onSearch }) {
  return (
    <div className="flex flex-col items-center px-4 pb-10 pt-4 text-center">
      <div className="relative flex h-[114px] w-[114px] items-center justify-center rounded-full bg-[#fff6f9]">
        <SearchIcon size={58} strokeWidth={1.7} className="text-[#a99da3]" />

        <span className="absolute left-[43px] top-[49px] h-[4px] w-[17px] rounded-full bg-[#f72568]" />
      </div>

      <h2 className="mt-2 font-serif text-[20px] font-medium text-[#30252c]">
        No scents found this time.
      </h2>

      <p className="mt-2 max-w-[340px] text-[11px] leading-[1.7] text-[#777078]">
        We couldn't find a match for "{query}".
        <br />
        Try another fragrance name, brand or scent note.
      </p>

      <Link
        to="/shop"
        className="mt-4 inline-flex h-[36px] min-w-[136px] items-center justify-center rounded-full bg-[#f72568] px-6 text-[11px] font-medium text-white transition-colors hover:bg-[#df1758]"
      >
        Browse all fragrances
      </Link>

      <div className="mt-[46px] flex flex-wrap justify-center gap-2">
        {EMPTY_SUGGESTIONS.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => onSearch(suggestion)}
            className="flex h-[22px] min-w-[73px] items-center justify-center rounded-full bg-[#fff6f9] px-4 text-[9px] text-[#51464e] transition-colors hover:bg-[#ffeaf1]"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function Search() {
  const [params, setParams] = useSearchParams();

  const query = (params.get("q") || "").trim();

  const [input, setInput] = useState(query);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getProducts();

        if (active) {
          setProducts(data);
        }
      } catch (err) {
        console.error("Failed to fetch search products:", err);

        if (active) {
          setError("Unable to load products. Please try again.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    setInput(query);
  }, [query]);

  const run = (value) => {
    setInput(value);

    const trimmed = value.trim();

    setParams(trimmed ? { q: trimmed } : {}, {
      replace: true,
    });
  };

  const clear = () => run("");

  const results = useMemo(
    () => (query ? searchProducts(query, products) : []),
    [query, products],
  );

  const recommended = useMemo(() => products.slice(0, 3), [products]);

  const searching = query.length > 0;

  const shown = searching ? results : recommended;

  return (
    <main className="mx-auto max-w-[1240px] px-4 pb-20 pt-6 text-[#292329] md:px-6">
      <nav className="text-[10px] text-[#6d656c]" aria-label="Breadcrumb">
        <Link to="/" className="hover:underline">
          Home
        </Link>{" "}
        / <span>Search</span>
      </nav>

      <header className="mt-3">
        <h1 className="font-serif text-[28px] font-medium leading-tight md:text-[38px]">
          {searching ? "Search results" : "Find your signature."}
        </h1>

        {!searching && (
          <p className="mt-2 text-[12px]">
            A soft floral. A warm oud. A fragrance that feels like you.
          </p>
        )}
      </header>

      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          run(input);
        }}
        className="mt-3 flex h-[40px] border border-[#e8e4e6]"
      >
        <label htmlFor="site-search" className="sr-only">
          Search perfumes
        </label>

        <input
          id="site-search"
          type="search"
          value={input}
          onChange={(e) => run(e.target.value)}
          placeholder={'Try "rose", "oud" or "musk"'}
          autoComplete="off"
          className="h-full min-w-0 flex-1 bg-white px-3 text-[11px] outline-none placeholder:text-[#8a8388]"
        />

        <button
          type="submit"
          aria-label="Search"
          className="flex h-full w-[40px] shrink-0 items-center justify-center bg-[#f72568] text-white"
        >
          <SearchIcon size={14} />
        </button>
      </form>

      {!searching && (
        <section className="mt-4" aria-labelledby="discovery-title">
          <h2 id="discovery-title" className="text-[10px] font-semibold">
            Search Discovery
          </h2>

          <ul className="mt-3 flex flex-wrap gap-2">
            {SUGGESTIONS.map((suggestion) => (
              <li key={suggestion}>
                <button
                  type="button"
                  onClick={() => run(suggestion)}
                  className="bg-[#f3f1f2] px-3 py-1.5 text-[9px] text-[#4a424a] hover:bg-[#ece8ea]"
                >
                  {suggestion}
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className={searching ? "mt-3" : "mt-10"} aria-live="polite">
        {loading ? (
          <p className="py-12 text-center text-[12px] text-[#777078]">
            Loading fragrances...
          </p>
        ) : error ? (
          <p className="py-12 text-center text-[12px] text-red-500">{error}</p>
        ) : searching ? (
          <>
            <div className="flex items-center justify-between gap-3">
              <p className="text-[10px] text-[#6d656c]">
                {results.length} {results.length === 1 ? "result" : "results"}{" "}
                for "{query}"
              </p>

              <button
                type="button"
                onClick={clear}
                className="text-[10px] text-[#f72568] underline underline-offset-2"
              >
                Clear search
              </button>
            </div>

            {results.length === 0 ? (
              <SearchEmptyState query={query} onSearch={run} />
            ) : (
              <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3">
                {shown.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
              <div>
                <h2 className="font-serif text-[28px] font-semibold leading-tight md:text-[32px]">
                  A good place to start.
                </h2>

                <p className="mt-2 text-[11px] text-[#6d656c]">
                  Fragrant favourites, thoughtfully chosen. A little inspiration
                  while you look.
                </p>
              </div>

              <Link
                to="/shop"
                className="text-[11px] text-[#f72568] underline underline-offset-2"
              >
                Shop all →
              </Link>
            </div>

            {recommended.length === 0 ? (
              <p className="py-12 text-center text-[12px] text-[#777078]">
                No fragrances available right now.
              </p>
            ) : (
              <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3">
                {recommended.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}
