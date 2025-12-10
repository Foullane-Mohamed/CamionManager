import * as tripService from "../services/tripService.js";
import {
  validateTrip,
  validateTripUpdate,
  validateStatusUpdate,
} from "../validators/tripValidator.js";

export const createTrip = async (req, res) => {
  try {
    const { error } = validateTrip(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.details.map((detail) => detail.message),
      });
    }

    const driverExists = await tripService.validateDriverExists(
      req.body.assignedDriver
    );
    if (!driverExists) {
      return res.status(404).json({
        success: false,
        message: "Assigned driver not found or is not a chauffeur",
      });
    }

    const truckExists = await tripService.validateTruckExists(
      req.body.assignedTruck
    );
    if (!truckExists) {
      return res.status(404).json({
        success: false,
        message: "Assigned truck not found",
      });
    }

    if (req.body.assignedTrailer) {
      const trailerExists = await tripService.validateTrailerExists(
        req.body.assignedTrailer
      );
      if (!trailerExists) {
        return res.status(404).json({
          success: false,
          message: "Assigned trailer not found",
        });
      }
    }

    const trip = await tripService.createTrip(req.body);

    res.status(201).json({
      success: true,
      message: "Trip created successfully",
      data: trip,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating trip",
      error: error.message,
    });
  }
};

export const getAllTrips = async (req, res) => {
  try {
    const filters = {
      status: req.query.status,
      assignedDriver: req.query.assignedDriver,
      assignedTruck: req.query.assignedTruck,
      assignedTrailer: req.query.assignedTrailer,
      startDate: req.query.startDate,
      endDate: req.query.endDate,
      startPoint: req.query.startPoint,
      destinationPoint: req.query.destinationPoint,
    };

    const trips = await tripService.getAllTrips(filters);

    res.status(200).json({
      success: true,
      count: trips.length,
      data: trips,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching trips",
      error: error.message,
    });
  }
};

export const getTripById = async (req, res) => {
  try {
    const trip = await tripService.getTripById(req.params.id);

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found",
      });
    }

    res.status(200).json({
      success: true,
      data: trip,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching trip",
      error: error.message,
    });
  }
};

export const updateTrip = async (req, res) => {
  try {
    const { error } = validateTripUpdate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.details.map((detail) => detail.message),
      });
    }

    if (req.body.assignedDriver) {
      const driverExists = await tripService.validateDriverExists(
        req.body.assignedDriver
      );
      if (!driverExists) {
        return res.status(404).json({
          success: false,
          message: "Assigned driver not found or is not a chauffeur",
        });
      }
    }

    if (req.body.assignedTruck) {
      const truckExists = await tripService.validateTruckExists(
        req.body.assignedTruck
      );
      if (!truckExists) {
        return res.status(404).json({
          success: false,
          message: "Assigned truck not found",
        });
      }
    }

    if (req.body.assignedTrailer) {
      const trailerExists = await tripService.validateTrailerExists(
        req.body.assignedTrailer
      );
      if (!trailerExists) {
        return res.status(404).json({
          success: false,
          message: "Assigned trailer not found",
        });
      }
    }

    const trip = await tripService.updateTrip(req.params.id, req.body);

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Trip updated successfully",
      data: trip,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating trip",
      error: error.message,
    });
  }
};

export const updateTripStatus = async (req, res) => {
  try {
    const { error } = validateStatusUpdate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.details.map((detail) => detail.message),
      });
    }

    const trip = await tripService.updateTripStatus(
      req.params.id,
      req.body.status
    );

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Trip status updated successfully",
      data: trip,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating trip status",
      error: error.message,
    });
  }
};

export const deleteTrip = async (req, res) => {
  try {
    const trip = await tripService.deleteTrip(req.params.id);

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Trip deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting trip",
      error: error.message,
    });
  }
};

export const getTripsByDriver = async (req, res) => {
  try {
    const trips = await tripService.getTripsByDriver(req.params.driverId);

    res.status(200).json({
      success: true,
      driverId: req.params.driverId,
      count: trips.length,
      data: trips,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching trips by driver",
      error: error.message,
    });
  }
};

export const getTripsByTruck = async (req, res) => {
  try {
    const trips = await tripService.getTripsByTruck(req.params.truckId);

    res.status(200).json({
      success: true,
      truckId: req.params.truckId,
      count: trips.length,
      data: trips,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching trips by truck",
      error: error.message,
    });
  }
};

export const getTripsByStatus = async (req, res) => {
  try {
    const trips = await tripService.getTripsByStatus(req.params.status);

    res.status(200).json({
      success: true,
      status: req.params.status,
      count: trips.length,
      data: trips,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching trips by status",
      error: error.message,
    });
  }
};

export const getTripsStats = async (req, res) => {
  try {
    const stats = await tripService.getTripsStats();

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching trip statistics",
      error: error.message,
    });
  }
};

export const generateMissionOrderPDF = async (req, res) => {
  try {
    const result = await tripService.generateMissionOrderPDF(req.params.id);

    res.status(200).json({
      success: true,
      message: "Mission order PDF generated successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error generating mission order PDF",
      error: error.message,
    });
  }
};
