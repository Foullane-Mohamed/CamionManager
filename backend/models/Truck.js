import mongoose from "mongoose";

const truckSchema = new mongoose.Schema(
  {
    matricule: {
      type: String,
      required: [true, "Truck number (matricule) is required"],
      unique: true,
      trim: true,
      uppercase: true,
    },
    brand: {
      type: String,
      required: [true, "Brand is required"],
      trim: true,
    },
    model: {
      type: String,
      required: [true, "Model is required"],
      trim: true,
    },
    yearOfManufacture: {
      type: Number,
      required: [true, "Year of manufacture is required"],
      min: [1900, "Year must be after 1900"],
      max: [new Date().getFullYear() + 1, "Year cannot be in the future"],
    },
    status: {
      type: String,
      enum: {
        values: ["Disponible", "En Mission", "En Maintenance"],
        message: "{VALUE} is not a valid status",
      },
      default: "Disponible",
    },
    currentMileage: {
      type: Number,
      required: [true, "Current mileage is required"],
      min: [0, "Mileage cannot be negative"],
      default: 0,
    },
    fuelType: {
      type: String,
      enum: {
        values: ["Diesel", "Gasoline", "Other"],
        message: "{VALUE} is not a valid fuel type",
      },
      required: [true, "Fuel type is required"],
    },
  },
  {
    timestamps: true,
  }
);

truckSchema.index({ status: 1 });
truckSchema.index({ brand: 1, model: 1 });

export default mongoose.model("Truck", truckSchema);
