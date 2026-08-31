import "dotenv/config";
import express from "express";
import cors from "cors";

import authRoutes from "./modules/auth/auth.routes.js";
import { errorHandler } from "./errors/errorHandler.js";
import threadRoutes from "./modules/thread/thread.routes.js";
import userRoutes from "./modules/user/user.routes.js";
import getToKnowMeRoutes from "./modules/getToKnowMe/getToKnowMe.routes.js";
import connectionRoutes from "./modules/connection/connection.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/threads", threadRoutes);

app.use("/api/users", userRoutes);

app.use("/api/get-to-know-me", getToKnowMeRoutes);

app.use("/api/connections", connectionRoutes);


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