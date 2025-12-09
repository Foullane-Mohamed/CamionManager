import Tire from "../models/Tire.js";
import Truck from "../models/Truck.js";
import Trailer from "../models/Trailer.js";

export const createTire = async (tireData) => {
  const tire = await Tire.create(tireData);
  return tire.populate("associatedVehicleId");
};

export const getAllTires = async (filters = {}) => {
  const query = {};

  if (filters.status) {
    query.status = filters.status;
  }

  if (filters.brand) {
    query.brand = new RegExp(filters.brand, "i");
  }

  if (filters.associatedVehicleType) {
    query.associatedVehicleType = filters.associatedVehicleType;
  }

  if (filters.associatedVehicleId) {
    query.associatedVehicleId = filters.associatedVehicleId;
  }

  if (filters.vehiclePosition) {
    query.vehiclePosition = filters.vehiclePosition;
  }

  const tires = await Tire.find(query)
    .populate("associatedVehicleId")
    .sort({ createdAt: -1 });
  return tires;
};

export const getTireById = async (id) => {
  const tire = await Tire.findById(id).populate("associatedVehicleId");
  return tire;
};

export const getTireBySerialNumber = async (serialNumber) => {
  const tire = await Tire.findOne({
    serialNumber: serialNumber.toUpperCase(),
  }).populate("associatedVehicleId");
  return tire;
};

export const updateTire = async (id, updateData) => {
  const tire = await Tire.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  }).populate("associatedVehicleId");
  return tire;
};

export const updateTireStatus = async (id, status) => {
  const tire = await Tire.findByIdAndUpdate(
    id,
    { status },
    { new: true, runValidators: true }
  ).populate("associatedVehicleId");
  return tire;
};

export const deleteTire = async (id) => {
  const tire = await Tire.findByIdAndDelete(id);
  return tire;
};

export const getTiresByVehicle = async (vehicleType, vehicleId) => {
  const tires = await Tire.find({
    associatedVehicleType: vehicleType,
    associatedVehicleId: vehicleId,
  })
    .populate("associatedVehicleId")
    .sort({ vehiclePosition: 1 });
  return tires;
};

export const getTiresByStatus = async (status) => {
  const tires = await Tire.find({ status })
    .populate("associatedVehicleId")
    .sort({ createdAt: -1 });
  return tires;
};

export const getTiresStats = async () => {
  const stats = await Tire.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  const totalTires = await Tire.countDocuments();

  const brandStats = await Tire.aggregate([
    {
      $group: {
        _id: "$brand",
        count: { $sum: 1 },
      },
    },
  ]);

  const vehicleTypeStats = await Tire.aggregate([
    {
      $group: {
        _id: "$associatedVehicleType",
        count: { $sum: 1 },
      },
    },
  ]);

  return {
    totalTires,
    byStatus: stats,
    byBrand: brandStats,
    byVehicleType: vehicleTypeStats,
  };
};

export const validateVehicleExists = async (vehicleType, vehicleId) => {
  if (vehicleType === "Truck") {
    const truck = await Truck.findById(vehicleId);
    return truck !== null;
  } else if (vehicleType === "Trailer") {
    const trailer = await Trailer.findById(vehicleId);
    return trailer !== null;
  }
  return false;
};
