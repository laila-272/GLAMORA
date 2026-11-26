import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Bookmark } from "lucide-react";
import AccountLayout from "./AccountLayout";
import { egp } from "../../Context/CartContext";
import {
  getFavorites,
  removeFavorite,
} from "../../Services/FavoritesService.js";

export default function SavedScents() {
  const [saved, setSaved] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [removingId, setRemovingId] = useState(null);

  const fetchFavorites = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const favorites = await getFavorites();

      const products = favorites.map((product) => ({
        ...product,
        img: product.image || product.image_url || "",
        brandName: product.brand?.name || "",
        note: product.notes || "",
        price: Number(product.sale_price || product.original_price || 0),
      }));

      setSaved(products);
    } catch (err) {
      console.error("Failed to fetch favorites:", err);
      setError("Unable to load your saved fragrances. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const handleRemove = async (productId) => {
    try {
      setRemovingId(productId);
      setError("");

      await removeFavorite(productId);

      setSaved((prev) => prev.filter((product) => product.id !== productId));
    } catch (err) {
      console.error("Failed to remove favorite:", err);
      setError("Could not remove this fragrance. Please try again.");
    } finally {
      setRemovingId(null);
    }
  };

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

      {loading ? (
        <div className="flex min-h-[330px] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#f72568] border-t-transparent" />
        </div>
      ) : error && saved.length === 0 ? (
        <div className="flex min-h-[330px] flex-col items-center justify-center text-center">
          <p className="text-sm text-[#777078]">{error}</p>

          <button
            type="button"
            onClick={fetchFavorites}
            className="mt-4 rounded-full bg-[#f72568] px-6 py-2 text-xs text-white"
          >
            Try again
          </button>
        </div>
      ) : saved.length === 0 ? (
        <div className="flex min-h-[330px] flex-col items-center justify-center px-4 py-10 text-center">
          <div className="relative flex h-[114px] w-[114px] items-center justify-center rounded-full bg-[#fff6f9]">
            <Bookmark size={66} strokeWidth={1.8} className="text-[#a99da3]" />

            <Heart
              size={21}
              strokeWidth={0}
              fill="#f72568"
              className="absolute left-1/2 top-[36px] -translate-x-1/2"
            />
          </div>

          <h2 className="mt-3 font-serif text-[20px] font-medium text-[#30252c]">
            Your favourites are waiting.
          </h2>

          <p className="mt-2 max-w-[340px] text-[11px] leading-[1.7] text-[#777078]">
            Tap the heart on any fragrance to save it here.
            <br />
            Your next signature could be a browse away.
          </p>

          <Link
            to="/shop"
            className="mt-4 inline-flex h-[36px] min-w-[136px] items-center justify-center rounded-full bg-[#f72568] px-6 text-[11px] font-medium text-white transition-colors hover:bg-[#df1758]"
          >
            Explore fragrances
          </Link>
        </div>
      ) : (
        <>
          {error && <p className="mb-3 text-xs text-red-500">{error}</p>}

          <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3">
            {saved.map((p) => (
              <li key={p.id} className="relative">
                {p.is_new && (
                  <span className="absolute left-0 top-0 z-10 rounded-full border border-[#f72568] bg-white px-2 py-0.5 text-[8px] font-medium text-[#f72568]">
                    New
                  </span>
                )}

                <button
                  type="button"
                  onClick={() => handleRemove(p.id)}
                  disabled={removingId === p.id}
                  aria-label={`Remove ${p.name} from saved scents`}
                  className="absolute right-0 top-0 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-[#fff0f4] disabled:opacity-50"
                >
                  {removingId === p.id ? (
                    <span className="h-3 w-3 animate-spin rounded-full border border-[#f72568] border-t-transparent" />
                  ) : (
                    <Heart
                      size={13}
                      className="fill-[#f72568] text-[#f72568]"
                    />
                  )}
                </button>

                <Link to={`/product/${p.id}`} className="block">
                  <div className="flex h-[200px] items-end justify-center px-4 pt-10 md:h-[230px]">
                    {p.img ? (
                      <img
                        src={p.img}
                        alt={p.name || "Product"}
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center rounded-xl bg-[#fff6f9] text-xs text-[#a99da3]">
                        No image available
                      </div>
                    )}
                  </div>

                  <h2 className="mt-3 font-serif text-[15px] font-semibold leading-tight">
                    {p.name}
                  </h2>

                  <p className="mt-1 text-[10px] text-[#888087]">
                    {p.brandName}
                    {p.note ? ` · ${p.note}` : ""}
                    {p.size ? ` · ${p.size}` : ""}
                  </p>

                  <p className="mt-1.5 text-[11px] font-semibold">
                    {egp(p.price)}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </AccountLayout>
  );
}
