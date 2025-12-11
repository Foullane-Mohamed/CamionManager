/**
 * @swagger
 * components:
 *   schemas:
 *     Maintenance:
 *       type: object
 *       required:
 *         - maintenanceType
 *         - linkedVehicle
 *         - maintenanceDate
 *         - vehicleMileageAtMaintenance
 *         - cost
 *         - serviceProvider
 *         - performedBy
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated MongoDB ID
 *         maintenanceNumber:
 *           type: string
 *           description: Auto-generated unique maintenance number
 *           example: "MAINT-2024-001"
 *         maintenanceType:
 *           type: string
 *           enum: [Tire Replacement, Oil Change, Vehicle Revision, Other]
 *           description: Type of maintenance performed
 *         linkedVehicle:
 *           type: string
 *           description: ID of the vehicle being maintained
 *         linkedRule:
 *           type: string
 *           description: ID of the maintenance rule that triggered this (optional)
 *         maintenanceDate:
 *           type: string
 *           format: date-time
 *           description: Date when maintenance was performed
 *         vehicleMileageAtMaintenance:
 *           type: number
 *           minimum: 0
 *           description: Vehicle mileage at time of maintenance
 *         nextMaintenanceDueDate:
 *           type: string
 *           format: date-time
 *           description: When next maintenance is due (date-based)
 *         nextMaintenanceDueMileage:
 *           type: number
 *           minimum: 0
 *           description: When next maintenance is due (mileage-based)
 *         cost:
 *           type: number
 *           minimum: 0
 *           description: Cost of maintenance
 *           example: 500.00
 *         serviceProvider:
 *           type: string
 *           description: Name of service provider/workshop
 *           example: "Garage Dupont"
 *         description:
 *           type: string
 *           description: Detailed description of maintenance work
 *         partsReplaced:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               partName:
 *                 type: string
 *                 example: "Oil Filter"
 *               quantity:
 *                 type: number
 *                 example: 1
 *               unitPrice:
 *                 type: number
 *                 example: 25.00
 *         isAlertTriggered:
 *           type: boolean
 *           default: false
 *           description: Whether this maintenance was triggered by an alert
 *         alertType:
 *           type: string
 *           enum: [Mileage, Time, Both, Manual]
 *           default: Manual
 *           description: Type of alert that triggered maintenance
 *         status:
 *           type: string
 *           enum: [Scheduled, In Progress, Completed, Cancelled]
 *           default: Completed
 *           description: Current status of maintenance
 *         performedBy:
 *           type: string
 *           description: ID of user who recorded the maintenance
 *         remarks:
 *           type: string
 *           description: Additional remarks or notes
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     MaintenanceInput:
 *       type: object
 *       required:
 *         - maintenanceType
 *         - linkedVehicle
 *         - maintenanceDate
 *         - vehicleMileageAtMaintenance
 *         - cost
 *         - serviceProvider
 *       properties:
 *         maintenanceType:
 *           type: string
 *           enum: [Tire Replacement, Oil Change, Vehicle Revision, Other]
 *           example: "Oil Change"
 *         linkedVehicle:
 *           type: string
 *           example: "507f1f77bcf86cd799439011"
 *         linkedRule:
 *           type: string
 *           example: "507f1f77bcf86cd799439012"
 *         maintenanceDate:
 *           type: string
 *           format: date-time
 *           example: "2024-12-11T09:00:00Z"
 *         vehicleMileageAtMaintenance:
 *           type: number
 *           example: 150000
 *         nextMaintenanceDueDate:
 *           type: string
 *           format: date-time
 *           example: "2025-06-11T09:00:00Z"
 *         nextMaintenanceDueMileage:
 *           type: number
 *           example: 160000
 *         cost:
 *           type: number
 *           example: 500.00
 *         serviceProvider:
 *           type: string
 *           example: "Garage Dupont"
 *         description:
 *           type: string
 *           example: "Regular oil change service"
 *         partsReplaced:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               partName:
 *                 type: string
 *               quantity:
 *                 type: number
 *               unitPrice:
 *                 type: number
 *         status:
 *           type: string
 *           enum: [Scheduled, In Progress, Completed, Cancelled]
 *           example: "Completed"
 *         remarks:
 *           type: string
 *           example: "All checks passed"
 */

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
