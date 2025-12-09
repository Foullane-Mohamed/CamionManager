import mongoose from "mongoose";

const tireSchema = new mongoose.Schema(
  {
    serialNumber: {
      type: String,
      required: [true, "Serial number is required"],
      unique: true,
      trim: true,
      uppercase: true,
    },
    brand: {
      type: String,
      required: [true, "Brand is required"],
      trim: true,
    },
    size: {
      type: String,
      required: [true, "Size is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: {
        values: ["Bon", "À remplacer", "Usé"],
        message: "{VALUE} is not a valid status",
      },
      default: "Bon",
    },
    installationDate: {
      type: Date,
      required: [true, "Installation date is required"],
    },
    vehiclePosition: {
      type: String,
      enum: {
        values: [
          "Front Left",
          "Front Right",
          "Rear Left",
          "Rear Right",
          "Spare",
          "Trailer Front Left",
          "Trailer Front Right",
          "Trailer Rear Left",
          "Trailer Rear Right",
        ],
        message: "{VALUE} is not a valid vehicle position",
      },
      required: [true, "Vehicle position is required"],
    },
    associatedVehicleType: {
      type: String,
      enum: {
        values: ["Truck", "Trailer"],
        message: "{VALUE} is not a valid vehicle type",
      },
      required: [true, "Associated vehicle type is required"],
    },
    associatedVehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Associated vehicle ID is required"],
      refPath: "associatedVehicleType",
    },
  },
  {
    timestamps: true,
  }
);

tireSchema.index({ status: 1 });
tireSchema.index({ associatedVehicleType: 1, associatedVehicleId: 1 });
tireSchema.index({ brand: 1 });

const Tire = mongoose.model("Tire", tireSchema);

export default Tire;
