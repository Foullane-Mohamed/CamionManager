import * as maintenanceService from "../services/maintenanceService.js";
import {
  createMaintenanceRuleValidator,
  updateMaintenanceRuleValidator,
  createMaintenanceValidator,
  updateMaintenanceValidator,
  updateMaintenanceStatusValidator,
} from "../validators/maintenanceValidator.js";

// ========== MAINTENANCE RULE CONTROLLERS (Admin Only) ==========

// Create a new maintenance rule
export const createMaintenanceRule = async (req, res) => {
  try {
    // Validate input
    const { error } = createMaintenanceRuleValidator(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    // Add createdBy field
    const ruleData = {
      ...req.body,
      createdBy: req.user.userId,
    };

    const rule = await maintenanceService.createMaintenanceRule(ruleData);

    res.status(201).json({
      success: true,
      message: "Maintenance rule created successfully",
      data: rule,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating maintenance rule",
      error: error.message,
    });
  }
};

// Get all maintenance rules
export const getAllMaintenanceRules = async (req, res) => {
  try {
    const filters = {
      maintenanceType: req.query.maintenanceType,
      isActive: req.query.isActive,
    };

    const rules = await maintenanceService.getAllMaintenanceRules(filters);

    res.status(200).json({
      success: true,
      count: rules.length,
      data: rules,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching maintenance rules",
      error: error.message,
    });
  }
};

// Get a single maintenance rule by ID
export const getMaintenanceRuleById = async (req, res) => {
  try {
    const rule = await maintenanceService.getMaintenanceRuleById(req.params.id);

    res.status(200).json({
      success: true,
      data: rule,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// Update a maintenance rule
export const updateMaintenanceRule = async (req, res) => {
  try {
    // Validate input
    const { error } = updateMaintenanceRuleValidator(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const rule = await maintenanceService.updateMaintenanceRule(
      req.params.id,
      req.body,
      req.user.userId
    );

    res.status(200).json({
      success: true,
      message: "Maintenance rule updated successfully",
      data: rule,
    });
  } catch (error) {
    res
      .status(error.message === "Maintenance rule not found" ? 404 : 500)
      .json({
        success: false,
        message: error.message,
      });
  }
};

// Delete a maintenance rule
export const deleteMaintenanceRule = async (req, res) => {
  try {
    await maintenanceService.deleteMaintenanceRule(req.params.id);

    res.status(200).json({
      success: true,
      message: "Maintenance rule deleted successfully",
    });
  } catch (error) {
    res
      .status(error.message === "Maintenance rule not found" ? 404 : 500)
      .json({
        success: false,
        message: error.message,
      });
  }
};

// ========== MAINTENANCE RECORD CONTROLLERS (Admin Only) ==========

// Create a new maintenance record
export const createMaintenance = async (req, res) => {
  try {
    // Validate input
    const { error } = createMaintenanceValidator(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const maintenance = await maintenanceService.createMaintenance(
      req.body,
      req.user.userId
    );

    res.status(201).json({
      success: true,
      message: "Maintenance record created successfully",
      data: maintenance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating maintenance record",
      error: error.message,
    });
  }
};

// Get all maintenance records
export const getAllMaintenances = async (req, res) => {
  try {
    const filters = {
      maintenanceType: req.query.maintenanceType,
      linkedVehicle: req.query.linkedVehicle,
      status: req.query.status,
      isAlertTriggered: req.query.isAlertTriggered,
      startDate: req.query.startDate,
      endDate: req.query.endDate,
    };

    const maintenances = await maintenanceService.getAllMaintenances(filters);

    res.status(200).json({
      success: true,
      count: maintenances.length,
      data: maintenances,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching maintenance records",
      error: error.message,
    });
  }
};

// Get a single maintenance record by ID
export const getMaintenanceById = async (req, res) => {
  try {
    const maintenance = await maintenanceService.getMaintenanceById(
      req.params.id
    );

    res.status(200).json({
      success: true,
      data: maintenance,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// Get maintenance records by vehicle
export const getMaintenancesByVehicle = async (req, res) => {
  try {
    const maintenances = await maintenanceService.getMaintenancesByVehicle(
      req.params.vehicleId
    );

    res.status(200).json({
      success: true,
      count: maintenances.length,
      data: maintenances,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// Update a maintenance record
export const updateMaintenance = async (req, res) => {
  try {
    // Validate input
    const { error } = updateMaintenanceValidator(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const maintenance = await maintenanceService.updateMaintenance(
      req.params.id,
      req.body,
      req.user.userId
    );

    res.status(200).json({
      success: true,
      message: "Maintenance record updated successfully",
      data: maintenance,
    });
  } catch (error) {
    res
      .status(error.message === "Maintenance record not found" ? 404 : 500)
      .json({
        success: false,
        message: error.message,
      });
  }
};

// Update maintenance status
export const updateMaintenanceStatus = async (req, res) => {
  try {
    // Validate input
    const { error } = updateMaintenanceStatusValidator(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const maintenance = await maintenanceService.updateMaintenanceStatus(
      req.params.id,
      req.body.status
    );

    res.status(200).json({
      success: true,
      message: "Maintenance status updated successfully",
      data: maintenance,
    });
  } catch (error) {
    res
      .status(error.message === "Maintenance record not found" ? 404 : 500)
      .json({
        success: false,
        message: error.message,
      });
  }
};

// Delete a maintenance record
export const deleteMaintenance = async (req, res) => {
  try {
    await maintenanceService.deleteMaintenance(req.params.id);

    res.status(200).json({
      success: true,
      message: "Maintenance record deleted successfully",
    });
  } catch (error) {
    res
      .status(error.message === "Maintenance record not found" ? 404 : 500)
      .json({
        success: false,
        message: error.message,
      });
  }
};

// ========== ALERT CONTROLLERS (Admin Only) ==========

// Check maintenance alerts for a specific vehicle
export const checkMaintenanceAlerts = async (req, res) => {
  try {
    const alerts = await maintenanceService.checkMaintenanceAlerts(
      req.params.vehicleId
    );

    res.status(200).json({
      success: true,
      count: alerts.length,
      data: alerts,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// Check maintenance alerts for all vehicles
export const checkAllMaintenanceAlerts = async (req, res) => {
  try {
    const alerts = await maintenanceService.checkAllMaintenanceAlerts();

    res.status(200).json({
      success: true,
      count: alerts.length,
      data: alerts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error checking maintenance alerts",
      error: error.message,
    });
  }
};

// Get maintenance statistics
export const getMaintenanceStatistics = async (req, res) => {
  try {
    const filters = {
      startDate: req.query.startDate,
      endDate: req.query.endDate,
    };

    const stats = await maintenanceService.getMaintenanceStatistics(filters);

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching maintenance statistics",
      error: error.message,
    });
  }
};
