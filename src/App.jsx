import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./Components/Layout.jsx";
import { AuthProvider } from "./Context/AuthContext";

import "./App.css";
import Home from "./Pages/Home";
import Brands from "./Pages/Brands";
import BrandProducts from "./Pages/BrandProducts";
import OurStory from "./Pages/OurStory";
import Shop from "./Pages/Shop";
import ProductDetails from "./Pages/ProductDetails";
import Cart from "./Pages/Cart";
import Checkout from "./Pages/Checkout";
import DeliveryReturns from "./Pages/DeliveryReturns";
import { CartProvider } from "./Context/CartContext.jsx";
import { AccountProvider } from "./Context/AccountContext.jsx";
import PersonalDetails from "./Pages/Account/PersonalDetails";
import MyOrders from "./Pages/Account/Orders";
import OrderDetails from "./Pages/Account/OrderDetails";
import AddressBook from "./Pages/Account/AddressBook";
import AddressForm from "./Pages/Account/AddressForm";
import SavedScents from "./Pages/Account/SavedScents";
import Preferences from "./Pages/Account/Preferences";
import Contact from "./Pages/Account/Contact";
import NotFound from "./Pages/Account/NotFound";
import Search from "./Pages/Search";
import PaymentReview from "./Pages/PaymentReview";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "shop", element: <Shop /> },
      { path: "product/:productId", element: <ProductDetails /> },
      { path: "cart", element: <Cart /> },
      { path: "checkout", element: <Checkout /> },
      { path: "delivery-returns", element: <DeliveryReturns /> },
      { path: "account", element: <PersonalDetails /> },
      { path: "account/orders", element: <MyOrders /> },
      { path: "account/orders/:orderId", element: <OrderDetails /> },
      { path: "account/addresses", element: <AddressBook /> },
      { path: "account/addresses/new", element: <AddressForm /> },
      { path: "account/addresses/:id/edit", element: <AddressForm /> },
      { path: "account/saved", element: <SavedScents /> },
      { path: "account/preferences", element: <Preferences /> },
      { path: "brands", element: <Brands /> },
      { path: "brands/:brandName", element: <BrandProducts /> },
      { path: "our-story", element: <OurStory /> },
      { path: "contact", element: <Contact /> },
      { path: "search", element: <Search /> },
      { path: "payment-review", element: <PaymentReview /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

function App() {
  return (
    <AuthProvider>
      <AccountProvider>
        <CartProvider>
          <RouterProvider router={router} />
        </CartProvider>
      </AccountProvider>
    </AuthProvider>
  );
}

export default App;
