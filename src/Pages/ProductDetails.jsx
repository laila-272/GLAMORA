import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Heart, Minus, Plus, Share2 } from "lucide-react";
import { getProducts } from "../Services/productService.js";
import { useCart } from "../Context/CartContext";
import { useAccount } from "../Context/AccountContext.jsx";

const TABS = ["Notes", "Brand", "Care"];

const CARE =
  "Store away from heat and direct sunlight. Spray onto pulse points; avoid eyes and irritated skin. Check the label before use.";

const egp = (n) => `EGP ${Number(n).toLocaleString("en-US")}`;

export default function ProductDetails() {
  const { productId } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const products = await getProducts();

        const foundProduct = products.find(
          (item) => String(item.id) === productId,
        );

        if (!foundProduct) {
          setError("Product not found.");
          return;
        }

        setProduct(foundProduct);
      } catch (err) {
        console.error("Failed to fetch product:", err);
        setError("Unable to load product. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) {
    return (
      <main className="mx-auto max-w-[1240px] px-6 py-16 text-center">
        Loading product...
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="mx-auto max-w-[1240px] px-6 py-16 text-center">
        <p className="font-serif text-2xl">{error || "Product not found."}</p>

        <Link
          to="/shop"
          className="mt-3 inline-block text-[12px] text-[#f32970] underline"
        >
          Back to shop
        </Link>
      </main>
    );
  }

  return <Details key={product.id} product={product} />;
}

