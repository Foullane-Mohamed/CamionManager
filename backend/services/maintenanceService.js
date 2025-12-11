import Maintenance from "../models/Maintenance.js";
import MaintenanceRule from "../models/MaintenanceRule.js";
import Truck from "../models/Truck.js";


export const createMaintenanceRule = async (ruleData) => {
  const rule = new MaintenanceRule(ruleData);
  await rule.save();
  return rule;
};

export const getAllMaintenanceRules = async (filters = {}) => {
  const query = {};

  if (filters.maintenanceType) {
    query.maintenanceType = filters.maintenanceType;
  }

  if (filters.isActive !== undefined) {
    query.isActive = filters.isActive === "true" || filters.isActive === true;
  }

  const rules = await MaintenanceRule.find(query)
    .populate("createdBy", "firstName lastName email")
    .populate("lastModifiedBy", "firstName lastName email")
    .sort({ createdAt: -1 });

  return rules;
};

export const getMaintenanceRuleById = async (ruleId) => {
  const rule = await MaintenanceRule.findById(ruleId)
    .populate("createdBy", "firstName lastName email")
    .populate("lastModifiedBy", "firstName lastName email");

  if (!rule) {
    throw new Error("Maintenance rule not found");
  }

  return rule;
};

export const updateMaintenanceRule = async (ruleId, updateData, userId) => {
  const rule = await MaintenanceRule.findById(ruleId);

  if (!rule) {
    throw new Error("Maintenance rule not found");
  }

  Object.keys(updateData).forEach((key) => {
    rule[key] = updateData[key];
  });

  rule.lastModifiedBy = userId;
  await rule.save();

  return rule;
};

export const deleteMaintenanceRule = async (ruleId) => {
  const rule = await MaintenanceRule.findByIdAndDelete(ruleId);

  if (!rule) {
    throw new Error("Maintenance rule not found");
  }

  return rule;
};


export const createMaintenance = async (maintenanceData, userId) => {
  const vehicle = await Truck.findById(maintenanceData.linkedVehicle);
  if (!vehicle) {
    throw new Error("Linked vehicle not found");
  }

  if (maintenanceData.linkedRule) {
    const rule = await MaintenanceRule.findById(maintenanceData.linkedRule);
    if (!rule) {
      throw new Error("Linked maintenance rule not found");
    }
  }

  if (maintenanceData.vehicleMileageAtMaintenance < vehicle.currentMileage) {
    throw new Error(
      "Maintenance mileage cannot be less than vehicle's current mileage"
    );
  }

  maintenanceData.performedBy = userId;

  const maintenance = new Maintenance(maintenanceData);
  await maintenance.save();

  if (maintenanceData.vehicleMileageAtMaintenance > vehicle.currentMileage) {
    vehicle.currentMileage = maintenanceData.vehicleMileageAtMaintenance;
    await vehicle.save();
  }

  return maintenance;
};

export const getAllMaintenances = async (filters = {}) => {
  const query = {};

  if (filters.maintenanceType) {
    query.maintenanceType = filters.maintenanceType;
  }

  if (filters.linkedVehicle) {
    query.linkedVehicle = filters.linkedVehicle;
  }

  if (filters.status) {
    query.status = filters.status;
  }

  if (filters.isAlertTriggered !== undefined) {
    query.isAlertTriggered =
      filters.isAlertTriggered === "true" || filters.isAlertTriggered === true;
  }

  if (filters.startDate || filters.endDate) {
    query.maintenanceDate = {};
    if (filters.startDate) {
      query.maintenanceDate.$gte = new Date(filters.startDate);
    }
    if (filters.endDate) {
      query.maintenanceDate.$lte = new Date(filters.endDate);
    }
  }

  const maintenances = await Maintenance.find(query)
    .populate("linkedVehicle", "matricule brand model")
    .populate("linkedRule", "maintenanceType description")
    .populate("performedBy", "firstName lastName email")
    .sort({ maintenanceDate: -1 });

  return maintenances;
};

