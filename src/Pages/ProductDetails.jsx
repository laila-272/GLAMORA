import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Heart, Minus, Plus, Share2 } from "lucide-react";
import { allProducts, extraProducts } from "../data/Brands.js";
import { useCart } from "../Context/CartContext";
import { useAccount } from "../context/AccountContext";

const FAMILIES = ["Floral", "Woody", "Oriental", "Fresh"];
const VOLUMES = [30, 50, 100];
const TABS = ["Notes", "Brand", "Care"];
const CARE =
  "Store away from heat and direct sunlight. Spray onto pulse points; avoid eyes and irritated skin. Check the label before use.";
const egp = (n) => `EGP ${n.toLocaleString("en-US")}`;
// "Make it your everyday": J'adore, Coco Mademoiselle, YSL Libre
const RELATED = extraProducts;

export default function ProductDetails() {
  const { productId } = useParams();
  const product = allProducts.find((p) => String(p.id) === productId);

  if (!product) {
    return (
      <main className="mx-auto max-w-[1240px] px-6 py-16 text-center">
        <p className="font-serif text-2xl">Product not found.</p>
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
  const gallery = p.gallery || [p.img];
  const [active, setActive] = useState(0);
  const [broken, setBroken] = useState({});
  const [family, setFamily] = useState(p.family);
  const [volume, setVolume] = useState(p.size);
  const [qty, setQty] = useState(1);
  const { isSaved, toggleSaved } = useAccount();
  const wish = isSaved(p.id);
  const [tab, setTab] = useState("Notes");
  const [notice, setNotice] = useState("");
  const [added, setAdded] = useState(false);
  const { addToCart: addLine } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => {
      setNotice("");
      setAdded(false);
    }, 4000);
    return () => clearTimeout(t);
  }, [notice]);

  // If a gallery image is missing, fall back to the main product image.
  const srcOf = (src) => (broken[src] ? p.img : src);
  const onImgError = (src) => () => setBroken((b) => ({ ...b, [src]: true }));

  const addToCart = () => {
    addLine(p.id, { volume, qty, family });
    setNotice(`Added ${qty} × ${p.name} (${volume}ml) to your bag.`);
    setAdded(true);
  };
  const buyNow = () => {
    addLine(p.id, { volume, qty, family });
    navigate("/checkout");
  };

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title: p.name, url });
      else {
        await navigator.clipboard.writeText(url);
        setNotice("Product link copied.");
      }
    } catch {
      /* share dismissed */
    }
  };

  const categoryLabel = p.gender;
  const keyNotes =
    p.keyNotes ||
    "Not specified here. Check the bottle label for the full composition.";
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
            <img
              src={srcOf(gallery[active])}
              onError={onImgError(gallery[active])}
              alt={p.name}
              className="max-h-full max-w-full object-contain"
            />
          </div>
          <div className="mt-4 flex items-end gap-3">
            {gallery.map((src, i) => (
              <button
                key={src}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`View image ${i + 1}`}
                aria-pressed={i === active}
                className={`flex aspect-[0.88/1] w-[64px] items-center justify-center rounded-xl border bg-white p-1.5 md:w-[84px] ${
                  i === active ? "border-[#f32970]" : "border-[#eae7e9]"
                }`}
              >
                <img
                  src={srcOf(src)}
                  onError={onImgError(src)}
                  alt=""
                  className="max-h-full max-w-full object-contain"
                />
              </button>
            ))}
            <span className="ml-auto text-[8px] text-[#888087]">
              Original bottle · {p.brandName.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="max-w-[460px]">
          <h1 className="font-serif text-[34px] font-medium leading-tight md:text-[40px]">
            {p.name}
          </h1>
          <p className="mt-3 text-[16px] font-semibold text-[#888087]">
            {egp(p.price)}
          </p>
          <p className="mt-4 text-[12px] leading-[1.55] text-[#3a323a]">
            {p.name} {p.concentration}. Original imported fragrance. Example
            price; confirm availability.
          </p>

          <hr className="my-5 border-[#eae7e9]" />

          <p className="text-[10px]">Family: {family}</p>
          <div className="mt-2 grid grid-cols-4 gap-2">
            {FAMILIES.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFamily(f)}
                aria-pressed={family === f}
                className={`h-6 rounded-full border text-[8px] ${
                  family === f
                    ? "border-[#f32970] bg-[#fff4f7] text-[#f32970]"
                    : "border-[#f7e2e9] bg-[#fff4f7] text-[#3a323a]"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <p className="mt-5 text-[10px]">Volume: {volume}ml</p>
          <div className="mt-2 flex gap-2">
            {VOLUMES.map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setVolume(v)}
                aria-pressed={volume === v}
                className={`h-7 rounded-lg border px-3 text-[9px] font-medium ${
                  volume === v
                    ? "border-[#1d1418] bg-[#1d1418] text-white"
                    : "border-[#eae7e9] bg-white"
                }`}
              >
                {v}ml
              </button>
            ))}
          </div>

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
              {TABS.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTab(t)}
                  aria-pressed={tab === t}
                  className={`h-6 rounded-full border px-3 text-[9px] font-medium ${
                    tab === t
                      ? "border-[#1d1418] bg-[#1d1418] text-white"
                      : "border-[#eae7e9] bg-white"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-3 text-[10px] leading-[1.5] text-[#3a323a]">
            {tab === "Notes" && (
              <>
                <p>Key notes: {keyNotes}</p>
                <p className="mt-3 text-[8px] leading-[1.5] text-[#888087]">
                  {CARE}
                </p>
              </>
            )}
            {tab === "Brand" && (
              <p>
                {p.brandName} — original fragrances from an international house.
                Sold here as imported originals, in the packaging the brand
                intended.
              </p>
            )}
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

      {/* Related */}
      <section className="mt-12 lg:mt-16">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-serif text-[28px] font-medium leading-none md:text-[36px]">
            Make it your everyday.
          </h2>
          <Link
            to="/shop"
            className="shrink-0 text-[10px] underline underline-offset-2"
          >
            Shop all new arrivals →
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3">
          {RELATED.map((r) => {
            const liked = isSaved(r.id);
            return (
              <article key={r.id} className="relative">
                {r.isNew && (
                  <span className="absolute left-0 top-0 z-10 rounded-full border border-[#f32970] bg-white px-2 py-0.5 text-[8px] font-medium text-[#f32970]">
                    New
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => toggleSaved(r.id)}
                  aria-pressed={liked}
                  aria-label={
                    liked ? "Remove from wishlist" : "Add to wishlist"
                  }
                  className="absolute right-0 top-0 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-[#fff4f7]"
                >
                  <Heart
                    size={13}
                    className={
                      liked ? "fill-[#f32970] text-[#f32970]" : "text-[#f32970]"
                    }
                  />
                </button>
                <Link to={`/product/${r.id}`} className="block">
                  <div className="flex h-[220px] items-end justify-center px-4 pt-10 md:h-[260px]">
                    <img
                      src={r.img}
                      alt={r.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <h3 className="mt-3 font-serif text-[16px] font-semibold leading-tight">
                    {r.name}
                  </h3>
                  <p className="mt-1 text-[10px] text-[#888087]">
                    {r.brandName} · {r.note} · {r.size}ml
                  </p>
                  <p className="mt-1.5 text-[12px] font-semibold">
                    {egp(r.price)}
                  </p>
                </Link>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
