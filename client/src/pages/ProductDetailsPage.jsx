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
    return <p className="empty-state">Loading product...</p>;
  }

  if (status === "error") {
    return (
      <p className="empty-state error-state">Could not load product: {error}</p>
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
      className="form-panel detail-panel"
      aria-labelledby="product-detail-title"
    >
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Product details</p>
          <h2 id="product-detail-title">{product.name}</h2>
          <p className="detail-unit">Sold by {product.unit || "piece"}</p>
        </div>
        <Link className="secondary-action" to="/products">
          Back to products
        </Link>
      </div>
      <div className="detail-grid">
        {details.map(([label, value]) => (
          <div className="detail-item" key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ProductDetailsPage;