export const getMaintenanceById = async (maintenanceId) => {
  const maintenance = await Maintenance.findById(maintenanceId)
    .populate("linkedVehicle", "matricule brand model currentMileage")
    .populate(
      "linkedRule",
      "maintenanceType mileageThreshold timeThresholdDays"
    )
    .populate("performedBy", "firstName lastName email");

  if (!maintenance) {
    throw new Error("Maintenance record not found");
  }

  return maintenance;
};

export const getMaintenancesByVehicle = async (vehicleId) => {
  const vehicle = await Truck.findById(vehicleId);
  if (!vehicle) {
    throw new Error("Vehicle not found");
  }

  const maintenances = await Maintenance.find({ linkedVehicle: vehicleId })
    .populate("linkedRule", "maintenanceType description")
    .populate("performedBy", "firstName lastName email")
    .sort({ maintenanceDate: -1 });

  return maintenances;
};

export const updateMaintenance = async (maintenanceId, updateData, userId) => {
  const maintenance = await Maintenance.findById(maintenanceId);

  if (!maintenance) {
    throw new Error("Maintenance record not found");
  }

  if (updateData.linkedVehicle) {
    const vehicle = await Truck.findById(updateData.linkedVehicle);
    if (!vehicle) {
      throw new Error("Linked vehicle not found");
    }
  }

  if (updateData.linkedRule) {
    const rule = await MaintenanceRule.findById(updateData.linkedRule);
    if (!rule) {
      throw new Error("Linked maintenance rule not found");
    }
  }

  Object.keys(updateData).forEach((key) => {
    maintenance[key] = updateData[key];
  });

  await maintenance.save();

  return maintenance;
};

export const updateMaintenanceStatus = async (maintenanceId, newStatus) => {
  const maintenance = await Maintenance.findById(maintenanceId);

  if (!maintenance) {
    throw new Error("Maintenance record not found");
  }

  maintenance.status = newStatus;
  await maintenance.save();

  return maintenance;
};

export const deleteMaintenance = async (maintenanceId) => {
  const maintenance = await Maintenance.findByIdAndDelete(maintenanceId);

  if (!maintenance) {
    throw new Error("Maintenance record not found");
  }

  return maintenance;
};


export const checkMaintenanceAlerts = async (vehicleId) => {
  const vehicle = await Truck.findById(vehicleId);
  if (!vehicle) {
    throw new Error("Vehicle not found");
  }

  const activeRules = await MaintenanceRule.find({ isActive: true });
  const alerts = [];

  for (const rule of activeRules) {
    const lastMaintenance = await Maintenance.findOne({
      linkedVehicle: vehicleId,
      maintenanceType: rule.maintenanceType,
      status: "Completed",
    }).sort({ maintenanceDate: -1 });

    let alert = null;

    if (rule.maintenanceType === "Oil Change") {
      let mileageAlert = false;
      let timeAlert = false;

      if (lastMaintenance) {
        const mileageSinceMaintenance =
          vehicle.currentMileage - lastMaintenance.vehicleMileageAtMaintenance;
        if (mileageSinceMaintenance >= rule.mileageThreshold) {
          mileageAlert = true;
        }

        const daysSinceMaintenance = Math.floor(
          (Date.now() - lastMaintenance.maintenanceDate) / (1000 * 60 * 60 * 24)
        );
        if (daysSinceMaintenance >= rule.timeThresholdDays) {
          timeAlert = true;
        }
      } else {
        if (vehicle.currentMileage >= rule.mileageThreshold) {
          mileageAlert = true;
        }
      }

      if (mileageAlert || timeAlert) {
        alert = {
          vehicleId: vehicle._id,
          vehicleMatricule: vehicle.matricule,
          maintenanceType: rule.maintenanceType,
          ruleId: rule._id,
          alertType:
            mileageAlert && timeAlert
              ? "Both"
              : mileageAlert
              ? "Mileage"
              : "Time",
          currentMileage: vehicle.currentMileage,
          lastMaintenanceDate: lastMaintenance
            ? lastMaintenance.maintenanceDate
            : null,
          lastMaintenanceMileage: lastMaintenance
            ? lastMaintenance.vehicleMileageAtMaintenance
            : null,
          thresholdMileage: rule.mileageThreshold,
          thresholdDays: rule.timeThresholdDays,
          message: `${rule.maintenanceType} required for ${vehicle.matricule}`,
        };
      }
    } else if (rule.maintenanceType === "Vehicle Revision") {
      if (lastMaintenance) {
        const mileageSinceMaintenance =
          vehicle.currentMileage - lastMaintenance.vehicleMileageAtMaintenance;
        if (mileageSinceMaintenance >= rule.mileageThreshold) {
          alert = {
            vehicleId: vehicle._id,
            vehicleMatricule: vehicle.matricule,
            maintenanceType: rule.maintenanceType,
            ruleId: rule._id,
            alertType: "Mileage",
            currentMileage: vehicle.currentMileage,
            lastMaintenanceDate: lastMaintenance.maintenanceDate,
            lastMaintenanceMileage: lastMaintenance.vehicleMileageAtMaintenance,
            thresholdMileage: rule.mileageThreshold,
            message: `${rule.maintenanceType} required for ${vehicle.matricule}`,
          };
        }
      } else {
        if (vehicle.currentMileage >= rule.mileageThreshold) {
          alert = {
            vehicleId: vehicle._id,
            vehicleMatricule: vehicle.matricule,
            maintenanceType: rule.maintenanceType,
            ruleId: rule._id,
            alertType: "Mileage",
            currentMileage: vehicle.currentMileage,
            lastMaintenanceDate: null,
            lastMaintenanceMileage: null,
            thresholdMileage: rule.mileageThreshold,
            message: `${rule.maintenanceType} required for ${vehicle.matricule}`,
          };
        }
      }
    }

    if (alert) {
      alerts.push(alert);
    }
  }

  return alerts;
};

