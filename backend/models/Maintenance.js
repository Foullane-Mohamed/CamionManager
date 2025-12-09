import mongoose from "mongoose";

const maintenanceSchema = new mongoose.Schema(
  {
    maintenanceNumber: {
      type: String,
      unique: true,
      trim: true,
    },
    maintenanceType: {
      type: String,
      enum: ["Tire Replacement", "Oil Change", "Vehicle Revision", "Other"],
      required: [true, "Maintenance type is required"],
    },
    linkedVehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Truck",
      required: [true, "Linked vehicle is required"],
    },
    linkedRule: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MaintenanceRule",
      default: null,
    },
    maintenanceDate: {
      type: Date,
      required: [true, "Maintenance date is required"],
      default: Date.now,
    },
    vehicleMileageAtMaintenance: {
      type: Number,
      required: [true, "Vehicle mileage at maintenance is required"],
      min: [0, "Mileage cannot be negative"],
    },
    nextMaintenanceDueDate: {
      type: Date,
    },
    nextMaintenanceDueMileage: {
      type: Number,
      min: [0, "Mileage cannot be negative"],
    },
    cost: {
      type: Number,
      required: [true, "Maintenance cost is required"],
      min: [0, "Cost cannot be negative"],
    },
    serviceProvider: {
      type: String,
      trim: true,
      required: [true, "Service provider is required"],
    },
    description: {
      type: String,
      trim: true,
    },
    partsReplaced: [
      {
        partName: String,
        quantity: Number,
        unitPrice: Number,
      },
    ],
    isAlertTriggered: {
      type: Boolean,
      default: false,
    },
    alertType: {
      type: String,
      enum: ["Mileage", "Time", "Both", "Manual"],
      default: "Manual",
    },
    status: {
      type: String,
      enum: ["Scheduled", "In Progress", "Completed", "Cancelled"],
      default: "Completed",
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User who performed maintenance is required"],
    },
    remarks: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries
maintenanceSchema.index({ linkedVehicle: 1, maintenanceDate: -1 });
maintenanceSchema.index({ maintenanceType: 1, status: 1 });
maintenanceSchema.index({ nextMaintenanceDueDate: 1 });
maintenanceSchema.index({ nextMaintenanceDueMileage: 1 });

// Pre-save hook to auto-generate maintenance number
maintenanceSchema.pre("save", async function () {
  if (this.isNew && !this.maintenanceNumber) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");

    // Find the last maintenance record for this month
    const lastMaintenance = await mongoose
      .model("Maintenance")
      .findOne({
        maintenanceNumber: new RegExp(`^MAINT${year}${month}`),
      })
      .sort({ maintenanceNumber: -1 })
      .limit(1);

    let sequence = 1;
    if (lastMaintenance) {
      const lastSequence = parseInt(
        lastMaintenance.maintenanceNumber.slice(-4)
      );
      sequence = lastSequence + 1;
    }

    this.maintenanceNumber = `MAINT${year}${month}${String(sequence).padStart(
      4,
      "0"
    )}`;
  }
});

// Virtual for total parts cost
maintenanceSchema.virtual("totalPartsCost").get(function () {
  if (!this.partsReplaced || this.partsReplaced.length === 0) {
    return 0;
  }
  return this.partsReplaced.reduce((total, part) => {
    return total + (part.quantity * part.unitPrice || 0);
  }, 0);
});

maintenanceSchema.set("toJSON", { virtuals: true });
maintenanceSchema.set("toObject", { virtuals: true });

const Maintenance = mongoose.model("Maintenance", maintenanceSchema);

export default Maintenance;
