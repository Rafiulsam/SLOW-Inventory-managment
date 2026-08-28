export const updateFields = [
  { key: "currentStock", label: "Current stock", step: "1" },
  { key: "purchasePrice", label: "Purchase price", step: "0.01" },
  { key: "sellingPrice", label: "Selling price", step: "0.01" },
];

export const productFields = [
  ...updateFields,
  { key: "lowStockLimit", label: "Low-stock limit", step: "1" },
];
