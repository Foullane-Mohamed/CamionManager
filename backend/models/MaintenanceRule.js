import mongoose from "mongoose";

const maintenanceRuleSchema = new mongoose.Schema(
  {
    maintenanceType: {
      type: String,
      enum: ["Tire Replacement", "Oil Change", "Vehicle Revision"],
      required: [true, "Maintenance type is required"],
    },
    mileageThreshold: {
      type: Number,
      required: function () {
        return this.maintenanceType !== "Tire Replacement";
      },
      min: [0, "Mileage threshold must be positive"],
    },
    timeThresholdDays: {
      type: Number,
      required: function () {
        return this.maintenanceType === "Oil Change";
      },
      min: [0, "Time threshold must be positive"],
    },
    description: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    lastModifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
maintenanceRuleSchema.index({ maintenanceType: 1, isActive: 1 });

// Virtual for rule summary
maintenanceRuleSchema.virtual("ruleSummary").get(function () {
  let summary = `${this.maintenanceType}: `;
  if (this.mileageThreshold) {
    summary += `Every ${this.mileageThreshold} km`;
  }
  if (this.timeThresholdDays) {
    summary += ` or ${this.timeThresholdDays} days`;
  }
  return summary;
});

maintenanceRuleSchema.set("toJSON", { virtuals: true });
maintenanceRuleSchema.set("toObject", { virtuals: true });

const MaintenanceRule = mongoose.model(
  "MaintenanceRule",
  maintenanceRuleSchema
);

export default MaintenanceRule;
