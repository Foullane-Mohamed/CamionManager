import Truck from "../models/Truck.js";

export const createTruck = async (truckData) => {
  const truck = await Truck.create(truckData);
  return truck;
};

export const getAllTrucks = async (filters = {}) => {
  const query = {};

  if (filters.status) {
    query.status = filters.status;
  }

  if (filters.fuelType) {
    query.fuelType = filters.fuelType;
  }

  if (filters.brand) {
    query.brand = new RegExp(filters.brand, "i");
  }

  if (filters.minYear) {
    query.yearOfManufacture = {
      ...query.yearOfManufacture,
      $gte: parseInt(filters.minYear),
    };
  }
  if (filters.maxYear) {
    query.yearOfManufacture = {
      ...query.yearOfManufacture,
      $lte: parseInt(filters.maxYear),
    };
  }

  const trucks = await Truck.find(query).sort({ createdAt: -1 });
  return trucks;
};

export const getTruckById = async (id) => {
  const truck = await Truck.findById(id);
  return truck;
};

export const getTruckByMatricule = async (matricule) => {
  const truck = await Truck.findOne({ matricule: matricule.toUpperCase() });
  return truck;
};

export const updateTruck = async (id, updateData) => {
  const truck = await Truck.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });
  return truck;
};

export const updateTruckStatus = async (id, status) => {
  const truck = await Truck.findByIdAndUpdate(
    id,
    { status },
    { new: true, runValidators: true }
  );
  return truck;
};

export const deleteTruck = async (id) => {
  const truck = await Truck.findByIdAndDelete(id);
  return truck;
};

export const getAvailableTrucks = async () => {
  const trucks = await Truck.find({ status: "Disponible" }).sort({
    createdAt: -1,
  });
  return trucks;
};

export const getTrucksStats = async () => {
  const stats = await Truck.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  const totalTrucks = await Truck.countDocuments();

  const fuelStats = await Truck.aggregate([
    {
      $group: {
        _id: "$fuelType",
        count: { $sum: 1 },
      },
    },
  ]);

  return {
    totalTrucks,
    byStatus: stats,
    byFuelType: fuelStats,
  };
};
