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
    <section className="mx-auto max-w-[900px] border-t border-[#bdc5bb]" aria-labelledby="add-product-title">
      <div className="grid grid-cols-[1fr_auto] items-center gap-6 py-7 pb-6 max-[760px]:grid-cols-1">
        <div>
          <p className="mb-3 text-[#bb4b32] text-[0.72rem] font-extrabold tracking-[0.16em] uppercase">New catalog entry</p>
          <h2 className="mb-0 font-[Georgia,'Times_New_Roman',serif] text-[2rem] font-medium" id="add-product-title">Add a product</h2>
        </div>
      </div>

      <form className="grid grid-cols-2 gap-6 pt-2 max-[760px]:grid-cols-1" onSubmit={addProduct}>
        <label className="grid gap-2 text-[#66716c] text-[0.75rem] font-bold tracking-[0.04em] uppercase">
          <span>Product name</span>
          <input
            className="box-border w-full rounded-[2px] border border-[#c3cbc1] bg-[#fbfcf8] px-3 py-[13px] text-[0.95rem] font-normal tracking-normal text-[#1d2926] normal-case shadow-none focus:border-[#bb4b32] focus:outline-2 focus:outline-[#bb4b32] focus:outline-offset-1"
            onChange={(event) => updateValue("name", event.target.value)}
            required
            type="text"
            value={values.name}
          />
        </label>
        <label className="grid gap-2 text-[#66716c] text-[0.75rem] font-bold tracking-[0.04em] uppercase">
          <span>Unit</span>
          <input
            className="box-border w-full rounded-[2px] border border-[#c3cbc1] bg-[#fbfcf8] px-3 py-[13px] text-[0.95rem] font-normal tracking-normal text-[#1d2926] normal-case shadow-none focus:border-[#bb4b32] focus:outline-2 focus:outline-[#bb4b32] focus:outline-offset-1"
            onChange={(event) => updateValue("unit", event.target.value)}
            required
            type="text"
            value={values.unit}
          />
        </label>
        {productFields.map((field) => (
          <label className="grid gap-2 text-[#66716c] text-[0.75rem] font-bold tracking-[0.04em] uppercase" key={field.key}>
            <span>{field.label}</span>
            <input
              className="box-border w-full rounded-[2px] border border-[#c3cbc1] bg-[#fbfcf8] px-3 py-[13px] text-[0.95rem] font-normal tracking-normal text-[#1d2926] normal-case shadow-none focus:border-[#bb4b32] focus:outline-2 focus:outline-[#bb4b32] focus:outline-offset-1"
              min="0"
              onChange={(event) => updateValue(field.key, event.target.value)}
              required
              step={field.step}
              type="number"
              value={values[field.key]}
            />
          </label>
        ))}
        <div className="col-span-full flex items-center gap-4 pt-2 max-[760px]:flex-col max-[760px]:items-start">
          <button
            className="cursor-pointer rounded-[2px] border-0 bg-[#1d2926] px-[18px] py-[13px] text-[#fffaf1] [font-family:inherit] font-bold transition-colors enabled:hover:bg-[#bb4b32] disabled:cursor-wait disabled:opacity-60"
            disabled={status === "saving"}
            type="submit"
          >
            {status === "saving" ? "Adding..." : "Add product"}
          </button>
          <span className={`min-h-[1em] text-[#3f765e] text-[0.72rem] ${status === "error" ? "text-[#bb4b32]" : ""}`} role="status">
            {message}
          </span>
        </div>
      </form>
    </section>
  );
}

export default ProductAddPage;
