import { useSearchParams } from "react-router-dom";
import ProductListing from "./ProductListing";
import { products } from "../data/Brands.js";

const GENDERS = { women: "Women", men: "Men", unisex: "Unisex" };

export default function Shop() {
  const [params] = useSearchParams();
  const gender = GENDERS[params.get("category")] || ""; // supports /shop?category=women

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