export const checkAllMaintenanceAlerts = async () => {
  const vehicles = await Truck.find();
  const allAlerts = [];

  for (const vehicle of vehicles) {
    const vehicleAlerts = await checkMaintenanceAlerts(vehicle._id);
    allAlerts.push(...vehicleAlerts);
  }

  return allAlerts;
};

export const getMaintenanceStatistics = async (filters = {}) => {
  const query = {};

  if (filters.startDate || filters.endDate) {
    query.maintenanceDate = {};
    if (filters.startDate) {
      query.maintenanceDate.$gte = new Date(filters.startDate);
    }
    if (filters.endDate) {
      query.maintenanceDate.$lte = new Date(filters.endDate);
    }
  }

  const totalMaintenances = await Maintenance.countDocuments(query);

  const costAggregation = await Maintenance.aggregate([
    { $match: query },
    { $group: { _id: null, totalCost: { $sum: "$cost" } } },
  ]);
  const totalCost =
    costAggregation.length > 0 ? costAggregation[0].totalCost : 0;

  const byType = await Maintenance.aggregate([
    { $match: query },
    {
      $group: {
        _id: "$maintenanceType",
        count: { $sum: 1 },
        totalCost: { $sum: "$cost" },
      },
    },
    { $sort: { count: -1 } },
  ]);

  const byVehicle = await Maintenance.aggregate([
    { $match: query },
    {
      $group: {
        _id: "$linkedVehicle",
        count: { $sum: 1 },
        totalCost: { $sum: "$cost" },
      },
    },
    { $sort: { count: -1 } },
    { $limit: 10 },
    {
      $lookup: {
        from: "trucks",
        localField: "_id",
        foreignField: "_id",
        as: "vehicleDetails",
      },
    },
    { $unwind: "$vehicleDetails" },
    {
      $project: {
        vehicleId: "$_id",
        vehicleMatricule: "$vehicleDetails.matricule",
        count: 1,
        totalCost: 1,
      },
    },
  ]);

  const byStatus = await Maintenance.aggregate([
    { $match: query },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  const alertTriggered = await Maintenance.countDocuments({
    ...query,
    isAlertTriggered: true,
  });

  return {
    totalMaintenances,
    totalCost,
    byType,
    byVehicle,
    byStatus,
    alertTriggered,
  };
};
