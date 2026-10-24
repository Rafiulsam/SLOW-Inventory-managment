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
    <section className="mx-auto max-w-[1400px]" aria-labelledby="dashboard-title">
      <div className="flex items-end justify-between gap-6 pb-8 max-[760px]:flex-col max-[760px]:items-start">
        <div>
          <p className="mb-3 text-[#bb4b32] text-[0.72rem] font-extrabold tracking-[0.16em] uppercase">Overview</p>
          <h2 className="mb-0 font-[Georgia,'Times_New_Roman',serif] text-[clamp(2rem,4vw,3.6rem)] font-medium" id="dashboard-title">Inventory at a glance</h2>
        </div>
        {status === "ready" && (
          <span className="text-[#3f765e] text-[0.78rem] font-bold uppercase">Updated now</span>
        )}
      </div>

      {status === "loading" && (
        <p className="py-8 text-[#66716c]">Loading dashboard...</p>
      )}
      {status === "error" && (
        <p className="py-8 text-[#bb4b32]">
          Could not load dashboard: {error}
        </p>
      )}
      {status === "ready" && (
        <div className="grid grid-cols-12 gap-4 max-[760px]:grid-cols-2">
          {metrics.map((metric, index) => (
            <article
              className={`flex min-h-[170px] flex-col justify-between border-t-4 bg-[#fbfcf8] p-[22px] ${
                index === 4
                  ? "col-span-6 border-t-[#3f765e] max-[760px]:col-span-full"
                  : `col-span-3 border-t-[#1d2926] max-[760px]:col-span-1 ${
                      index === 2 || index === 3 ? "border-t-[#bb4b32]" : ""
                    }`
              }`}
              key={metric.label}
            >
              <span className="text-[#66716c] text-[0.76rem] font-extrabold tracking-[0.08em] uppercase">{metric.label}</span>
              <strong className="text-[#1d2926] font-[Georgia,'Times_New_Roman',serif] text-[clamp(2.5rem,5vw,4.8rem)] font-medium leading-[0.9]">{metric.value}</strong>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default DashboardPage;
