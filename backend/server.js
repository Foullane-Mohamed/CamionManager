import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import connectDB from "./config/db.js";
import swaggerSpec from "./config/swagger.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import truckRoutes from "./routes/truckRoutes.js";
import trailerRoutes from "./routes/trailerRoutes.js";
import tireRoutes from "./routes/tireRoutes.js";
import fuelRoutes from "./routes/fuelRoutes.js";
import tripRoutes from "./routes/tripRoutes.js";
import maintenanceRoutes from "./routes/maintenanceRoutes.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";

dotenv.config();

connectDB();

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Swagger API Documentation
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "Fleet Management API Docs",
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/trucks", truckRoutes);
app.use("/api/trailers", trailerRoutes);
app.use("/api/tires", tireRoutes);
app.use("/api/fuels", fuelRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/maintenances", maintenanceRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

// Error handling middleware (must be after routes)
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
