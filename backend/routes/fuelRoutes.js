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

/**
 * @swagger
 * /fuels/stats:
 *   get:
 *     summary: Get fuel consumption statistics
 *     tags: [Fuel]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for statistics
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for statistics
 *     responses:
 *       200:
 *         description: Fuel statistics
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 */
router.get("/stats", protect, adminOnly, getFuelsStats);

/**
 * @swagger
 * /fuels/driver/{driverId}:
 *   get:
 *     summary: Get fuel records by driver
 *     tags: [Fuel]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: driverId
 *         required: true
 *         schema:
 *           type: string
 *         description: Driver ID
 *     responses:
 *       200:
 *         description: List of fuel records for the driver
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Fuel'
 *       401:
 *         description: Unauthorized
 */
router.get("/driver/:driverId", protect, getFuelsByDriver);

/**
 * @swagger
 * /fuels/vehicle/{vehicleId}:
 *   get:
 *     summary: Get fuel records by vehicle
 *     tags: [Fuel]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: vehicleId
 *         required: true
 *         schema:
 *           type: string
 *         description: Vehicle ID
 *     responses:
 *       200:
 *         description: List of fuel records for the vehicle
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Fuel'
 *       401:
 *         description: Unauthorized
 */
router.get("/vehicle/:vehicleId", protect, getFuelsByVehicle);

/**
 * @swagger
 * /fuels/trip/{tripId}:
 *   get:
 *     summary: Get fuel records by trip
 *     tags: [Fuel]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tripId
 *         required: true
 *         schema:
 *           type: string
 *         description: Trip ID
 *     responses:
 *       200:
 *         description: List of fuel records for the trip
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Fuel'
 *       401:
 *         description: Unauthorized
 */
router.get("/trip/:tripId", protect, getFuelsByTrip);

/**
 * @swagger
 * /fuels:
 *   get:
 *     summary: Get all fuel records
 *     tags: [Fuel]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by start date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by end date
 *     responses:
 *       200:
 *         description: List of fuel records
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Fuel'
 *       401:
 *         description: Unauthorized
 */
router.get("/", protect, getAllFuels);

/**
 * @swagger
 * /fuels:
 *   post:
 *     summary: Create a new fuel record
 *     tags: [Fuel]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FuelInput'
 *     responses:
 *       201:
 *         description: Fuel record created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Fuel'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 */
router.post("/", protect, adminOnly, createFuel);

/**
 * @swagger
 * /fuels/{id}:
 *   get:
 *     summary: Get fuel record by ID
 *     tags: [Fuel]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Fuel record ID
 *     responses:
 *       200:
 *         description: Fuel record details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Fuel'
 *       404:
 *         description: Fuel record not found
 *       401:
 *         description: Unauthorized
 */
router.get("/:id", protect, getFuelById);

/**
 * @swagger
 * /fuels/{id}:
 *   put:
 *     summary: Update a fuel record
 *     tags: [Fuel]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Fuel record ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FuelInput'
 *     responses:
 *       200:
 *         description: Fuel record updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Fuel'
 *       404:
 *         description: Fuel record not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 */
router.put("/:id", protect, adminOnly, updateFuel);

/**
 * @swagger
 * /fuels/{id}:
 *   delete:
 *     summary: Delete a fuel record
 *     tags: [Fuel]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Fuel record ID
 *     responses:
 *       200:
 *         description: Fuel record deleted successfully
 *       404:
 *         description: Fuel record not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 */
router.delete("/:id", protect, adminOnly, deleteFuel);

export default router;
