import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import * as maintenanceController from "../controllers/maintenanceController.js";

const router = express.Router();

// All maintenance routes require authentication and admin role
router.use(protect, adminOnly);

// ========== MAINTENANCE RULE ROUTES ==========

/**
 * @swagger
 * /maintenances/rules:
 *   post:
 *     summary: Create a new maintenance rule
 *     tags: [Maintenance]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MaintenanceRuleInput'
 *     responses:
 *       201:
 *         description: Maintenance rule created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MaintenanceRule'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 */
router.post("/rules", maintenanceController.createMaintenanceRule);

/**
 * @swagger
 * /maintenances/rules:
 *   get:
 *     summary: Get all maintenance rules
 *     tags: [Maintenance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: maintenanceType
 *         schema:
 *           type: string
 *           enum: [Tire Replacement, Oil Change, Vehicle Revision]
 *         description: Filter by maintenance type
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         description: Filter by active status
 *     responses:
 *       200:
 *         description: List of maintenance rules
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MaintenanceRule'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 */
router.get("/rules", maintenanceController.getAllMaintenanceRules);

/**
 * @swagger
 * /maintenances/rules/{id}:
 *   get:
 *     summary: Get maintenance rule by ID
 *     tags: [Maintenance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Maintenance rule ID
 *     responses:
 *       200:
 *         description: Maintenance rule details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MaintenanceRule'
 *       404:
 *         description: Maintenance rule not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 */
router.get("/rules/:id", maintenanceController.getMaintenanceRuleById);

/**
 * @swagger
 * /maintenances/rules/{id}:
 *   put:
 *     summary: Update a maintenance rule
 *     tags: [Maintenance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Maintenance rule ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MaintenanceRuleInput'
 *     responses:
 *       200:
 *         description: Maintenance rule updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MaintenanceRule'
 *       404:
 *         description: Maintenance rule not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 */
router.put("/rules/:id", maintenanceController.updateMaintenanceRule);

/**
 * @swagger
 * /maintenances/rules/{id}:
 *   delete:
 *     summary: Delete a maintenance rule
 *     tags: [Maintenance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Maintenance rule ID
 *     responses:
 *       200:
 *         description: Maintenance rule deleted successfully
 *       404:
 *         description: Maintenance rule not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 */
router.delete("/rules/:id", maintenanceController.deleteMaintenanceRule);

// ========== MAINTENANCE RECORD ROUTES ==========

/**
 * @swagger
 * /maintenances:
 *   post:
 *     summary: Create a new maintenance record
 *     tags: [Maintenance]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MaintenanceInput'
 *     responses:
 *       201:
 *         description: Maintenance record created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Maintenance'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 */
router.post("/", maintenanceController.createMaintenance);

/**
 * @swagger
 * /maintenances:
 *   get:
 *     summary: Get all maintenance records
 *     tags: [Maintenance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: maintenanceType
 *         schema:
 *           type: string
 *           enum: [Tire Replacement, Oil Change, Vehicle Revision, Other]
 *         description: Filter by maintenance type
 *       - in: query
 *         name: linkedVehicle
 *         schema:
 *           type: string
 *         description: Filter by vehicle ID
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Scheduled, In Progress, Completed, Cancelled]
 *         description: Filter by status
 *       - in: query
 *         name: isAlertTriggered
 *         schema:
 *           type: boolean
 *         description: Filter by alert triggered status
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
 *         description: List of maintenance records
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Maintenance'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 */
router.get("/", maintenanceController.getAllMaintenances);

/**
 * @swagger
 * /maintenances/stats:
 *   get:
 *     summary: Get maintenance statistics
 *     tags: [Maintenance]
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
 *         description: Maintenance statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalMaintenances:
 *                   type: number
 *                 totalCost:
 *                   type: number
 *                 byType:
 *                   type: array
 *                 byVehicle:
 *                   type: array
 *                 byStatus:
 *                   type: array
 *                 alertTriggered:
 *                   type: number
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 */
router.get("/stats", maintenanceController.getMaintenanceStatistics);

/**
 * @swagger
 * /maintenances/{id}:
 *   get:
 *     summary: Get maintenance record by ID
 *     tags: [Maintenance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Maintenance record ID
 *     responses:
 *       200:
 *         description: Maintenance record details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Maintenance'
 *       404:
 *         description: Maintenance record not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 */
router.get("/:id", maintenanceController.getMaintenanceById);

/**
 * @swagger
 * /maintenances/vehicle/{vehicleId}:
 *   get:
 *     summary: Get maintenance records by vehicle
 *     tags: [Maintenance]
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
 *         description: List of maintenance records for the vehicle
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Maintenance'
 *       404:
 *         description: Vehicle not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 */
router.get(
  "/vehicle/:vehicleId",
  maintenanceController.getMaintenancesByVehicle
);

/**
 * @swagger
 * /maintenances/{id}:
 *   put:
 *     summary: Update a maintenance record
 *     tags: [Maintenance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Maintenance record ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json
 *           schema:
 *             $ref: '#/components/schemas/MaintenanceInput'
 *     responses:
 *       200:
 *         description: Maintenance record updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Maintenance'
 *       404:
 *         description: Maintenance record not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 */
router.put("/:id", maintenanceController.updateMaintenance);

/**
 * @swagger
 * /maintenances/{id}/status:
 *   patch:
 *     summary: Update maintenance status
 *     tags: [Maintenance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Maintenance record ID
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
 *                 enum: [Scheduled, In Progress, Completed, Cancelled]
 *     responses:
 *       200:
 *         description: Maintenance status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Maintenance'
 *       404:
 *         description: Maintenance record not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 */
router.patch("/:id/status", maintenanceController.updateMaintenanceStatus);

/**
 * @swagger
 * /maintenances/{id}:
 *   delete:
 *     summary: Delete a maintenance record
 *     tags: [Maintenance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Maintenance record ID
 *     responses:
 *       200:
 *         description: Maintenance record deleted successfully
 *       404:
 *         description: Maintenance record not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 */
router.delete("/:id", maintenanceController.deleteMaintenance);

// ========== ALERT ROUTES ==========

/**
 * @swagger
 * /maintenances/alerts/all:
 *   get:
 *     summary: Check maintenance alerts for all vehicles
 *     tags: [Maintenance]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of maintenance alerts for all vehicles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   vehicleId:
 *                     type: string
 *                   vehicleMatricule:
 *                     type: string
 *                   maintenanceType:
 *                     type: string
 *                   ruleId:
 *                     type: string
 *                   alertType:
 *                     type: string
 *                     enum: [Mileage, Time, Both]
 *                   currentMileage:
 *                     type: number
 *                   lastMaintenanceDate:
 *                     type: string
 *                     format: date-time
 *                   lastMaintenanceMileage:
 *                     type: number
 *                   thresholdMileage:
 *                     type: number
 *                   thresholdDays:
 *                     type: number
 *                   message:
 *                     type: string
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 */
router.get("/alerts/all", maintenanceController.checkAllMaintenanceAlerts);

/**
 * @swagger
 * /maintenances/alerts/vehicle/{vehicleId}:
 *   get:
 *     summary: Check maintenance alerts for a specific vehicle
 *     tags: [Maintenance]
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
 *         description: List of maintenance alerts for the vehicle
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       404:
 *         description: Vehicle not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 */
router.get(
  "/alerts/vehicle/:vehicleId",
  maintenanceController.checkMaintenanceAlerts
);

export default router;
