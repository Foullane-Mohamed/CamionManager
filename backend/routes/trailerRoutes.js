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

/**
 * @swagger
 * /trailers/stats:
 *   get:
 *     summary: Get trailers statistics
 *     tags: [Trailers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Trailers statistics
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 */
router.get("/stats", protect, adminOnly, getTrailersStats);

/**
 * @swagger
 * /trailers/available:
 *   get:
 *     summary: Get all available trailers
 *     tags: [Trailers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of available trailers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Trailer'
 *       401:
 *         description: Unauthorized
 */
router.get("/available", protect, getAvailableTrailers);

/**
 * @swagger
 * /trailers:
 *   get:
 *     summary: Get all trailers
 *     tags: [Trailers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Disponible, En Mission, En Maintenance]
 *         description: Filter by status
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [Frigo, Plateau, Fourgon, Citerne, Benne, Porte-conteneur]
 *         description: Filter by trailer type
 *     responses:
 *       200:
 *         description: List of trailers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Trailer'
 *       401:
 *         description: Unauthorized
 */
router.get("/", protect, getAllTrailers);

/**
 * @swagger
 * /trailers:
 *   post:
 *     summary: Create a new trailer
 *     tags: [Trailers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TrailerInput'
 *     responses:
 *       201:
 *         description: Trailer created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Trailer'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 */
router.post("/", protect, adminOnly, createTrailer);

/**
 * @swagger
 * /trailers/{id}:
 *   get:
 *     summary: Get trailer by ID
 *     tags: [Trailers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Trailer ID
 *     responses:
 *       200:
 *         description: Trailer details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Trailer'
 *       404:
 *         description: Trailer not found
 *       401:
 *         description: Unauthorized
 */
router.get("/:id", protect, getTrailerById);

/**
 * @swagger
 * /trailers/{id}:
 *   put:
 *     summary: Update a trailer
 *     tags: [Trailers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Trailer ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TrailerInput'
 *     responses:
 *       200:
 *         description: Trailer updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Trailer'
 *       404:
 *         description: Trailer not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 */
router.put("/:id", protect, adminOnly, updateTrailer);

/**
 * @swagger
 * /trailers/{id}/status:
 *   patch:
 *     summary: Update trailer status
 *     tags: [Trailers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Trailer ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Disponible, En Mission, En Maintenance]
 *     responses:
 *       200:
 *         description: Trailer status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Trailer'
 *       404:
 *         description: Trailer not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 */
router.patch("/:id/status", protect, adminOnly, updateTrailerStatus);

/**
 * @swagger
 * /trailers/{id}:
 *   delete:
 *     summary: Delete a trailer
 *     tags: [Trailers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Trailer ID
 *     responses:
 *       200:
 *         description: Trailer deleted successfully
 *       404:
 *         description: Trailer not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 */
router.delete("/:id", protect, adminOnly, deleteTrailer);

export default router;
