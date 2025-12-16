import express from "express";
import {
  createTire,
  getAllTires,
  getTireById,
  updateTire,
  updateTireStatus,
  deleteTire,
  getTiresByVehicle,
  getTiresByStatus,
  getTiresStats,
} from "../controllers/tireController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/stats", protect, adminOnly, getTiresStats);
router.get("/status/:status", protect, getTiresByStatus);
router.get("/vehicle/:vehicleType/:vehicleId", protect, getTiresByVehicle);
router.get("/", protect, getAllTires);
router.post("/", protect, createTire);
router.get("/:id", protect, getTireById);
router.put("/:id", protect, adminOnly, updateTire);
router.patch("/:id/status", protect, adminOnly, updateTireStatus);
router.delete("/:id", protect, adminOnly, deleteTire);

export default router;

