import { useState } from "react";
import Swal from "sweetalert2";
import { productFields } from "../constants/productFields";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const initialValues = {
  name: "",
  unit: "piece",
  currentStock: 0,
  purchasePrice: 0,
  sellingPrice: 0,
  lowStockLimit: 3,
};

function ProductAddPage() {
  const [values, setValues] = useState(initialValues);
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const updateValue = (key, value) => {
    setValues((currentValues) => ({ ...currentValues, [key]: value }));
    setStatus("idle");
    setMessage("");
  };

  const addProduct = async (event) => {
    event.preventDefault();
    setStatus("saving");
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          unit: values.unit,
          ...Object.fromEntries(
            productFields.map(({ key }) => [key, Number(values[key])]),
          ),
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to add product");
      }

      setValues(initialValues);
      setStatus("saved");
      setMessage("");
      await Swal.fire({
        icon: "success",
        timer: 1800,
        showConfirmButton: false,
        text: `${values.name} is now in your catalog.`,
        title: "Product added",
      });
    } catch (error) {
      setStatus("error");
      setMessage("");
      await Swal.fire({
        icon: "error",
        text: error.message,
        title: "Could not add product",
      });
    }
  };

  return (
    <section className="form-panel" aria-labelledby="add-product-title">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">New catalog entry</p>
          <h2 id="add-product-title">Add a product</h2>
        </div>
      </div>

      <form className="product-form" onSubmit={addProduct}>
        <label className="form-field">
          <span>Product name</span>
          <input
            className="border border-[#c3cbc1] bg-[#fbfcf8] px-3 py-3 text-[#1d2926] shadow-none focus:outline-2 focus:outline-[#bb4b32]"
            onChange={(event) => updateValue("name", event.target.value)}
            required
            type="text"
            value={values.name}
          />
        </label>
        <label className="form-field">
          <span>Unit</span>
          <input
            className="border border-[#c3cbc1] bg-[#fbfcf8] px-3 py-3 text-[#1d2926] shadow-none focus:outline-2 focus:outline-[#bb4b32]"
            onChange={(event) => updateValue("unit", event.target.value)}
            required
            type="text"
            value={values.unit}
          />
        </label>
        {productFields.map((field) => (
          <label className="form-field" key={field.key}>
            <span>{field.label}</span>
            <input
              className="border border-[#c3cbc1] bg-[#fbfcf8] px-3 py-3 text-[#1d2926] shadow-none focus:outline-2 focus:outline-[#bb4b32]"
              min="0"
              onChange={(event) => updateValue(field.key, event.target.value)}
              required
              step={field.step}
              type="number"
              value={values[field.key]}
            />
          </label>
        ))}
        <div className="form-actions">
          <button
            className="bg-[#1d2926] px-4.5 py-3 font-bold text-[#fffaf1] transition-colors hover:bg-[#bb4b32] disabled:cursor-wait disabled:opacity-60"
            disabled={status === "saving"}
            type="submit"
          >
            {status === "saving" ? "Adding..." : "Add product"}
          </button>
          <span className={`save-status ${status}`} role="status">
            {message}
          </span>
        </div>
      </form>
    </section>
  );
}

export default ProductAddPage;
