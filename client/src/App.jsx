import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import DashboardPage from "./pages/DashboardPage";
import ProductAddPage from "./pages/ProductAddPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import ProductUpdatePage from "./pages/ProductUpdatePage";

function App() {
  return (
    <BrowserRouter>
      <main className="app-shell min-h-screen text-[#1d2926]">
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
