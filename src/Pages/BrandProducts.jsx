import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ProductListing from "./ProductListing";
import { getBrands } from "../Services/brandService.js";
import { getProducts } from "../Services/productService.js";

const getBrandSlug = (name) =>
  name
    .toLowerCase()
    .replace(/&/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export default function BrandProducts() {
  const { brandName } = useParams();

  const [brand, setBrand] = useState(null);
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

        const selectedBrand = brandsData.find(
          (item) => getBrandSlug(item.name) === brandName,
        );

        if (!cancelled) {
          setBrand(selectedBrand || null);

          setProducts(
            selectedBrand
              ? productsData.filter(
                  (product) => product.brand_id === selectedBrand.id,
                )
              : [],
          );
        }
      } catch (err) {
        if (!cancelled) {
          setError("Unable to load brand products. Please try again.");
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
  }, [brandName]);

  if (loading) {
    return (
      <main className="mx-auto max-w-[1240px] px-6 py-16 text-center">
        <p className="text-sm text-[#5a4a4d]">Loading products...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-[1240px] px-6 py-16 text-center">
        <p className="text-sm text-red-500">{error}</p>
      </main>
    );
  }

  if (!brand) {
    return (
      <main className="mx-auto max-w-[1240px] px-6 py-16 text-center">
        <p className="font-serif text-2xl">Brand not found.</p>

        <Link
          to="/brands"
          className="mt-3 inline-block text-[12px] text-[#f4256b] underline"
        >
          Back to brands
        </Link>
      </main>
    );
  }

  return (
    <ProductListing
      key={brand.id}
      crumbs={[
        { label: "Home", to: "/" },
        { label: "Brands", to: "/brands" },
        { label: brand.name },
      ]}
      title={brand.name}
      subtitle={brand.description}
      items={products}
      productHref={(product) => `/product/${product.id}`}
    />
  );
}
