import { useState } from "react";
import { ArrowRight } from "lucide-react";
import ProductCard from "./ProductCard";

// Category Images
import womenImg from "../assets/e/01/women.png";
import menImg from "../assets/e/01/men.png";
import unisexImg from "../assets/e/01/uni.png";
import newImg from "../assets/e/01/new.png";
import giftImg from "../assets/e/01/gift.png";

// Product Images
// Add the correct image imports here (img1 to img8)

// Categories
const categories = [
  { label: "Women", img: womenImg, href: "/shop?category=women" },
  { label: "Men", img: menImg, href: "/shop?category=men" },
  { label: "Unisex", img: unisexImg, href: "/shop?category=unisex" },
  { label: "New in", img: newImg, href: "/shop?filter=new" },
  { label: "Gift ideas", img: giftImg, href: "/shop?filter=gifts" },
];

const productFilters = [
  "All",
  "Women",
  "Men",
  "Unisex",
  "New in",
  "Gift ideas",
];

const products = [
  {
    id: 1,
    name: "Relaxed linen shirt",
    sizes: "Sizes XS to XL",
    price: "EGP 1,295",
    tags: ["Women"],
    image: womenImg,
    alt: "Woman in a tan relaxed linen shirt and trousers",
  },
  {
    id: 2,
    name: "Cotton pull-on shirt",
    sizes: "Sizes S to XL",
    price: "EGP 1,150",
    tags: ["Men"],
    image: menImg,
    alt: "Woman in a striped pull-on shirt and blue jeans",
  },
  {
    id: 3,
    name: "Soft silhouette",
    sizes: "Sizes XS to L",
    price: "EGP 770",
    tags: ["Women", "Men","Unisex"],
    image: unisexImg,
    alt: "Woman in a rust knit and trousers",
  },
  {
    id: 4,
    name: "Woven midi dress",
    sizes: "Sizes XS to XL",
    price: "EGP 1,995",
    tags: [ "New in"],
    image: newImg,
    alt: "Woman in an olive green outfit",
  },
  {
    id: 5,
    name: "Boxed cotton shirt",
    sizes: "Sizes S to XL",
    price: "EGP 1,180",
    tags: ["Gift"],
    image: giftImg,
    alt: "Model in a pale blue shirt",
  },
 

 
];

export default function FeaturedProducts() {
  const [active, setActive] = useState("All");

  const visible =
    active === "All"
      ? products
      : products.filter((p) => p.tags.includes(active));

  return (
    <section
      id="new"
      aria-labelledby="featured-title"
      className="bg-white py-10 lg:py-14"
    >
      <div className="mx-auto px-5 sm:px-8 lg:px-[120px]">
        <div className="flex items-end justify-between gap-4">
          <h2
            id="featured-title"
            className="font-serif text-[26px] leading-tight lg:text-[clamp(26px,2.4vw,36px)]"
          >
            New, but made to last
          </h2>

          <a
            href="#new"
            className="hidden shrink-0 items-center gap-2 text-[12px] font-medium sm:inline-flex"
          >
            Shop all new arrivals
            <ArrowRight size={14} strokeWidth={1.5} />
          </a>
        </div>

        <div
          role="group"
          aria-label="Filter products"
          className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-3"
        >
          {productFilters.map((filter) => (
            <button
              key={filter}
              type="button"
              aria-pressed={active === filter}
              onClick={() => setActive(filter)}
              className={`shrink-0 rounded-full border px-3.5 py-1 text-[11px] transition-colors ${
                active === filter
                  ? "border-black bg-black text-white"
                  : "text-ink/60 hover:text-ink"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <ul className="mt-6 grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-4 lg:gap-x-[1.8%] lg:gap-y-10">
          {visible.map((product) => (
            <li key={product.id}>
              <ProductCard product={product} />
            </li>
          ))}
        </ul>

        <a
          href="#new"
          className="mt-8 inline-flex items-center gap-2 text-[12px] font-medium sm:hidden"
        >
          Shop all new arrivals
          <ArrowRight size={14} strokeWidth={1.5} />
        </a>
      </div>
    </section>
  );
}
