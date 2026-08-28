import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const formatNumber = (value) => new Intl.NumberFormat().format(value);
const formatCurrency = (value) =>
  new Intl.NumberFormat(undefined, {
    currency: "BDT",
    maximumFractionDigits: 2,
    style: "currency",
  }).format(value);

function DashboardPage() {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/products`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load dashboard data");
        }

        setProducts(data);
        setStatus("ready");
      } catch (loadError) {
        setError(loadError.message);
        setStatus("error");
      }
    };

    loadProducts();
  }, []);

  const totalItems = products.reduce(
    (total, product) => total + Number(product.currentStock || 0),
    0,
  );
  const outOfStock = products.filter(
    (product) => Number(product.currentStock || 0) === 0,
  ).length;
  const lowStock = products.filter((product) => {
    const stock = Number(product.currentStock || 0);
    return stock > 0 && stock <= Number(product.lowStockLimit ?? 3);
  }).length;
  const purchaseValue = products.reduce(
    (total, product) =>
      total +
      Number(product.currentStock || 0) * Number(product.purchasePrice || 0),
    0,
  );

  const metrics = [
    { label: "Total products", value: formatNumber(products.length) },
    { label: "Items in stock", value: formatNumber(totalItems) },
    { label: "Out of stock", value: formatNumber(outOfStock) },
    { label: "Low stock", value: formatNumber(lowStock) },
    { label: "Purchase value", value: formatCurrency(purchaseValue) },
  ];

  return (
    <section className="dashboard" aria-labelledby="dashboard-title">
      <div className="dashboard-heading">
        <div>
          <p className="eyebrow">Overview</p>
          <h2 id="dashboard-title">Inventory at a glance</h2>
        </div>
        {status === "ready" && (
          <span className="connection-state">Updated now</span>
        )}
      </div>

      {status === "loading" && (
        <p className="empty-state">Loading dashboard...</p>
      )}
      {status === "error" && (
        <p className="empty-state error-state">
          Could not load dashboard: {error}
        </p>
      )}
      {status === "ready" && (
        <div className="metric-grid">
          {metrics.map((metric, index) => (
            <article
              className={`metric-card metric-card-${index + 1}`}
              key={metric.label}
            >
              <span>{metric.label}</span>
              <strong>{metric.value}</strong>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default DashboardPage;
