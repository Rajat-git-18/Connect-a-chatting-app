import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./modules/auth/auth.routes.js";
import { errorHandler } from "./errors/errorHandler.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);


app.get("/", (_, res) => {
  res.json({
    message: "Connect API is running 🚀",
  });
});

app.use(errorHandler);


const PORT = Number(process.env.PORT) || 5001;

// Bind on all interfaces so a physical phone on the same Wi‑Fi can reach the API.
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});