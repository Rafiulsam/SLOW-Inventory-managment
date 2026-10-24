import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function ProductDetailsPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const response = await fetch(`${API_URL}/products/${id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load product");
        }

        setProduct(data);
        setStatus("ready");
      } catch (loadError) {
        setError(loadError.message);
        setStatus("error");
      }
    };

    loadProduct();
  }, [id]);

  if (status === "loading") {
    return <p className="py-8 text-[#66716c]">Loading product...</p>;
  }

  if (status === "error") {
    return (
      <p className="py-8 text-[#bb4b32]">Could not load product: {error}</p>
    );
  }

  const details = [
    ["Current stock", product.currentStock],
    ["Purchase price", product.purchasePrice],
    ["Selling price", product.sellingPrice],
    ["Low-stock limit", product.lowStockLimit],
  ];

  return (
    <section
      className="mx-auto max-w-[900px] border-t border-[#bdc5bb]"
      aria-labelledby="product-detail-title"
    >
      <div className="grid grid-cols-[1fr_auto] items-center gap-6 py-7 pb-6 max-[760px]:grid-cols-1">
        <div>
          <p className="mb-3 text-[#bb4b32] text-[0.72rem] font-extrabold tracking-[0.16em] uppercase">Product details</p>
          <h2 className="mb-0 font-[Georgia,'Times_New_Roman',serif] text-[2rem] font-medium" id="product-detail-title">{product.name}</h2>
          <p className="mt-[10px] mb-0 text-[#66716c]">Sold by {product.unit || "piece"}</p>
        </div>
        <Link className="text-[#66716c] text-[0.78rem] font-bold no-underline hover:text-[#bb4b32]" to="/products">
          Back to products
        </Link>
      </div>
      <div className="grid grid-cols-4 border-t border-[#d6dbd2] max-[760px]:grid-cols-1">
        {details.map(([label, value]) => (
          <div className="grid min-h-[130px] gap-[18px] border-r border-[#d6dbd2] bg-[#fbfcf8] p-5 last:border-r-0 max-[760px]:min-h-0 max-[760px]:border-r-0 max-[760px]:border-b max-[760px]:border-[#d6dbd2]" key={label}>
            <span className="text-[#66716c] text-[0.7rem] font-extrabold tracking-[0.08em] uppercase">{label}</span>
            <strong className="font-[Georgia,'Times_New_Roman',serif] text-[2.3rem] font-medium">{value}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ProductDetailsPage;
