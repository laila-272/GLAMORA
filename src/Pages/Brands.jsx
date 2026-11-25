import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getBrands } from "../Services/brandService.js";
import { getProducts } from "../Services/productService.js";
import "../index.css";

const getBrandSlug = (name) =>
  name
    .toLowerCase()
    .replace(/&/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export default function Brands() {
  const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const [brandsData, productsData] = await Promise.all([
          getBrands(),
          getProducts(),
        ]);

        if (!cancelled) {
          setBrands(brandsData);
          setProducts(productsData);
        }
      } catch (err) {
        if (!cancelled) {
          setError("Unable to load brands. Please try again.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <main className="mx-auto max-w-[1240px] px-4 py-16 text-center">
        <p className="text-sm text-[#5a4a4d]">Loading brands...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-[1240px] px-4 py-16 text-center">
        <p className="text-sm text-red-500">{error}</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-[1240px] px-4 pb-16 pt-3 text-[#1f1416] md:px-6">
      <nav className="text-[10px] text-[#5a4a4d]" aria-label="Breadcrumb">
        <Link to="/" className="hover:underline">
          Home
        </Link>{" "}
        / <span>Brands</span>
      </nav>

      <header className="mt-5">
        <h1 className="font-serif text-[36px] font-medium leading-none sm:text-[40px] md:text-[48px]">
          Brands
        </h1>

        <div className="mt-3 flex items-end justify-between gap-3">
          <p className="text-[11px] sm:text-[13px]">
            Find your favourite fragrance house. Explore our brands, A–Z.
          </p>

          <span className="shrink-0 text-[9px] font-medium uppercase tracking-wide sm:text-[10px]">
            {brands.length} Brands
          </span>
        </div>
      </header>

      <section className="mt-8 grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-3">
        {brands.map((brand) => {
          const slug = getBrandSlug(brand.name);

          const count = products.filter(
            (product) => product.brand_id === brand.id,
          ).length;

          const coverImage = brand.images?.find(
            (image) => image.is_active && image.purpose === "cover",
          );

          return (
            <Link
              key={brand.id}
              to={`/brands/${slug}`}
              className="min-w-0 rounded-2xl border border-[#efe5e8] bg-white p-2 sm:p-3"
            >
              {coverImage?.path ? (
                <img
                  src={coverImage.path}
                  alt={coverImage.alt_text || brand.name}
                  className="aspect-[3/2] w-full rounded-lg object-cover"
                />
              ) : (
                <div className="aspect-[3/2] w-full rounded-lg bg-[#f8f3f4]" />
              )}

              <h2 className="mt-3 break-words font-serif text-[17px] font-medium leading-tight sm:mt-4 sm:text-[22px]">
                {brand.name}
              </h2>

              {brand.description && (
                <p className="mt-2 line-clamp-2 text-[10px] leading-relaxed text-[#76696c] sm:text-[11px]">
                  {brand.description}
                </p>
              )}

              <div className="mt-3 flex items-center justify-between gap-1 text-[9px] sm:mt-4 sm:text-[10px]">
                <span className="text-[#3a2a2d]">
                  {count} {count === 1 ? "fragrance" : "fragrances"}
                </span>

                <span className="shrink-0 text-[#f4256b]">Shop brand →</span>
              </div>
            </Link>
          );
        })}
      </section>
    </main>
  );
}
