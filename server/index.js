import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import dns from "node:dns";
import productRoutes from "./routes/productRoutes.js";

const PORT = process.env.PORT || 5000;

dns.setServers([
  '1.1.1.1',
  '8.8.8.8',
])

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error);
  });


app.use("/products", productRoutes);

app.get("/", (req, res) => {
  res.send("SLOW Inventory Server is Running");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});