import Trailer from "../models/Trailer.js";

export const createTrailer = async (trailerData) => {
  const trailer = await Trailer.create(trailerData);
  return trailer;
};

export const getAllTrailers = async (filters = {}) => {
  const query = {};

  if (filters.status) {
    query.status = filters.status;
  }

  if (filters.type) {
    query.type = filters.type;
  }

  if (filters.minLoad) {
    query.maximumLoad = {
      ...query.maximumLoad,
      $gte: parseFloat(filters.minLoad),
    };
  }

  if (filters.maxLoad) {
    query.maximumLoad = {
      ...query.maximumLoad,
      $lte: parseFloat(filters.maxLoad),
    };
  }

  const trailers = await Trailer.find(query).sort({ createdAt: -1 });
  return trailers;
};

export const getTrailerById = async (id) => {
  const trailer = await Trailer.findById(id);
  return trailer;
};

export const getTrailerByMatricule = async (matricule) => {
  const trailer = await Trailer.findOne({ matricule: matricule.toUpperCase() });
  return trailer;
};

export const updateTrailer = async (id, updateData) => {
  const trailer = await Trailer.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });
  return trailer;
};

export const updateTrailerStatus = async (id, status) => {
  const trailer = await Trailer.findByIdAndUpdate(
    id,
    { status },
    { new: true, runValidators: true }
  );
  return trailer;
};

export const deleteTrailer = async (id) => {
  const trailer = await Trailer.findByIdAndDelete(id);
  return trailer;
};

export const getAvailableTrailers = async () => {
  const trailers = await Trailer.find({ status: "Disponible" }).sort({
    createdAt: -1,
  });
  return trailers;
};

export const getTrailersStats = async () => {
  const stats = await Trailer.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  const totalTrailers = await Trailer.countDocuments();

  const typeStats = await Trailer.aggregate([
    {
      $group: {
        _id: "$type",
        count: { $sum: 1 },
        averageLoad: { $avg: "$maximumLoad" },
        totalCapacity: { $sum: "$maximumLoad" },
      },
    },
  ]);

  return {
    totalTrailers,
    byStatus: stats,
    byType: typeStats,
  };
};
