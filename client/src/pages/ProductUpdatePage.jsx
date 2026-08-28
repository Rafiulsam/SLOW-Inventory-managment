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
    <section className="inventory-panel" aria-labelledby="inventory-title">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Live catalog</p>
          <h2 id="inventory-title">Update product details</h2>
        </div>
        {status === "ready" && (
          <span className="connection-state">Connected</span>
        )}
      </div>

      <div className="product-controls">
        <label className="search-field">
          <span>Search products</span>
          <input
            className="border border-[#c3cbc1] bg-[#fbfcf8] px-2.5 py-2.5 text-[#1d2926] shadow-none focus:outline-2 focus:outline-[#bb4b32]"
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name"
            type="search"
            value={search}
          />
        </label>
        <label className="control-field">
          <span>Stock status</span>
          <select
            className="border border-[#c3cbc1] bg-[#fbfcf8] px-2.5 py-2.5 text-[#1d2926] shadow-none focus:outline-2 focus:outline-[#bb4b32]"
            onChange={(event) => setStockFilter(event.target.value)}
            value={stockFilter}
          >
            <option value="all">All products</option>
            <option value="in">In stock</option>
            <option value="low">Low stock</option>
            <option value="out">Out of stock</option>
          </select>
        </label>
        <label className="control-field">
          <span>Sort by</span>
          <select
            className="border border-[#c3cbc1] bg-[#fbfcf8] px-2.5 py-2.5 text-[#1d2926] shadow-none focus:outline-2 focus:outline-[#bb4b32]"
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
        <p className="empty-state">Loading products...</p>
      )}
      {status === "error" && (
        <p className="empty-state error-state">
          Could not load products: {error}
        </p>
      )}
      {status === "ready" && products.length === 0 && (
        <p className="empty-state">No products found yet.</p>
      )}
      {status === "ready" &&
        products.length > 0 &&
        filteredProducts.length === 0 && (
          <p className="empty-state">No products match your filters.</p>
        )}
      {status === "ready" && filteredProducts.length > 0 && (
        <div className="product-table">
          <div className="table-header" aria-hidden="true">
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
