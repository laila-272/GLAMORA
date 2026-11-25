import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductListing from "./ProductListing";
import { getProducts } from "../Services/productService.js";

const GENDERS = {
  women: "Women",
  men: "Men",
  unisex: "Unisex",
};

export default function Shop() {
  const [params] = useSearchParams();
  const gender = GENDERS[params.get("category")] || "";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError("Unable to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <main className="mx-auto max-w-[1240px] px-4 py-20 text-center">
        <p className="text-sm text-[#5a4a4d]">Loading products...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-[1240px] px-4 py-20 text-center">
        <p className="text-sm text-red-600">{error}</p>
      </main>
    );
  }

  return (
    <ProductListing
      key={gender}
      crumbs={[
        { label: "Home", to: "/" },
        { label: "Shop all", to: "/shop" },
        { label: "New arrivals" },
      ]}
      title="shop all"
      subtitle="Selection of imported originals."
      items={products}
      showBrand
      initialGender={gender}
      productHref={(p) => `/product/${p.id}`}
    />
  );
}