function Details({ product: p }) {
  const images = p.images || [];

  const gallery = images
    .filter((image) => image.is_active)
    .sort((a, b) => {
      if (a.purpose === "main") return -1;
      if (b.purpose === "main") return 1;
      return 0;
    });

  const [active, setActive] = useState(0);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState("Notes");
  const [notice, setNotice] = useState("");
  const [added, setAdded] = useState(false);

  const { isSaved, toggleSaved } = useAccount();
  const wish = isSaved(p.id);

  const { addToCart: addLine } = useCart();
  const navigate = useNavigate();

  const price = Number(p.sale_price ?? p.original_price);

  useEffect(() => {
    if (!notice) return;

    const timer = setTimeout(() => {
      setNotice("");
      setAdded(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, [notice]);

 const addToCart = async () => {
   setNotice("");

   const addedSuccessfully = await addLine(p.id, { qty });

   if (!addedSuccessfully) {
     setNotice("Unable to add this product. Please try again.");
     setAdded(false);
     return;
   }

   setNotice(`Added ${qty} × ${p.name} to your bag.`);
   setAdded(true);
 };

 const buyNow = async () => {
   setNotice("");

   const addedSuccessfully = await addLine(p.id, { qty });

   if (addedSuccessfully) {
     navigate("/checkout");
   } else {
     setNotice("Unable to add this product. Please try again.");
     setAdded(false);
   }
 };

  const share = async () => {
    const url = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({
          title: p.name,
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        setNotice("Product link copied.");
      }
    } catch {
      // Share dismissed.
    }
  };

  const categoryLabel = p.type;

  const circleBtn =
    "flex h-9 w-9 items-center justify-center rounded-full border border-[#eae7e9] text-[#292329]";

  return (
    <main className="mx-auto max-w-[1240px] px-4 pb-16 pt-3 text-[#292329] md:px-6">
      <nav className="text-[10px] text-[#888087]" aria-label="Breadcrumb">
        <Link to="/" className="hover:underline">
          Home
        </Link>{" "}
        /{" "}
        <Link
          to={`/shop?category=${categoryLabel.toLowerCase()}`}
          className="hover:underline"
        >
          {categoryLabel}
        </Link>{" "}
        / <span>{p.name}</span>
      </nav>

      <div className="mt-4 grid gap-8 lg:grid-cols-[1.45fr_1fr] lg:gap-12">
        {/* Gallery */}
        <div>
          <div className="flex h-[360px] items-center justify-center md:h-[clamp(420px,42vw,620px)]">
            {gallery[active]?.path && (
              <img
                src={gallery[active].path}
                alt={gallery[active].alt_text ?? ""}
                className="max-h-full max-w-full object-contain"
              />
            )}
          </div>

          <div className="mt-4 flex items-end gap-3">
            {gallery.map((image, index) => (
              <button
                key={image.id}
                type="button"
                onClick={() => setActive(index)}
                aria-label={`View image ${index + 1}`}
                aria-pressed={index === active}
                className={`flex aspect-[0.88/1] w-[64px] items-center justify-center rounded-xl border bg-white p-1.5 md:w-[84px] ${
                  index === active ? "border-[#f32970]" : "border-[#eae7e9]"
                }`}
              >
                <img
                  src={image.path}
                  alt={image.alt_text ?? ""}
                  className="max-h-full max-w-full object-contain"
                />
              </button>
            ))}

            <span className="ml-auto text-[8px] text-[#888087]">
              {p.brand?.name}
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="max-w-[460px]">
          <h1 className="font-serif text-[34px] font-medium leading-tight md:text-[40px]">
            {p.name}
          </h1>

          <p className="mt-3 text-[16px] font-semibold text-[#888087]">
            {egp(price)}
          </p>

          <p className="mt-4 text-[12px] leading-[1.55] text-[#3a323a]">
            {p.description}
          </p>

          <hr className="my-5 border-[#eae7e9]" />

          <p className="text-[10px]">Family: {p.family?.name}</p>

          <p className="mt-5 text-[10px]">Volume: {p.size}</p>

          <p className="mt-5 text-[10px]">Type: {p.type}</p>

          <div className="mt-6 flex items-center justify-between">
            <div className="flex h-9 w-[104px] items-center justify-between rounded-full border border-[#eae7e9] px-3">
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
              >
                <Minus size={11} />
              </button>

              <span className="text-[12px]" aria-live="polite">
                {qty}
              </span>

              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() => setQty((q) => q + 1)}
              >
                <Plus size={11} />
              </button>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                aria-label="Wishlist"
                aria-pressed={wish}
                onClick={() => toggleSaved(p.id)}
                className={circleBtn}
              >
                <Heart
                  size={13}
                  className={wish ? "fill-[#f32970] text-[#f32970]" : ""}
                />
              </button>

              <button
                type="button"
                aria-label="Share"
                onClick={share}
                className={circleBtn}
              >
                <Share2 size={13} />
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={addToCart}
            className="mt-4 h-9 w-full rounded-full border border-[#eae7e9] bg-white text-[10px] font-medium"
          >
            Add to cart
          </button>

          <button
            type="button"
            onClick={buyNow}
            className="mt-2.5 h-9 w-full rounded-full bg-[#f32970] text-[10px] font-medium text-white"
          >
            Buy Now
          </button>

          <p
            role="status"
            className="mt-2 min-h-[14px] text-[10px] text-[#f32970]"
          >
            {notice}

            {added && (
              <Link to="/cart" className="ml-2 text-[#292329] underline">
                View cart
              </Link>
            )}
          </p>

          <hr className="my-4 border-[#eae7e9]" />

          <div className="flex items-center gap-3">
            <h2 className="font-serif text-[16px] font-semibold">
              Notes &amp; care
            </h2>

            <div className="flex gap-1.5">
              {TABS.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setTab(item)}
                  aria-pressed={tab === item}
                  className={`h-6 rounded-full border px-3 text-[9px] font-medium ${
                    tab === item
                      ? "border-[#1d1418] bg-[#1d1418] text-white"
                      : "border-[#eae7e9] bg-white"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-3 text-[10px] leading-[1.5] text-[#3a323a]">
            {tab === "Notes" && (
              <>
                <p>Key notes: {p.notes}</p>

                <p className="mt-3 text-[8px] leading-[1.5] text-[#888087]">
                  {CARE}
                </p>
              </>
            )}

            {tab === "Brand" && <p>{p.brand?.name}</p>}

            {tab === "Care" && <p>{CARE}</p>}
          </div>

          <hr className="my-4 border-[#eae7e9]" />

          <h2 className="font-serif text-[16px] font-semibold">
            Delivery &amp; returns
          </h2>

          <p className="mt-2 text-[10px] leading-[1.5] text-[#3a323a]">
            Free delivery over EGP 2,000. Easy 14-day returns. Delivery charges
            are shown in your bag before checkout.
          </p>

          <Link
            to="/delivery-returns"
            className="mt-3 inline-block text-[10px] underline underline-offset-2"
          >
            Read delivery &amp; returns
          </Link>
        </div>
      </div>
    </main>
  );
}
