import express from "express";
import {
  createTrip,
  getAllTrips,
  getTripById,
  updateTrip,
  updateTripStatus,
  deleteTrip,
  getTripsByDriver,
  getTripsByTruck,
  getTripsByStatus,
  getTripsStats,
  generateMissionOrderPDF,
} from "../controllers/tripController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/stats", protect, adminOnly, getTripsStats);

router.get("/status/:status", protect, getTripsByStatus);

router.get("/driver/:driverId", protect, getTripsByDriver);

router.get("/truck/:truckId", protect, getTripsByTruck);

router.get("/:id/pdf", protect, generateMissionOrderPDF);

router.get("/", protect, getAllTrips);

router.post("/", protect, adminOnly, createTrip);

router.get("/:id", protect, getTripById);

router.put("/:id", protect, adminOnly, updateTrip);

router.patch("/:id/status", protect, adminOnly, updateTripStatus);

router.delete("/:id", protect, adminOnly, deleteTrip);

export default router;

