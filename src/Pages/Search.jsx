import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Heart, Search as SearchIcon } from "lucide-react";

import { allProducts } from "../data/Brands";
import { useAccount } from "../Context/AccountContext";
import { egp } from "../Context/CartContext";
import "../Styles/Home.css";

const SUGGESTIONS = [
  "evening scents",
  "floral perfumes",
  "tom ford oud wood",
  "gift sets",
  "perfumes for her",
  "fresh citrus",
  "warm woods",
];

const EMPTY_SUGGESTIONS = ["Dior", "Oud", "Floral"];

const RECOMMENDED_IDS = [8, 10, 9];

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
  men: ["men"],
  man: ["men"],
  women: ["women"],
  woman: ["women"],
  evening: ["oriental", "woody"],
  warm: ["woody", "oriental"],
  woods: ["woody"],
  citrus: ["fresh"],
  spicy: ["oriental"],
  amber: ["oriental", "amber"],
};

const norm = (s) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’']/g, "");

function haystack(p) {
  const text = norm(
    [
      p.name,
      p.brandName,
      p.note,
      p.family,
      p.gender,
      p.concentration,
      p.keyNotes,
      `${p.size}ml`,
    ]
      .filter(Boolean)
      .join(" "),
  );

  return {
    text,
    words: new Set(text.split(/[^a-z0-9]+/).filter(Boolean)),
  };
}

export function searchProducts(query, products = allProducts) {
  const tokens = norm(query)
    .split(/[^a-z0-9]+/)
    .filter((t) => t && !STOPWORDS.has(t));

  if (!tokens.length) return [];

  return products.filter((p) => {
    const { text, words } = haystack(p);

    return tokens.every((t) =>
      ALIASES[t] ? ALIASES[t].some((a) => words.has(a)) : text.includes(t),
    );
  });
}

function ProductCard({ product: p }) {
  const { isSaved, toggleSaved } = useAccount();
  const liked = isSaved(p.id);

  return (
    <article className="relative">
      <button
        type="button"
        onClick={() => toggleSaved(p.id)}
        aria-pressed={liked}
        aria-label={
          liked ? `Remove ${p.name} from saved scents` : `Save ${p.name}`
        }
        className="absolute right-0 top-0 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-[#fff0f4]"
      >
        <Heart
          size={13}
          className={liked ? "fill-[#f72568] text-[#f72568]" : "text-[#f72568]"}
        />
      </button>

      <Link to={`/product/${p.id}`} className="block">
        <div className="flex h-[260px] items-end justify-center px-4 pt-8 md:h-[340px]">
          <img
            src={p.img}
            alt={p.name}
            className="max-h-full max-w-full object-contain"
          />
        </div>

        <h3 className="mt-4 font-serif text-[16px] font-semibold leading-tight">
          {p.name}
        </h3>

        <p className="mt-1.5 text-[10px] text-[#888087]">
          {p.brandName} · {p.note} · {p.size}ml
        </p>

        <p className="mt-2 text-[12px] font-semibold">{egp(p.price)}</p>
      </Link>
    </article>
  );
}

// Search Empty State
function SearchEmptyState({ query, onSearch }) {
  return (
    <div className="flex flex-col items-center px-4 pb-10 pt-4 text-center">
      {/* Search Icon */}
      <div className="relative flex h-[114px] w-[114px] items-center justify-center rounded-full bg-[#fff6f9]">
        <SearchIcon size={58} strokeWidth={1.7} className="text-[#a99da3]" />

        <span className="absolute left-[43px] top-[49px] h-[4px] w-[17px] rounded-full bg-[#f72568]" />
      </div>

      {/* Heading */}
      <h2 className="mt-2 font-serif text-[20px] font-medium text-[#30252c]">
        No scents found this time.
      </h2>

      {/* Description */}
      <p className="mt-2 max-w-[340px] text-[11px] leading-[1.7] text-[#777078]">
        We couldn't find a match for "{query}".
        <br />
        Try another fragrance name, brand or scent note.
      </p>

      {/* Browse Button */}
      <Link
        to="/shop"
        className="mt-4 inline-flex h-[36px] min-w-[136px] items-center justify-center rounded-full bg-[#f72568] px-6 text-[11px] font-medium text-white transition-colors hover:bg-[#df1758]"
      >
        Browse all fragrances
      </Link>

      {/* Suggestions */}
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

  const run = (q) => {
    setInput(q);

    const value = q.trim();

    setParams(value ? { q: value } : {}, {
      replace: true,
    });
  };

  const clear = () => run("");

  const results = useMemo(() => (query ? searchProducts(query) : []), [query]);

  const recommended = useMemo(
    () =>
      RECOMMENDED_IDS.map((id) => allProducts.find((p) => p.id === id)).filter(
        Boolean,
      ),
    [],
  );

  const searching = query.length > 0;

  const shown = searching ? results : recommended;

  return (
    <main className="mx-auto max-w-[1240px] px-4 pb-20 pt-6 text-[#292329] md:px-6">
      {/* Breadcrumb */}
      <nav className="text-[10px] text-[#6d656c]" aria-label="Breadcrumb">
        <Link to="/" className="hover:underline">
          Home
        </Link>{" "}
        / <span>Search</span>
      </nav>

      {/* Page Heading */}
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

      {/* Search Bar */}
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

      {/* Search Discovery - Only when no query */}
      {!searching && (
        <section className="mt-4" aria-labelledby="discovery-title">
          <h2 id="discovery-title" className="text-[10px] font-semibold">
            Search Discovery
          </h2>

          <ul className="mt-3 flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <li key={s}>
                <button
                  type="button"
                  onClick={() => run(s)}
                  className="bg-[#f3f1f2] px-3 py-1.5 text-[9px] text-[#4a424a] hover:bg-[#ece8ea]"
                >
                  {s}
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Search Results */}
      <section className={searching ? "mt-3" : "mt-10"} aria-live="polite">
        {searching ? (
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
                {results.map((p) => (
                  <ProductCard key={p.id} product={p} />
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

            <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3">
              {recommended.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
}
