import { z } from "zod";

// Frontend schema - matches backend createMaintenanceValidator
// Note: performedBy is NOT sent from frontend, it's set by backend from req.user.userId
export const maintenanceSchema = z.object({
  maintenanceType: z.enum([
    "Tire Replacement",
    "Oil Change",
    "Vehicle Revision",
    "Other",
  ]),
  linkedVehicle: z.string().min(1, "Vehicle is required"),
  linkedRule: z.string().optional().or(z.literal("")),
  maintenanceDate: z.string().min(1, "Maintenance date is required"),
  vehicleMileageAtMaintenance: z.number().min(0, "Mileage cannot be negative"),
  nextMaintenanceDueDate: z.string().optional().or(z.literal("")),
  nextMaintenanceDueMileage: z.number().min(0).optional(),
  cost: z.number().min(0, "Cost cannot be negative"),
  serviceProvider: z.string().min(1, "Service provider is required"),
  description: z.string().optional().or(z.literal("")),
  partsReplaced: z
    .array(
      z.object({
        partName: z.string(),
        quantity: z.number(),
        unitPrice: z.number(),
      })
    )
    .optional(),
  status: z
    .enum(["Scheduled", "In Progress", "Completed", "Cancelled"])
    .default("Completed"),
  remarks: z.string().optional().or(z.literal("")),
});

export const maintenanceUpdateSchema = maintenanceSchema.partial();

