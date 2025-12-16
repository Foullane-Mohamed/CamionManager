import express from "express";
import {
  createFuel,
  getAllFuels,
  getFuelById,
  updateFuel,
  deleteFuel,
  getFuelsByDriver,
  getFuelsByVehicle,
  getFuelsByTrip,
  getFuelsStats,
} from "../controllers/fuelController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/stats", protect, adminOnly, getFuelsStats);

router.get("/driver/:driverId", protect, getFuelsByDriver);

router.get("/vehicle/:vehicleId", protect, getFuelsByVehicle);

router.get("/trip/:tripId", protect, getFuelsByTrip);

router.get("/", protect, getAllFuels);

router.post("/", protect, createFuel);

router.get("/:id", protect, getFuelById);

router.put("/:id", protect, adminOnly, updateFuel);

router.delete("/:id", protect, adminOnly, deleteFuel);

export default router;

