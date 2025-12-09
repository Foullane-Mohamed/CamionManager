import mongoose from "mongoose";

const tripSchema = new mongoose.Schema(
  {
    tripNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    assignedTruck: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Truck",
      required: [true, "Assigned truck is required"],
    },
    assignedTrailer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trailer",
      default: null,
    },
    assignedDriver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Assigned driver is required"],
    },
    startPoint: {
      type: String,
      required: [true, "Start point is required"],
      trim: true,
    },
    destinationPoint: {
      type: String,
      required: [true, "Destination point is required"],
      trim: true,
    },
    departureDate: {
      type: Date,
      required: [true, "Departure date is required"],
    },
    expectedArrivalDate: {
      type: Date,
      required: [true, "Expected arrival date is required"],
    },
    actualArrivalDate: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: {
        values: ["À faire", "En cours", "Terminé"],
        message: "{VALUE} is not a valid status",
      },
      default: "À faire",
    },
    mileageAtDeparture: {
      type: Number,
      required: [true, "Mileage at departure is required"],
      min: [0, "Mileage at departure cannot be negative"],
    },
    mileageAtArrival: {
      type: Number,
      default: null,
      min: [0, "Mileage at arrival cannot be negative"],
    },
    driverRemarks: {
      type: String,
      trim: true,
      default: "",
    },
    distance: {
      type: Number,
      default: null,
    },
    missionOrderPDF: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

tripSchema.index({ status: 1 });
tripSchema.index({ assignedDriver: 1 });
tripSchema.index({ assignedTruck: 1 });
tripSchema.index({ departureDate: -1 });

const Trip = mongoose.model("Trip", tripSchema);

export default Trip;
