import express from "express";
import {
  createTruck,
  getAllTrucks,
  getTruckById,
  updateTruck,
  updateTruckStatus,
  deleteTruck,
  getAvailableTrucks,
  getTrucksStats,
} from "../controllers/truckController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/stats", protect, adminOnly, getTrucksStats);

router.get("/available", protect, getAvailableTrucks);

router.get("/", protect, getAllTrucks);

router.post("/", protect, adminOnly, createTruck);

router.get("/:id", protect, getTruckById);

router.put("/:id", protect, adminOnly, updateTruck);

router.patch("/:id/status", protect, adminOnly, updateTruckStatus);

router.delete("/:id", protect, adminOnly, deleteTruck);

export default router;

