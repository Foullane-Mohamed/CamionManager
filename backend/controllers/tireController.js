import * as tireService from "../services/tireService.js";
import {
  validateTire,
  validateTireUpdate,
  validateStatusUpdate,
} from "../validators/tireValidator.js";

export const createTire = async (req, res) => {
  try {
    const { error } = validateTire(req.body);
    if (error) {
      return res.status(400).json({
        message: "Validation error",
        errors: error.details.map((detail) => detail.message),
      });
    }

    const existingTire = await tireService.getTireBySerialNumber(
      req.body.serialNumber
    );
    if (existingTire) {
      return res.status(400).json({
        message: "A tire with this serial number already exists",
      });
    }

    const vehicleExists = await tireService.validateVehicleExists(
      req.body.associatedVehicleType,
      req.body.associatedVehicleId
    );
    if (!vehicleExists) {
      return res.status(404).json({
        message: `${req.body.associatedVehicleType} not found`,
      });
    }

    const tire = await tireService.createTire(req.body);

    res.status(201).json({
      message: "Tire created successfully",
      tire,
    });
  } catch (error) {
    console.error("Error creating tire:", error);
    res.status(500).json({
      message: "Error creating tire",
      error: error.message,
    });
  }
};

export const getAllTires = async (req, res) => {
  try {
    const filters = {
      status: req.query.status,
      brand: req.query.brand,
      associatedVehicleType: req.query.vehicleType,
      associatedVehicleId: req.query.vehicleId,
      vehiclePosition: req.query.position,
    };

    const tires = await tireService.getAllTires(filters);

    res.status(200).json({
      count: tires.length,
      tires,
    });
  } catch (error) {
    console.error("Error getting tires:", error);
    res.status(500).json({
      message: "Error retrieving tires",
      error: error.message,
    });
  }
};

export const getTireById = async (req, res) => {
  try {
    const tire = await tireService.getTireById(req.params.id);

    if (!tire) {
      return res.status(404).json({
        message: "Tire not found",
      });
    }

    res.status(200).json(tire);
  } catch (error) {
    console.error("Error getting tire:", error);
    res.status(500).json({
      message: "Error retrieving tire",
      error: error.message,
    });
  }
};

export const updateTire = async (req, res) => {
  try {
    const { error } = validateTireUpdate(req.body);
    if (error) {
      return res.status(400).json({
        message: "Validation error",
        errors: error.details.map((detail) => detail.message),
      });
    }

    const existingTire = await tireService.getTireById(req.params.id);
    if (!existingTire) {
      return res.status(404).json({
        message: "Tire not found",
      });
    }

    if (
      req.body.serialNumber &&
      req.body.serialNumber !== existingTire.serialNumber
    ) {
      const duplicateTire = await tireService.getTireBySerialNumber(
        req.body.serialNumber
      );
      if (duplicateTire) {
        return res.status(400).json({
          message: "A tire with this serial number already exists",
        });
      }
    }

    if (req.body.associatedVehicleType && req.body.associatedVehicleId) {
      const vehicleExists = await tireService.validateVehicleExists(
        req.body.associatedVehicleType,
        req.body.associatedVehicleId
      );
      if (!vehicleExists) {
        return res.status(404).json({
          message: `${req.body.associatedVehicleType} not found`,
        });
      }
    }

    const tire = await tireService.updateTire(req.params.id, req.body);

    res.status(200).json({
      message: "Tire updated successfully",
      tire,
    });
  } catch (error) {
    console.error("Error updating tire:", error);
    res.status(500).json({
      message: "Error updating tire",
      error: error.message,
    });
  }
};

export const updateTireStatus = async (req, res) => {
  try {
    const { error } = validateStatusUpdate(req.body);
    if (error) {
      return res.status(400).json({
        message: "Validation error",
        errors: error.details.map((detail) => detail.message),
      });
    }

    const existingTire = await tireService.getTireById(req.params.id);
    if (!existingTire) {
      return res.status(404).json({
        message: "Tire not found",
      });
    }

    const tire = await tireService.updateTireStatus(
      req.params.id,
      req.body.status
    );

    res.status(200).json({
      message: "Tire status updated successfully",
      tire,
    });
  } catch (error) {
    console.error("Error updating tire status:", error);
    res.status(500).json({
      message: "Error updating tire status",
      error: error.message,
    });
  }
};

export const deleteTire = async (req, res) => {
  try {
    const tire = await tireService.getTireById(req.params.id);

    if (!tire) {
      return res.status(404).json({
        message: "Tire not found",
      });
    }

    await tireService.deleteTire(req.params.id);

    res.status(200).json({
      message: "Tire deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting tire:", error);
    res.status(500).json({
      message: "Error deleting tire",
      error: error.message,
    });
  }
};

export const getTiresByVehicle = async (req, res) => {
  try {
    const { vehicleType, vehicleId } = req.params;

    const tires = await tireService.getTiresByVehicle(vehicleType, vehicleId);

    res.status(200).json({
      count: tires.length,
      tires,
    });
  } catch (error) {
    console.error("Error getting tires by vehicle:", error);
    res.status(500).json({
      message: "Error retrieving tires by vehicle",
      error: error.message,
    });
  }
};

export const getTiresByStatus = async (req, res) => {
  try {
    const { status } = req.params;

    const tires = await tireService.getTiresByStatus(status);

    res.status(200).json({
      count: tires.length,
      tires,
    });
  } catch (error) {
    console.error("Error getting tires by status:", error);
    res.status(500).json({
      message: "Error retrieving tires by status",
      error: error.message,
    });
  }
};

export const getTiresStats = async (req, res) => {
  try {
    const stats = await tireService.getTiresStats();

    res.status(200).json(stats);
  } catch (error) {
    console.error("Error getting tire statistics:", error);
    res.status(500).json({
      message: "Error retrieving tire statistics",
      error: error.message,
    });
  }
};
