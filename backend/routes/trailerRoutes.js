import express from "express";
import {
  createTrailer,
  getAllTrailers,
  getTrailerById,
  updateTrailer,
  updateTrailerStatus,
  deleteTrailer,
  getAvailableTrailers,
  getTrailersStats,
} from "../controllers/trailerController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/stats", protect, adminOnly, getTrailersStats);

router.get("/available", protect, getAvailableTrailers);

router.get("/", protect, getAllTrailers);

router.post("/", protect, adminOnly, createTrailer);

router.get("/:id", protect, getTrailerById);

router.put("/:id", protect, adminOnly, updateTrailer);

router.patch("/:id/status", protect, adminOnly, updateTrailerStatus);

router.delete("/:id", protect, adminOnly, deleteTrailer);

export default router;
