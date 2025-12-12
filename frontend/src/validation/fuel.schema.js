import { z } from "zod";

export const fuelSchema = z.object({
  quantity: z.number().min(0, "Quantity cannot be negative"),
  totalCost: z.number().min(0, "Total cost cannot be negative"),
  pricePerLitre: z.number().min(0, "Price per litre cannot be negative"),
  fuelStationLocation: z.string().min(1, "Fuel station location is required"),
  dateOfOperation: z.string().min(1, "Date of operation is required"),
  linkedTrip: z.string().optional().or(z.literal("")),
  linkedDriver: z.string().min(1, "Driver is required"),
  linkedVehicle: z.string().min(1, "Vehicle is required"),
  notes: z.string().optional().or(z.literal("")),
});

export const fuelUpdateSchema = fuelSchema.partial();
