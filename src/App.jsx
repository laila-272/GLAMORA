import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./Components/Layout.jsx";

import "./App.css";
import Home from "./Pages/Home";
import Brands from "./Pages/Brands";
import BrandProducts from "./Pages/BrandProducts";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "brands", element: <Brands /> },
      { path: "brands/:brandName", element: <BrandProducts /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
