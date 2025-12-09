import Trip from "../models/Trip.js";
import User from "../models/User.js";
import Truck from "../models/Truck.js";
import Trailer from "../models/Trailer.js";

export const generateTripNumber = async () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");

  const lastTrip = await Trip.findOne({
    tripNumber: new RegExp(`^TRIP${year}${month}`),
  })
    .sort({ tripNumber: -1 })
    .limit(1);

  let sequence = 1;
  if (lastTrip) {
    const lastSequence = parseInt(lastTrip.tripNumber.slice(-4));
    sequence = lastSequence + 1;
  }

  return `TRIP${year}${month}${String(sequence).padStart(4, "0")}`;
};

export const createTrip = async (tripData) => {
  tripData.tripNumber = await generateTripNumber();

  const trip = await Trip.create(tripData);
  return await trip.populate([
    { path: "assignedTruck", select: "matricule brand model status" },
    { path: "assignedTrailer", select: "matricule type status" },
    { path: "assignedDriver", select: "name email phoneNumber licenseNumber" },
  ]);
};

export const getAllTrips = async (filters = {}) => {
  const query = {};

  if (filters.status) {
    query.status = filters.status;
  }

  if (filters.assignedDriver) {
    query.assignedDriver = filters.assignedDriver;
  }

  if (filters.assignedTruck) {
    query.assignedTruck = filters.assignedTruck;
  }

  if (filters.assignedTrailer) {
    query.assignedTrailer = filters.assignedTrailer;
  }

  if (filters.startDate || filters.endDate) {
    query.departureDate = {};
    if (filters.startDate) {
      query.departureDate.$gte = new Date(filters.startDate);
    }
    if (filters.endDate) {
      query.departureDate.$lte = new Date(filters.endDate);
    }
  }

  if (filters.startPoint) {
    query.startPoint = new RegExp(filters.startPoint, "i");
  }

  if (filters.destinationPoint) {
    query.destinationPoint = new RegExp(filters.destinationPoint, "i");
  }

  return await Trip.find(query)
    .populate("assignedTruck", "matricule brand model status")
    .populate("assignedTrailer", "matricule type status")
    .populate("assignedDriver", "name email phoneNumber")
    .sort({ departureDate: -1 });
};

export const getTripById = async (id) => {
  return await Trip.findById(id)
    .populate(
      "assignedTruck",
      "matricule brand model status currentMileage fuelType"
    )
    .populate("assignedTrailer", "matricule type status maximumLoad")
    .populate(
      "assignedDriver",
      "name email phoneNumber licenseNumber licenseType"
    );
};

export const updateTrip = async (id, updateData) => {
  return await Trip.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  })
    .populate("assignedTruck", "matricule brand model")
    .populate("assignedTrailer", "matricule type")
    .populate("assignedDriver", "name email");
};

export const updateTripStatus = async (id, status) => {
  const updateData = { status };

  if (status === "En cours") {
    updateData.actualDepartureDate = new Date();
  } else if (status === "Terminé") {
    updateData.actualArrivalDate = new Date();
  }

  return await Trip.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  })
    .populate("assignedTruck", "matricule brand model")
    .populate("assignedTrailer", "matricule type")
    .populate("assignedDriver", "name email");
};

export const deleteTrip = async (id) => {
  return await Trip.findByIdAndDelete(id);
};

export const getTripsByDriver = async (driverId) => {
  return await Trip.find({ assignedDriver: driverId })
    .populate("assignedTruck", "matricule brand model")
    .populate("assignedTrailer", "matricule type")
    .sort({ departureDate: -1 });
};

export const getTripsByTruck = async (truckId) => {
  return await Trip.find({ assignedTruck: truckId })
    .populate("assignedDriver", "name email phoneNumber")
    .populate("assignedTrailer", "matricule type")
    .sort({ departureDate: -1 });
};

export const getTripsByStatus = async (status) => {
  return await Trip.find({ status })
    .populate("assignedTruck", "matricule brand model")
    .populate("assignedTrailer", "matricule type")
    .populate("assignedDriver", "name email")
    .sort({ departureDate: -1 });
};

export const getTripsStats = async () => {
  const totalTrips = await Trip.countDocuments();

  const byStatus = await Trip.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  const byDriver = await Trip.aggregate([
    {
      $group: {
        _id: "$assignedDriver",
        totalTrips: { $sum: 1 },
        totalDistance: { $sum: "$distance" },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "driver",
      },
    },
    {
      $unwind: "$driver",
    },
    {
      $project: {
        driverName: "$driver.name",
        totalTrips: 1,
        totalDistance: 1,
      },
    },
    { $sort: { totalTrips: -1 } },
    { $limit: 10 },
  ]);

  const byTruck = await Trip.aggregate([
    {
      $group: {
        _id: "$assignedTruck",
        totalTrips: { $sum: 1 },
        totalDistance: { $sum: "$distance" },
      },
    },
    {
      $lookup: {
        from: "trucks",
        localField: "_id",
        foreignField: "_id",
        as: "truck",
      },
    },
    {
      $unwind: "$truck",
    },
    {
      $project: {
        truckMatricule: "$truck.matricule",
        truckBrand: "$truck.brand",
        totalTrips: 1,
        totalDistance: 1,
      },
    },
    { $sort: { totalTrips: -1 } },
    { $limit: 10 },
  ]);

  const totalDistanceResult = await Trip.aggregate([
    {
      $group: {
        _id: null,
        totalDistance: { $sum: "$distance" },
        avgDistance: { $avg: "$distance" },
      },
    },
  ]);

  return {
    totalTrips,
    byStatus,
    byDriver,
    byTruck,
    totalDistance: totalDistanceResult[0]?.totalDistance || 0,
    avgDistance: totalDistanceResult[0]?.avgDistance || 0,
  };
};

export const validateDriverExists = async (driverId) => {
  const driver = await User.findById(driverId);
  return driver !== null && driver.role === "chauffeur";
};

export const validateTruckExists = async (truckId) => {
  const truck = await Truck.findById(truckId);
  return truck !== null;
};

export const validateTrailerExists = async (trailerId) => {
  if (!trailerId) return true;
  const trailer = await Trailer.findById(trailerId);
  return trailer !== null;
};

export const generateMissionOrderPDF = async (tripId) => {
  const trip = await getTripById(tripId);
  if (!trip) {
    throw new Error("Trip not found");
  }

  const pdfContent = {
    tripNumber: trip.tripNumber,
    driver: trip.assignedDriver.name,
    truck: `${trip.assignedTruck.brand} ${trip.assignedTruck.model} (${trip.assignedTruck.matricule})`,
    trailer: trip.assignedTrailer
      ? `${trip.assignedTrailer.type} (${trip.assignedTrailer.matricule})`
      : "N/A",
    startPoint: trip.startPoint,
    destinationPoint: trip.destinationPoint,
    departureDate: trip.departureDate,
    expectedArrivalDate: trip.expectedArrivalDate,
    mileageAtDeparture: trip.mileageAtDeparture,
    status: trip.status,
    generatedDate: new Date(),
  };

  const pdfFilename = `mission_order_${trip.tripNumber}_${Date.now()}.pdf`;

  await Trip.findByIdAndUpdate(tripId, { missionOrderPDF: pdfFilename });

  return {
    pdfContent,
    pdfFilename,
  };
};
