import mongoose from "mongoose";

const trailerSchema = new mongoose.Schema(
  {
    matricule: {
      type: String,
      required: [true, "Trailer number (matricule) is required"],
      unique: true,
      trim: true,
      uppercase: true,
    },
    type: {
      type: String,
      enum: {
        values: [
          "Frigo",
          "Plateau",
          "Fourgon",
          "Citerne",
          "Benne",
          "Porte-conteneur",
        ],
        message: "{VALUE} is not a valid trailer type",
      },
      required: [true, "Trailer type is required"],
    },
    maximumLoad: {
      type: Number,
      required: [true, "Maximum load is required"],
      min: [0, "Maximum load cannot be negative"],
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
      min: [0, "Mileage cannot be negative"],
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

trailerSchema.index({ status: 1 });
trailerSchema.index({ type: 1 });

const Trailer = mongoose.model("Trailer", trailerSchema);

export default Trailer;
