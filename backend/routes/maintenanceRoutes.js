import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import * as maintenanceController from "../controllers/maintenanceController.js";

const router = express.Router();

// ========== MAINTENANCE RULE ROUTES (Admin Only) ==========

router.post("/rules", protect, adminOnly, maintenanceController.createMaintenanceRule);

router.get("/rules", protect, adminOnly, maintenanceController.getAllMaintenanceRules);

router.get("/rules/:id", protect, adminOnly, maintenanceController.getMaintenanceRuleById);

router.put("/rules/:id", protect, adminOnly, maintenanceController.updateMaintenanceRule);

router.delete("/rules/:id", protect, adminOnly, maintenanceController.deleteMaintenanceRule);

// ========== MAINTENANCE RECORD ROUTES ==========

router.post("/", protect, maintenanceController.createMaintenance);

router.get("/", protect, maintenanceController.getAllMaintenances);

router.get("/stats", protect, adminOnly, maintenanceController.getMaintenanceStatistics);

router.get("/:id", protect, maintenanceController.getMaintenanceById);

router.get(
  "/vehicle/:vehicleId",
  protect,
  maintenanceController.getMaintenancesByVehicle
);

router.put("/:id", protect, adminOnly, maintenanceController.updateMaintenance);

router.patch("/:id/status", protect, maintenanceController.updateMaintenanceStatus);

router.delete("/:id", protect, adminOnly, maintenanceController.deleteMaintenance);

// ========== ALERT ROUTES ==========

router.get("/alerts/all", protect, maintenanceController.checkAllMaintenanceAlerts);

router.get(
  "/alerts/vehicle/:vehicleId",
  protect,
  maintenanceController.checkMaintenanceAlerts
);

export default router;

