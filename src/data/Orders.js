import { allProducts } from "./Brands.js";

/* Sample orders (demo data). Item names and prices come from the shared product data. */
const DELIVERY = 60;

// Address and contact are a snapshot taken when the order was placed.
const ADDRESS = {
  label: "Home",
  name: "Salma Hassan",
  street: "18 El Nozha Street",
  apartment: "Apartment 4, Floor 2",
  area: "Heliopolis",
  city: "Cairo",
  country: "Egypt",
  phone: "+20 100 123 4567",
};
const EMAIL = "salma.hassan@example.com";

const raw = [
  {
    id: "GLAMORA-1940",
    date: "08 October 2026",
    status: "Delivered",
    delivery: DELIVERY,
    address: ADDRESS,
    email: EMAIL,
    items: [
      { productId: 8, volume: 50, qty: 1, family: "Floral" }, // Dior J'adore
      { productId: 9, volume: 50, qty: 1, family: "Floral" }, // Coco Mademoiselle
    ],
  },
  {
    id: "GLAMORA-1590",
    date: "02 September 2026",
    status: "Cancelled",
    delivery: DELIVERY,
    showBreakdown: true,
    address: ADDRESS,
    email: EMAIL,
    items: [
      {
        productId: 10,
        volume: 50,
        qty: 1,
        family: "Floral",
        label: "YSL Libre Oriental",
      },
    ],
  },
];

export const orders = raw.map((o) => {
  const items = o.items.map((i) => {
    const p = allProducts.find((x) => x.id === i.productId);
    return {
      ...i,
      img: p.img,
      name: i.label || p.name,
      unitPrice: p.price,
      lineTotal: p.price * i.qty,
    };
  });
  const merchandise = items.reduce((n, i) => n + i.lineTotal, 0);
  return { ...o, items, merchandise, total: merchandise + o.delivery };
});

// Single lookup point: swap this for an API call (e.g. GET /orders/:id) when a backend exists.
export const getOrder = (id) => orders.find((o) => o.id === id);
