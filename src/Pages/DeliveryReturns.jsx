import { Link } from "react-router-dom";
import {
  FREE_DELIVERY_THRESHOLD,
  DELIVERY_FEE,
  egp,
} from "../Context/CartContext.jsx";

export default function DeliveryReturns() {
  return (
    <main className="mx-auto max-w-[760px] px-4 pb-16 pt-3 text-[#292329] md:px-6">
      <nav className="text-[10px] text-[#888087]" aria-label="Breadcrumb">
        <Link to="/" className="hover:underline">
          Home
        </Link>{" "}
        / <span>Delivery &amp; returns</span>
      </nav>
      <h1 className="mt-5 font-serif text-[40px] font-medium leading-none md:text-[52px]">
        Delivery &amp; returns
      </h1>
      <div className="mt-8 space-y-6 text-[13px] leading-relaxed text-[#3a323a]">
        <section>
          <h2 className="font-serif text-[20px] font-semibold">Delivery</h2>
          <p className="mt-2">
            Free delivery over {egp(FREE_DELIVERY_THRESHOLD)}. Below that,
            delivery is {egp(DELIVERY_FEE)}. Delivery charges are shown in your
            bag before checkout. Cash on delivery is available.
          </p>
        </section>
        <section>
          <h2 className="font-serif text-[20px] font-semibold">Returns</h2>
          <p className="mt-2">Easy 14-day returns.</p>
        </section>
      </div>
    </main>
  );
}
