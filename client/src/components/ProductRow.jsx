import { useState } from "react";
import { FaTrashCan } from "react-icons/fa6";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { updateFields } from "../constants/productFields";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function ProductRow({ onDeleted, onSaved, product }) {
  const [values, setValues] = useState(() =>
    updateFields.reduce(
      (fields, field) => ({ ...fields, [field.key]: product[field.key] ?? 0 }),
      {},
    ),
  );
  const [status, setStatus] = useState("idle");

  const updateValue = (key, value) => {
    setValues((currentValues) => ({ ...currentValues, [key]: value }));
    setStatus("idle");
  };

  const saveProduct = async (event) => {
    event.preventDefault();
    setStatus("saving");

    try {
      const response = await fetch(`${API_URL}/products/${product._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          Object.fromEntries(
            updateFields.map(({ key }) => [key, Number(values[key])]),
          ),
        ),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to update product");
      }

      setValues(
        updateFields.reduce(
          (fields, field) => ({
            ...fields,
            [field.key]: data[field.key] ?? values[field.key],
          }),
          {},
        ),
      );
      setStatus("saved");

      onSaved(data);
      await Swal.fire({
        icon: "success",
        timer: 1600,
        showConfirmButton: false,
        text: `${product.name} was updated successfully.`,
        title: "Saved",
      });
    } catch (error) {
      setStatus("error");

      await Swal.fire({
        icon: "error",
        text: error.message,
        title: "Update failed",
      });
    }
  };

  const deleteProduct = async () => {
    const result = await Swal.fire({
      cancelButtonText: "Keep product",
      confirmButtonColor: "#bb4b32",
      confirmButtonText: "Delete product",
      icon: "warning",
      showCancelButton: true,
      text: "This action cannot be undone.",
      title: `Delete ${product.name}?`,
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/products/${product._id}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to delete product");
      }

      onDeleted(product._id);
      await Swal.fire({
        icon: "success",
        timer: 1600,
        showConfirmButton: false,
        text: `${product.name} was removed.`,
        title: "Product deleted",
      });
    } catch (error) {
      setStatus("error");

      await Swal.fire({
        icon: "error",
        text: error.message,
        title: "Delete failed",
      });
    }
  };

  return (
    <form className="grid min-w-[900px] grid-cols-[minmax(170px,1.25fr)_repeat(3,minmax(125px,1fr))_minmax(140px,0.9fr)] items-center gap-[18px] border-t border-[#d6dbd2] py-[18px]" onSubmit={saveProduct}>
      <div className="grid gap-[5px]">
        <strong className="text-[0.98rem]">{product.name}</strong>
        <span className="text-[#768078] text-[0.8rem]">{product.unit || "piece"}</span>
      </div>
      {updateFields.map((field) => (
        <label key={field.key}>
          <span className="hidden">{field.label}</span>
          <input
            className="box-border w-full rounded-[2px] border border-[#c3cbc1] bg-[#fbfcf8] px-[10px] py-[11px] text-[#1d2926] shadow-none focus:border-[#bb4b32] focus:outline-2 focus:outline-[#bb4b32] focus:outline-offset-1"
            aria-label={`${field.label} for ${product.name}`}
            min="0"
            onChange={(event) => updateValue(field.key, event.target.value)}
            required
            step={field.step}
            type="number"
            value={values[field.key]}
          />
        </label>
      ))}
      <div className="flex justify-items-start gap-[7px]">
        <button
          className="bg-[#1d2926] p-2 rounded-md text-xs font-bold text-[#fffaf1] transition-colors hover:bg-[#bb4b32] disabled:cursor-wait disabled:opacity-60 cursor-pointer"
          disabled={status === "saving"}
          type="submit"
        >
          {status === "saving" ? "Saving..." : "Save Changes"}
        </button>
        <div className="flex flex-wrap items-center gap-[10px]">
          <Link
            className="rounded-md bg-[#dde2de] p-2 text-center text-[#716666] text-[0.72rem] [font-family:inherit] font-bold no-underline hover:bg-gray-300 hover:text-[#1d2926]"
            to={`/products/${product._id}`}
          >
            View Details
          </Link>
        </div>
        <button className="cursor-pointer border-0 bg-transparent p-0 text-[#f50707] hover:text-[#bb4b32]" onClick={deleteProduct} type="button">
          <FaTrashCan size={25} />
        </button>
      </div>
    </form>
  );
}

export default ProductRow;
