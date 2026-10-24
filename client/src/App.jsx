import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import DashboardPage from "./pages/DashboardPage";
import ProductAddPage from "./pages/ProductAddPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import ProductUpdatePage from "./pages/ProductUpdatePage";

function App() {
  return (
    <BrowserRouter>
      <main className="min-h-screen bg-[#f4f5ef] px-[clamp(20px,6vw,96px)] pt-[56px] pb-20 text-[#1d2926] max-[760px]:px-5 max-[760px]:pt-[34px] max-[760px]:pb-14">
        <Navbar />

        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/products" element={<ProductUpdatePage />} />
          <Route path="/products/:id" element={<ProductDetailsPage />} />
          <Route path="/products/add" element={<ProductAddPage />} />
          <Route path="*" element={<Navigate replace to="/" />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
