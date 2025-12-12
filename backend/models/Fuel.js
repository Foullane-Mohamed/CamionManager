
import mongoose from "mongoose";

const fuelSchema = new mongoose.Schema(
  {
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [0, "Quantity cannot be negative"],
    },
    totalCost: {
      type: Number,
      required: [true, "Total cost is required"],
      min: [0, "Total cost cannot be negative"],
    },
    pricePerLitre: {
      type: Number,
      required: [true, "Price per litre is required"],
      min: [0, "Price per litre cannot be negative"],
    },
    fuelStationLocation: {
      type: String,
      required: [true, "Fuel station location is required"],
      trim: true,
    },
    dateOfOperation: {
      type: Date,
      required: [true, "Date of operation is required"],
    },
    linkedTrip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trip",
      default: null,
    },
    linkedDriver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Linked driver is required"],
    },
    linkedVehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Truck",
      required: [true, "Linked vehicle is required"],
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

fuelSchema.index({ linkedDriver: 1 });
fuelSchema.index({ linkedVehicle: 1 });
fuelSchema.index({ linkedTrip: 1 });
fuelSchema.index({ dateOfOperation: -1 });

const Fuel = mongoose.model("Fuel", fuelSchema);

export default Fuel;
