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

/**
 * @swagger
 * /tires/stats:
 *   get:
 *     summary: Get tires statistics
 *     tags: [Tires]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Tires statistics
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 */
router.get("/stats", protect, adminOnly, getTiresStats);

/**
 * @swagger
 * /tires/status/{status}:
 *   get:
 *     summary: Get tires by status
 *     tags: [Tires]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: status
 *         required: true
 *         schema:
 *           type: string
 *           enum: [Bon, À remplacer, Usé]
 *         description: Tire status
 *     responses:
 *       200:
 *         description: List of tires with specified status
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Tire'
 *       401:
 *         description: Unauthorized
 */
router.get("/status/:status", protect, getTiresByStatus);

/**
 * @swagger
 * /tires/vehicle/{vehicleType}/{vehicleId}:
 *   get:
 *     summary: Get tires by vehicle
 *     tags: [Tires]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: vehicleType
 *         required: true
 *         schema:
 *           type: string
 *           enum: [Truck, Trailer]
 *         description: Type of vehicle
 *       - in: path
 *         name: vehicleId
 *         required: true
 *         schema:
 *           type: string
 *         description: Vehicle ID
 *     responses:
 *       200:
 *         description: List of tires for the vehicle
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Tire'
 *       401:
 *         description: Unauthorized
 */
router.get("/vehicle/:vehicleType/:vehicleId", protect, getTiresByVehicle);

/**
 * @swagger
 * /tires:
 *   get:
 *     summary: Get all tires
 *     tags: [Tires]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Bon, À remplacer, Usé]
 *         description: Filter by status
 *       - in: query
 *         name: brand
 *         schema:
 *           type: string
 *         description: Filter by brand
 *     responses:
 *       200:
 *         description: List of tires
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Tire'
 *       401:
 *         description: Unauthorized
 */
router.get("/", protect, getAllTires);

/**
 * @swagger
 * /tires:
 *   post:
 *     summary: Create a new tire
 *     tags: [Tires]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TireInput'
 *     responses:
 *       201:
 *         description: Tire created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tire'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 */
router.post("/", protect, createTire);

/**
 * @swagger
 * /tires/{id}:
 *   get:
 *     summary: Get tire by ID
 *     tags: [Tires]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Tire ID
 *     responses:
 *       200:
 *         description: Tire details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tire'
 *       404:
 *         description: Tire not found
 *       401:
 *         description: Unauthorized
 */
router.get("/:id", protect, getTireById);

/**
 * @swagger
 * /tires/{id}:
 *   put:
 *     summary: Update a tire
 *     tags: [Tires]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Tire ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TireInput'
 *     responses:
 *       200:
 *         description: Tire updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tire'
 *       404:
 *         description: Tire not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 */
router.put("/:id", protect, adminOnly, updateTire);

/**
 * @swagger
 * /tires/{id}/status:
 *   patch:
 *     summary: Update tire status
 *     tags: [Tires]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Tire ID
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
 *                 enum: [Bon, À remplacer, Usé]
 *     responses:
 *       200:
 *         description: Tire status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tire'
 *       404:
 *         description: Tire not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 */
router.patch("/:id/status", protect, adminOnly, updateTireStatus);

/**
 * @swagger
 * /tires/{id}:
 *   delete:
 *     summary: Delete a tire
 *     tags: [Tires]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Tire ID
 *     responses:
 *       200:
 *         description: Tire deleted successfully
 *       404:
 *         description: Tire not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 */
router.delete("/:id", protect, adminOnly, deleteTire);

export default router;
