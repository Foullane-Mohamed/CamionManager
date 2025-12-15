import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import * as maintenanceController from "../controllers/maintenanceController.js";

const router = express.Router();

// All maintenance routes require authentication and admin role
router.use(protect, adminOnly);

// ========== MAINTENANCE RULE ROUTES ==========

router.post("/rules", maintenanceController.createMaintenanceRule);
router.get("/rules", maintenanceController.getAllMaintenanceRules);
router.get("/rules/:id", maintenanceController.getMaintenanceRuleById);
router.put("/rules/:id", maintenanceController.updateMaintenanceRule);
router.delete("/rules/:id", maintenanceController.deleteMaintenanceRule);

// ========== MAINTENANCE RECORD ROUTES ==========

router.post("/", maintenanceController.createMaintenance);
router.get("/", maintenanceController.getAllMaintenances);
router.get("/stats", maintenanceController.getMaintenanceStatistics);
router.get("/:id", maintenanceController.getMaintenanceById);
router.get(
  "/vehicle/:vehicleId",
  maintenanceController.getMaintenancesByVehicle
);
router.put("/:id", maintenanceController.updateMaintenance);
router.patch("/:id/status", maintenanceController.updateMaintenanceStatus);
router.delete("/:id", maintenanceController.deleteMaintenance);

// ========== ALERT ROUTES ==========

router.get("/alerts/all", maintenanceController.checkAllMaintenanceAlerts);
router.get(
  "/alerts/vehicle/:vehicleId",
  maintenanceController.checkMaintenanceAlerts
);

export default router;
