import * as truckService from "../services/truckService.js";
import {
  validateTruck,
  validateTruckUpdate,
  validateStatusUpdate,
} from "../validators/truckValidator.js";

export const createTruck = async (req, res) => {
  try {
    const { error } = validateTruck(req.body);
    if (error) {
      return res.status(400).json({
        message: "Validation error",
        errors: error.details.map((detail) => detail.message),
      });
    }

    const existingTruck = await truckService.getTruckByMatricule(
      req.body.matricule
    );
    if (existingTruck) {
      return res.status(400).json({
        message: "A truck with this matricule already exists",
      });
    }

    const truck = await truckService.createTruck(req.body);

    res.status(201).json({
      message: "Truck created successfully",
      truck,
    });
  } catch (error) {
    console.error("Error creating truck:", error);
    res.status(500).json({
      message: "Error creating truck",
      error: error.message,
    });
  }
};

export const getAllTrucks = async (req, res) => {
  try {
    const filters = {
      status: req.query.status,
      fuelType: req.query.fuelType,
      brand: req.query.brand,
      minYear: req.query.minYear,
      maxYear: req.query.maxYear,
    };

    const trucks = await truckService.getAllTrucks(filters);

    res.status(200).json({
      count: trucks.length,
      trucks,
    });
  } catch (error) {
    console.error("Error getting trucks:", error);
    res.status(500).json({
      message: "Error retrieving trucks",
      error: error.message,
    });
  }
};

export const getTruckById = async (req, res) => {
  try {
    const truck = await truckService.getTruckById(req.params.id);

    if (!truck) {
      return res.status(404).json({
        message: "Truck not found",
      });
    }

    res.status(200).json(truck);
  } catch (error) {
    console.error("Error getting truck:", error);
    res.status(500).json({
      message: "Error retrieving truck",
      error: error.message,
    });
  }
};

export const updateTruck = async (req, res) => {
  try {
    const { error } = validateTruckUpdate(req.body);
    if (error) {
      return res.status(400).json({
        message: "Validation error",
        errors: error.details.map((detail) => detail.message),
      });
    }

    const existingTruck = await truckService.getTruckById(req.params.id);
    if (!existingTruck) {
      return res.status(404).json({
        message: "Truck not found",
      });
    }

    if (req.body.matricule && req.body.matricule !== existingTruck.matricule) {
      const duplicateTruck = await truckService.getTruckByMatricule(
        req.body.matricule
      );
      if (duplicateTruck) {
        return res.status(400).json({
          message: "A truck with this matricule already exists",
        });
      }
    }

    const truck = await truckService.updateTruck(req.params.id, req.body);

    res.status(200).json({
      message: "Truck updated successfully",
      truck,
    });
  } catch (error) {
    console.error("Error updating truck:", error);
    res.status(500).json({
      message: "Error updating truck",
      error: error.message,
    });
  }
};

export const updateTruckStatus = async (req, res) => {
  try {
    const { error } = validateStatusUpdate(req.body);
    if (error) {
      return res.status(400).json({
        message: "Validation error",
        errors: error.details.map((detail) => detail.message),
      });
    }

    const existingTruck = await truckService.getTruckById(req.params.id);
    if (!existingTruck) {
      return res.status(404).json({
        message: "Truck not found",
      });
    }

    const truck = await truckService.updateTruckStatus(
      req.params.id,
      req.body.status
    );

    res.status(200).json({
      message: "Truck status updated successfully",
      truck,
    });
  } catch (error) {
    console.error("Error updating truck status:", error);
    res.status(500).json({
      message: "Error updating truck status",
      error: error.message,
    });
  }
};

export const deleteTruck = async (req, res) => {
  try {
    const truck = await truckService.getTruckById(req.params.id);

    if (!truck) {
      return res.status(404).json({
        message: "Truck not found",
      });
    }

    await truckService.deleteTruck(req.params.id);

    res.status(200).json({
      message: "Truck deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting truck:", error);
    res.status(500).json({
      message: "Error deleting truck",
      error: error.message,
    });
  }
};

export const getAvailableTrucks = async (req, res) => {
  try {
    const trucks = await truckService.getAvailableTrucks();

    res.status(200).json({
      count: trucks.length,
      trucks,
    });
  } catch (error) {
    console.error("Error getting available trucks:", error);
    res.status(500).json({
      message: "Error retrieving available trucks",
      error: error.message,
    });
  }
};

export const getTrucksStats = async (req, res) => {
  try {
    const stats = await truckService.getTrucksStats();

    res.status(200).json(stats);
  } catch (error) {
    console.error("Error getting truck statistics:", error);
    res.status(500).json({
      message: "Error retrieving truck statistics",
      error: error.message,
    });
  }
};
