import { useEffect, useState } from "react";
import ProductRow from "../components/ProductRow";
import { updateFields } from "../constants/productFields";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function ProductUpdatePage() {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [stockFilter, setStockFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/products`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load products");
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

  const handleSaved = (updatedProduct) => {
    setProducts((currentProducts) =>
      currentProducts.map((product) =>
        product._id === updatedProduct._id ? updatedProduct : product,
      ),
    );
  };

  const handleDeleted = (deletedId) => {
    setProducts((currentProducts) =>
      currentProducts.filter((product) => product._id !== deletedId),
    );
  };

  const filteredProducts = products
    .filter((product) =>
      product.name.toLowerCase().includes(search.toLowerCase()),
    )
    .filter((product) => {
      const stock = Number(product.currentStock || 0);
      const limit = Number(product.lowStockLimit ?? 3);

      if (stockFilter === "out") return stock === 0;
      if (stockFilter === "low") return stock > 0 && stock <= limit;
      if (stockFilter === "in") return stock > limit;
      return true;
    })
    .sort((firstProduct, secondProduct) => {
      if (sortBy === "name") {
        return firstProduct.name.localeCompare(secondProduct.name);
      }
      return (
        Number(secondProduct[sortBy] || 0) - Number(firstProduct[sortBy] || 0)
      );
    });

  return (
    <section className="mx-auto max-w-[1400px] border-t border-[#bdc5bb]" aria-labelledby="inventory-title">
      <div className="grid grid-cols-[1fr_auto] items-center gap-6 py-7 pb-6 max-[760px]:grid-cols-1">
        <div>
          <p className="mb-3 text-[#bb4b32] text-[0.72rem] font-extrabold tracking-[0.16em] uppercase">Live catalog</p>
          <h2 className="mb-0 font-[Georgia,'Times_New_Roman',serif] text-[2rem] font-medium" id="inventory-title">Update product details</h2>
        </div>
        {status === "ready" && (
          <span className="text-[#3f765e] text-[0.78rem] font-bold uppercase">Connected</span>
        )}
      </div>

      <div className="grid grid-cols-[minmax(220px,1.5fr)_repeat(2,minmax(160px,0.65fr))] gap-4 pb-6 max-[760px]:grid-cols-1">
        <label className="grid gap-[7px] text-[#66716c] text-[0.7rem] font-extrabold tracking-[0.08em] uppercase">
          <span>Search products</span>
          <input
            className="box-border w-full rounded-[2px] border border-[#c3cbc1] bg-[#fbfcf8] px-[10px] py-[11px] text-[0.9rem] font-normal tracking-normal text-[#1d2926] normal-case shadow-none focus:border-[#bb4b32] focus:outline-2 focus:outline-[#bb4b32] focus:outline-offset-1"
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name"
            type="search"
            value={search}
          />
        </label>
        <label className="grid gap-[7px] text-[#66716c] text-[0.7rem] font-extrabold tracking-[0.08em] uppercase">
          <span>Stock status</span>
          <select
            className="box-border w-full rounded-[2px] border border-[#c3cbc1] bg-[#fbfcf8] px-[10px] py-[11px] text-[0.9rem] font-normal tracking-normal text-[#1d2926] normal-case shadow-none focus:border-[#bb4b32] focus:outline-2 focus:outline-[#bb4b32] focus:outline-offset-1"
            onChange={(event) => setStockFilter(event.target.value)}
            value={stockFilter}
          >
            <option value="all">All products</option>
            <option value="in">In stock</option>
            <option value="low">Low stock</option>
            <option value="out">Out of stock</option>
          </select>
        </label>
        <label className="grid gap-[7px] text-[#66716c] text-[0.7rem] font-extrabold tracking-[0.08em] uppercase">
          <span>Sort by</span>
          <select
            className="box-border w-full rounded-[2px] border border-[#c3cbc1] bg-[#fbfcf8] px-[10px] py-[11px] text-[0.9rem] font-normal tracking-normal text-[#1d2926] normal-case shadow-none focus:border-[#bb4b32] focus:outline-2 focus:outline-[#bb4b32] focus:outline-offset-1"
            onChange={(event) => setSortBy(event.target.value)}
            value={sortBy}
          >
            <option value="name">Name</option>
            <option value="currentStock">Current stock</option>
            <option value="purchasePrice">Purchase price</option>
            <option value="sellingPrice">Selling price</option>
          </select>
        </label>
      </div>

      {status === "loading" && (
        <p className="py-8 text-[#66716c]">Loading products...</p>
      )}
      {status === "error" && (
        <p className="py-8 text-[#bb4b32]">
          Could not load products: {error}
        </p>
      )}
      {status === "ready" && products.length === 0 && (
        <p className="py-8 text-[#66716c]">No products found yet.</p>
      )}
      {status === "ready" &&
        products.length > 0 &&
        filteredProducts.length === 0 && (
          <p className="py-8 text-[#66716c]">No products match your filters.</p>
        )}
      {status === "ready" && filteredProducts.length > 0 && (
        <div className="overflow-x-auto border-t border-[#d6dbd2]">
          <div className="grid min-w-[900px] grid-cols-[minmax(170px,1.25fr)_repeat(3,minmax(125px,1fr))_minmax(140px,0.9fr)] items-center gap-[18px] py-[18px] text-[#768078] text-[0.7rem] font-extrabold tracking-[0.08em] uppercase" aria-hidden="true">
            <span>Product</span>
            {updateFields.map((field) => (
              <span key={field.key}>{field.label}</span>
            ))}
            <span />
          </div>
          {filteredProducts.map((product) => (
            <ProductRow
              key={product._id}
              onDeleted={handleDeleted}
              onSaved={handleSaved}
              product={product}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default ProductUpdatePage;
