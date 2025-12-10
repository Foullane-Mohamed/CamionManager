import * as trailerService from "../services/trailerService.js";
import {
  validateTrailer,
  validateTrailerUpdate,
  validateStatusUpdate,
} from "../validators/trailerValidator.js";

export const createTrailer = async (req, res) => {
  try {
    const { error } = validateTrailer(req.body);
    if (error) {
      return res.status(400).json({
        message: "Validation error",
        errors: error.details.map((detail) => detail.message),
      });
    }

    const existingTrailer = await trailerService.getTrailerByMatricule(
      req.body.matricule
    );
    if (existingTrailer) {
      return res.status(400).json({
        message: "A trailer with this matricule already exists",
      });
    }

    const trailer = await trailerService.createTrailer(req.body);

    res.status(201).json({
      message: "Trailer created successfully",
      trailer,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating trailer",
      error: error.message,
    });
  }
};

export const getAllTrailers = async (req, res) => {
  try {
    const filters = {
      status: req.query.status,
      type: req.query.type,
      minLoad: req.query.minLoad,
      maxLoad: req.query.maxLoad,
    };

    const trailers = await trailerService.getAllTrailers(filters);

    res.status(200).json({
      count: trailers.length,
      trailers,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving trailers",
      error: error.message,
    });
  }
};

export const getTrailerById = async (req, res) => {
  try {
    const trailer = await trailerService.getTrailerById(req.params.id);

    if (!trailer) {
      return res.status(404).json({
        message: "Trailer not found",
      });
    }

    res.status(200).json(trailer);
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving trailer",
      error: error.message,
    });
  }
};

export const updateTrailer = async (req, res) => {
  try {
    const { error } = validateTrailerUpdate(req.body);
    if (error) {
      return res.status(400).json({
        message: "Validation error",
        errors: error.details.map((detail) => detail.message),
      });
    }

    const existingTrailer = await trailerService.getTrailerById(req.params.id);
    if (!existingTrailer) {
      return res.status(404).json({
        message: "Trailer not found",
      });
    }

    if (
      req.body.matricule &&
      req.body.matricule !== existingTrailer.matricule
    ) {
      const duplicateTrailer = await trailerService.getTrailerByMatricule(
        req.body.matricule
      );
      if (duplicateTrailer) {
        return res.status(400).json({
          message: "A trailer with this matricule already exists",
        });
      }
    }

    const trailer = await trailerService.updateTrailer(req.params.id, req.body);

    res.status(200).json({
      message: "Trailer updated successfully",
      trailer,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating trailer",
      error: error.message,
    });
  }
};

export const updateTrailerStatus = async (req, res) => {
  try {
    const { error } = validateStatusUpdate(req.body);
    if (error) {
      return res.status(400).json({
        message: "Validation error",
        errors: error.details.map((detail) => detail.message),
      });
    }

    const existingTrailer = await trailerService.getTrailerById(req.params.id);
    if (!existingTrailer) {
      return res.status(404).json({
        message: "Trailer not found",
      });
    }

    const trailer = await trailerService.updateTrailerStatus(
      req.params.id,
      req.body.status
    );

    res.status(200).json({
      message: "Trailer status updated successfully",
      trailer,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating trailer status",
      error: error.message,
    });
  }
};

export const deleteTrailer = async (req, res) => {
  try {
    const trailer = await trailerService.getTrailerById(req.params.id);

    if (!trailer) {
      return res.status(404).json({
        message: "Trailer not found",
      });
    }

    await trailerService.deleteTrailer(req.params.id);

    res.status(200).json({
      message: "Trailer deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting trailer",
      error: error.message,
    });
  }
};

export const getAvailableTrailers = async (req, res) => {
  try {
    const trailers = await trailerService.getAvailableTrailers();

    res.status(200).json({
      count: trailers.length,
      trailers,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving available trailers",
      error: error.message,
    });
  }
};

export const getTrailersStats = async (req, res) => {
  try {
    const stats = await trailerService.getTrailersStats();

    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving trailer statistics",
      error: error.message,
    });
  }
};
