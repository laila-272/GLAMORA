import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AccountLayout from "./AccountLayout";
import { egp } from "../../Context/CartContext";
import { orders } from "../../data/Orders.js";

const TABS = [
  { key: "All", label: "All orders" },
  { key: "Delivered", label: "Delivered" },
  { key: "Cancelled", label: "Cancelled" },
];
const count = (key) =>
  key === "All" ? orders.length : orders.filter((o) => o.status === key).length;

function ItemsCell({ order }) {
  const n = order.items.length;
  return (
    <div className="text-[10px] leading-[1.5] text-[#4a424a]">
      <p>
        {n} {n === 1 ? "scent" : "scents"}
      </p>
      {order.items.map((i) => (
        <p key={i.productId}>
          {i.name} · {i.volume}ml
          {order.items.length > 1 ? ` · ${egp(i.unitPrice)}` : ""}
        </p>
      ))}
      {order.items.length > 1 && <p>Qty 1 each</p>}
    </div>
  );
}

export default function MyOrders() {
  const [tab, setTab] = useState("All");
  const shown = useMemo(
    () => (tab === "All" ? orders : orders.filter((o) => o.status === tab)),
    [tab],
  );

  return (
    <AccountLayout
      current="orders"
      title="My orders"
      subtitle="The scents you chose, and the journeys they take."
    >
      <div
        role="tablist"
        aria-label="Order status"
        className="flex gap-6 px-4 text-[12px]"
      >
        {TABS.map((t) => (
          <button
            key={t.key}
            role="tab"
            type="button"
            aria-selected={tab === t.key}
            onClick={() => setTab(t.key)}
            className={`border-b-2 pb-1 ${tab === t.key ? "border-[#292329] font-semibold" : "border-transparent"}`}
          >
            {t.label} ({count(t.key)})
          </button>
        ))}
      </div>

      <div className="mt-5 overflow-x-auto rounded-3xl bg-[#fff5f8] p-6">
        <table className="w-full min-w-[760px] text-left">
          <thead>
            <tr className="border-b border-[#f1dfe5] text-[10px] font-medium text-[#6d656c]">
              {["Order #", "Date", "Status", "Items", "Total", "Actions"].map(
                (h) => (
                  <th key={h} scope="col" className="pb-4 pr-4 font-medium">
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {shown.map((o) => (
              <tr
                key={o.id}
                className="border-b border-[#f1dfe5] align-middle last:border-0"
              >
                <th scope="row" className="py-6 pr-4 text-[11px] font-normal">
                  {o.id}
                </th>
                <td className="py-6 pr-4 text-[10px] text-[#6d656c]">
                  {o.date}
                </td>
                <td
                  className={`py-6 pr-4 text-[9px] ${o.status === "Delivered" ? "text-[#5b6a46]" : "text-[#4a424a]"}`}
                >
                  {o.status}
                </td>
                <td className="py-6 pr-4">
                  <ItemsCell order={o} />
                </td>
                <td className="py-6 pr-4 text-[11px] font-semibold leading-[1.5]">
                  <p>{egp(o.total)}</p>
                  {o.showBreakdown && (
                    <>
                      <p>Merchandise {egp(o.merchandise)}</p>
                      <p>Delivery {egp(o.delivery)}</p>
                    </>
                  )}
                </td>
                <td className="py-6">
                  <Link
                    to={`/account/orders/${o.id}`}
                    className="inline-flex h-8 items-center whitespace-nowrap rounded-full border border-[#eae7e9] bg-white px-4 text-[9px] font-medium"
                  >
                    View order details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Link
        to="/delivery-returns"
        className="mt-5 inline-block text-[11px] text-[#f72568] underline underline-offset-2"
      >
        Need help with an order?
      </Link>
    </AccountLayout>
  );
}
