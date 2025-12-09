import * as fuelService from "../services/fuelService.js";
import {
  validateFuel,
  validateFuelUpdate,
} from "../validators/fuelValidator.js";

export const createFuel = async (req, res) => {
  try {
    const { error } = validateFuel(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.details.map((detail) => detail.message),
      });
    }

    const driverExists = await fuelService.validateDriverExists(
      req.body.linkedDriver
    );
    if (!driverExists) {
      return res.status(404).json({
        success: false,
        message: "Linked driver not found or is not a chauffeur",
      });
    }

    const vehicleExists = await fuelService.validateVehicleExists(
      req.body.linkedVehicle
    );
    if (!vehicleExists) {
      return res.status(404).json({
        success: false,
        message: "Linked vehicle not found",
      });
    }

    const fuel = await fuelService.createFuel(req.body);

    res.status(201).json({
      success: true,
      message: "Fuel record created successfully",
      data: fuel,
    });
  } catch (error) {
    console.error("Error creating fuel record:", error);
    res.status(500).json({
      success: false,
      message: "Error creating fuel record",
      error: error.message,
    });
  }
};

export const getAllFuels = async (req, res) => {
  try {
    const filters = {
      linkedDriver: req.query.linkedDriver,
      linkedVehicle: req.query.linkedVehicle,
      linkedTrip: req.query.linkedTrip,
      startDate: req.query.startDate,
      endDate: req.query.endDate,
      fuelStationLocation: req.query.fuelStationLocation,
      minCost: req.query.minCost,
      maxCost: req.query.maxCost,
    };

    const fuels = await fuelService.getAllFuels(filters);

    res.status(200).json({
      success: true,
      count: fuels.length,
      data: fuels,
    });
  } catch (error) {
    console.error("Error fetching fuels:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching fuel records",
      error: error.message,
    });
  }
};

export const getFuelById = async (req, res) => {
  try {
    const fuel = await fuelService.getFuelById(req.params.id);

    if (!fuel) {
      return res.status(404).json({
        success: false,
        message: "Fuel record not found",
      });
    }

    res.status(200).json({
      success: true,
      data: fuel,
    });
  } catch (error) {
    console.error("Error fetching fuel:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching fuel record",
      error: error.message,
    });
  }
};

export const updateFuel = async (req, res) => {
  try {
    const { error } = validateFuelUpdate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.details.map((detail) => detail.message),
      });
    }

    if (req.body.linkedDriver) {
      const driverExists = await fuelService.validateDriverExists(
        req.body.linkedDriver
      );
      if (!driverExists) {
        return res.status(404).json({
          success: false,
          message: "Linked driver not found or is not a chauffeur",
        });
      }
    }

    if (req.body.linkedVehicle) {
      const vehicleExists = await fuelService.validateVehicleExists(
        req.body.linkedVehicle
      );
      if (!vehicleExists) {
        return res.status(404).json({
          success: false,
          message: "Linked vehicle not found",
        });
      }
    }

    const fuel = await fuelService.updateFuel(req.params.id, req.body);

    if (!fuel) {
      return res.status(404).json({
        success: false,
        message: "Fuel record not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Fuel record updated successfully",
      data: fuel,
    });
  } catch (error) {
    console.error("Error updating fuel:", error);
    res.status(500).json({
      success: false,
      message: "Error updating fuel record",
      error: error.message,
    });
  }
};

export const deleteFuel = async (req, res) => {
  try {
    const fuel = await fuelService.deleteFuel(req.params.id);

    if (!fuel) {
      return res.status(404).json({
        success: false,
        message: "Fuel record not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Fuel record deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting fuel:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting fuel record",
      error: error.message,
    });
  }
};

export const getFuelsByDriver = async (req, res) => {
  try {
    const fuels = await fuelService.getFuelsByDriver(req.params.driverId);

    res.status(200).json({
      success: true,
      driverId: req.params.driverId,
      count: fuels.length,
      data: fuels,
    });
  } catch (error) {
    console.error("Error fetching fuels by driver:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching fuel records by driver",
      error: error.message,
    });
  }
};

export const getFuelsByVehicle = async (req, res) => {
  try {
    const fuels = await fuelService.getFuelsByVehicle(req.params.vehicleId);

    res.status(200).json({
      success: true,
      vehicleId: req.params.vehicleId,
      count: fuels.length,
      data: fuels,
    });
  } catch (error) {
    console.error("Error fetching fuels by vehicle:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching fuel records by vehicle",
      error: error.message,
    });
  }
};

export const getFuelsByTrip = async (req, res) => {
  try {
    const fuels = await fuelService.getFuelsByTrip(req.params.tripId);

    res.status(200).json({
      success: true,
      tripId: req.params.tripId,
      count: fuels.length,
      data: fuels,
    });
  } catch (error) {
    console.error("Error fetching fuels by trip:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching fuel records by trip",
      error: error.message,
    });
  }
};

export const getFuelsStats = async (req, res) => {
  try {
    const stats = await fuelService.getFuelsStats();

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Error fetching fuel statistics:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching fuel statistics",
      error: error.message,
    });
  }
};
