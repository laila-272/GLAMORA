import { Link, useParams } from "react-router-dom";
import ProductListing from "./ProductListing";
import { brands, products } from "../data/brands";

export default function BrandProducts() {
  const { brandName } = useParams();
  const brand = brands.find((b) => b.slug === brandName);

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
      key={brand.slug} // reset filters when switching brand
      crumbs={[
        { label: "Home", to: "/" },
        { label: "Brands", to: "/brands" },
        { label: brand.name },
      ]}
      title={brand.name}
      subtitle="Example selection of imported originals. Prices and availability are illustrative."
      items={products.filter((p) => p.brand === brand.slug)}
      productHref={(p) => `/product/${p.id}`}
    />
  );
}
