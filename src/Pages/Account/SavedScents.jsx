import { Link } from "react-router-dom";
import { Heart, Bookmark } from "lucide-react";
import AccountLayout from "./AccountLayout";
import { useAccount } from "../../Context/AccountContext";
import { egp } from "../../Context/CartContext";
import { allProducts } from "../../data/Brands.js";

export default function SavedScents() {
  const { savedIds, toggleSaved } = useAccount();

  // Keep the order in which the scents were saved.
  const saved = savedIds
    .map((id) => allProducts.find((p) => p.id === id))
    .filter(Boolean);

  return (
    <AccountLayout
      current="saved"
      title="Saved for another day."
      subtitle="Keep the fragrances you love, all in one place."
    >
      <div className="flex items-center justify-between gap-4 pb-3 text-[11px]">
        <p className="text-[#6d656c]">
          {saved.length} saved {saved.length === 1 ? "scent" : "scents"}
        </p>

        {saved.length > 0 && (
          <Link
            to="/shop"
            className="text-[#f72568] underline underline-offset-2"
          >
            Continue shopping →
          </Link>
        )}
      </div>

      {saved.length === 0 ? (
        <div className="flex min-h-[330px] flex-col items-center justify-center px-4 py-10 text-center">
          {/* Empty State Icon */}
          <div className="relative flex h-[114px] w-[114px] items-center justify-center rounded-full bg-[#fff6f9]">
            <Bookmark size={66} strokeWidth={1.8} className="text-[#a99da3]" />

            <Heart
              size={21}
              strokeWidth={0}
              fill="#f72568"
              className="absolute left-1/2 top-[36px] -translate-x-1/2"
            />
          </div>

          {/* Empty State Text */}
          <h2 className="mt-3 font-serif text-[20px] font-medium text-[#30252c]">
            Your favourites are waiting.
          </h2>

          <p className="mt-2 max-w-[340px] text-[11px] leading-[1.7] text-[#777078]">
            Tap the heart on any fragrance to save it here.
            <br />
            Your next signature could be a browse away.
          </p>

          {/* Explore Button */}
          <Link
            to="/shop"
            className="mt-4 inline-flex h-[36px] min-w-[136px] items-center justify-center rounded-full bg-[#f72568] px-6 text-[11px] font-medium text-white transition-colors hover:bg-[#df1758]"
          >
            Explore fragrances
          </Link>
        </div>
      ) : (
        <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3">
          {saved.map((p) => (
            <li key={p.id} className="relative">
              {p.isNew && (
                <span className="absolute left-0 top-0 z-10 rounded-full border border-[#f72568] bg-white px-2 py-0.5 text-[8px] font-medium text-[#f72568]">
                  New
                </span>
              )}

              <button
                type="button"
                onClick={() => toggleSaved(p.id)}
                aria-label={`Remove ${p.name} from saved scents`}
                className="absolute right-0 top-0 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-[#fff0f4]"
              >
                <Heart size={13} className="fill-[#f72568] text-[#f72568]" />
              </button>

              <Link to={`/product/${p.id}`} className="block">
                <div className="flex h-[200px] items-end justify-center px-4 pt-10 md:h-[230px]">
                  <img
                    src={p.img}
                    alt={p.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>

                <h2 className="mt-3 font-serif text-[15px] font-semibold leading-tight">
                  {p.name}
                </h2>

                <p className="mt-1 text-[10px] text-[#888087]">
                  {p.brandName} · {p.note} · {p.size}ml
                </p>

                <p className="mt-1.5 text-[11px] font-semibold">
                  {egp(p.price)}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </AccountLayout>
  );
}
