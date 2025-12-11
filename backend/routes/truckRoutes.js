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

/**
 * @swagger
 * /trucks/stats:
 *   get:
 *     summary: Get trucks statistics
 *     tags: [Trucks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Trucks statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: number
 *                 available:
 *                   type: number
 *                 inMission:
 *                   type: number
 *                 inMaintenance:
 *                   type: number
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 */
router.get("/stats", protect, adminOnly, getTrucksStats);

/**
 * @swagger
 * /trucks/available:
 *   get:
 *     summary: Get all available trucks
 *     tags: [Trucks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of available trucks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Truck'
 *       401:
 *         description: Unauthorized
 */
router.get("/available", protect, getAvailableTrucks);

/**
 * @swagger
 * /trucks:
 *   get:
 *     summary: Get all trucks
 *     tags: [Trucks]
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
 *         name: brand
 *         schema:
 *           type: string
 *         description: Filter by brand
 *       - in: query
 *         name: fuelType
 *         schema:
 *           type: string
 *           enum: [Diesel, Gasoline, Other]
 *         description: Filter by fuel type
 *     responses:
 *       200:
 *         description: List of trucks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Truck'
 *       401:
 *         description: Unauthorized
 */
router.get("/", protect, getAllTrucks);

/**
 * @swagger
 * /trucks:
 *   post:
 *     summary: Create a new truck
 *     tags: [Trucks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TruckInput'
 *     responses:
 *       201:
 *         description: Truck created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Truck'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 */
router.post("/", protect, adminOnly, createTruck);

/**
 * @swagger
 * /trucks/{id}:
 *   get:
 *     summary: Get truck by ID
 *     tags: [Trucks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Truck ID
 *     responses:
 *       200:
 *         description: Truck details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Truck'
 *       404:
 *         description: Truck not found
 *       401:
 *         description: Unauthorized
 */
router.get("/:id", protect, getTruckById);

/**
 * @swagger
 * /trucks/{id}:
 *   put:
 *     summary: Update a truck
 *     tags: [Trucks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Truck ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TruckInput'
 *     responses:
 *       200:
 *         description: Truck updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Truck'
 *       404:
 *         description: Truck not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 */
router.put("/:id", protect, adminOnly, updateTruck);

/**
 * @swagger
 * /trucks/{id}/status:
 *   patch:
 *     summary: Update truck status
 *     tags: [Trucks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Truck ID
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
 *         description: Truck status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Truck'
 *       404:
 *         description: Truck not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 */
router.patch("/:id/status", protect, adminOnly, updateTruckStatus);

/**
 * @swagger
 * /trucks/{id}:
 *   delete:
 *     summary: Delete a truck
 *     tags: [Trucks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Truck ID
 *     responses:
 *       200:
 *         description: Truck deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Truck not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 */
router.delete("/:id", protect, adminOnly, deleteTruck);

export default router;
