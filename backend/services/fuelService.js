import Fuel from "../models/Fuel.js";
import User from "../models/User.js";
import Truck from "../models/Truck.js";

export const createFuel = async (fuelData) => {
  if (fuelData.quantity && fuelData.pricePerLitre) {
    fuelData.totalCost = fuelData.quantity * fuelData.pricePerLitre;
  }

  const fuel = await Fuel.create(fuelData);
  return await fuel.populate([
    { path: "linkedDriver", select: "name email role" },
    { path: "linkedVehicle", select: "matricule brand model" },
    { path: "linkedTrip", select: "origin destination" },
  ]);
};

export const getAllFuels = async (filters = {}) => {
  const query = {};

  if (filters.linkedDriver) {
    query.linkedDriver = filters.linkedDriver;
  }

  if (filters.linkedVehicle) {
    query.linkedVehicle = filters.linkedVehicle;
  }

  if (filters.linkedTrip) {
    query.linkedTrip = filters.linkedTrip;
  }

  if (filters.startDate || filters.endDate) {
    query.dateOfOperation = {};
    if (filters.startDate) {
      query.dateOfOperation.$gte = new Date(filters.startDate);
    }
    if (filters.endDate) {
      query.dateOfOperation.$lte = new Date(filters.endDate);
    }
  }

  if (filters.fuelStationLocation) {
    query.fuelStationLocation = new RegExp(filters.fuelStationLocation, "i");
  }

  if (filters.minCost) {
    query.totalCost = { ...query.totalCost, $gte: parseFloat(filters.minCost) };
  }

  if (filters.maxCost) {
    query.totalCost = { ...query.totalCost, $lte: parseFloat(filters.maxCost) };
  }

  return await Fuel.find(query)
    .populate("linkedDriver", "name email role")
    .populate("linkedVehicle", "matricule brand model")
    .populate("linkedTrip", "origin destination")
    .sort({ dateOfOperation: -1 });
};

export const getFuelById = async (id) => {
  return await Fuel.findById(id)
    .populate("linkedDriver", "name email role phoneNumber")
    .populate("linkedVehicle", "matricule brand model status currentMileage")
    .populate("linkedTrip", "origin destination status distance");
};

export const updateFuel = async (id, updateData) => {
  if (updateData.quantity || updateData.pricePerLitre) {
    const fuel = await Fuel.findById(id);
    const quantity = updateData.quantity || fuel.quantity;
    const pricePerLitre = updateData.pricePerLitre || fuel.pricePerLitre;
    updateData.totalCost = quantity * pricePerLitre;
  }

  return await Fuel.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  })
    .populate("linkedDriver", "name email role")
    .populate("linkedVehicle", "matricule brand model")
    .populate("linkedTrip", "origin destination");
};

export const deleteFuel = async (id) => {
  return await Fuel.findByIdAndDelete(id);
};

export const getFuelsByDriver = async (driverId) => {
  return await Fuel.find({ linkedDriver: driverId })
    .populate("linkedVehicle", "matricule brand model")
    .populate("linkedTrip", "origin destination")
    .sort({ dateOfOperation: -1 });
};

export const getFuelsByVehicle = async (vehicleId) => {
  return await Fuel.find({ linkedVehicle: vehicleId })
    .populate("linkedDriver", "name email")
    .populate("linkedTrip", "origin destination")
    .sort({ dateOfOperation: -1 });
};

export const getFuelsByTrip = async (tripId) => {
  return await Fuel.find({ linkedTrip: tripId })
    .populate("linkedDriver", "name email")
    .populate("linkedVehicle", "matricule brand model")
    .sort({ dateOfOperation: -1 });
};

export const getFuelsStats = async () => {
  const totalFuels = await Fuel.countDocuments();

  const totalCostResult = await Fuel.aggregate([
    {
      $group: {
        _id: null,
        totalCost: { $sum: "$totalCost" },
        totalQuantity: { $sum: "$quantity" },
        avgPricePerLitre: { $avg: "$pricePerLitre" },
      },
    },
  ]);

  const byDriver = await Fuel.aggregate([
    {
      $group: {
        _id: "$linkedDriver",
        totalCost: { $sum: "$totalCost" },
        totalQuantity: { $sum: "$quantity" },
        count: { $sum: 1 },
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
        totalCost: 1,
        totalQuantity: 1,
        count: 1,
      },
    },
    { $sort: { totalCost: -1 } },
    { $limit: 10 },
  ]);

  const byVehicle = await Fuel.aggregate([
    {
      $group: {
        _id: "$linkedVehicle",
        totalCost: { $sum: "$totalCost" },
        totalQuantity: { $sum: "$quantity" },
        count: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: "trucks",
        localField: "_id",
        foreignField: "_id",
        as: "vehicle",
      },
    },
    {
      $unwind: "$vehicle",
    },
    {
      $project: {
        vehicleMatricule: "$vehicle.matricule",
        vehicleBrand: "$vehicle.brand",
        totalCost: 1,
        totalQuantity: 1,
        count: 1,
      },
    },
    { $sort: { totalCost: -1 } },
    { $limit: 10 },
  ]);

  const byMonth = await Fuel.aggregate([
    {
      $group: {
        _id: {
          year: { $year: "$dateOfOperation" },
          month: { $month: "$dateOfOperation" },
        },
        totalCost: { $sum: "$totalCost" },
        totalQuantity: { $sum: "$quantity" },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": -1, "_id.month": -1 } },
    { $limit: 12 },
  ]);

  return {
    totalFuels,
    totalCost: totalCostResult[0]?.totalCost || 0,
    totalQuantity: totalCostResult[0]?.totalQuantity || 0,
    avgPricePerLitre: totalCostResult[0]?.avgPricePerLitre || 0,
    byDriver,
    byVehicle,
    byMonth,
  };
};

export const validateDriverExists = async (driverId) => {
  const driver = await User.findById(driverId);
  return driver !== null && driver.role === "chauffeur";
};

export const validateVehicleExists = async (vehicleId) => {
  const vehicle = await Truck.findById(vehicleId);
  return vehicle !== null;
};
