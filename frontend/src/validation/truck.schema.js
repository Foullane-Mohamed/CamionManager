import { z } from "zod";

export const truckSchema = z.object({
  matricule: z
    .string()
    .min(3, "Matricule must be at least 3 characters")
    .max(20, "Matricule must not exceed 20 characters")
    .regex(
      /^[A-Z0-9-]+$/,
      "Matricule must be uppercase alphanumeric with hyphens only"
    ),
  brand: z.string().min(2, "Brand must be at least 2 characters").max(100),
  model: z.string().min(1, "Model is required").max(100),
  yearOfManufacture: z
    .number()
    .int("Year must be an integer")
    .min(1900, "Year must be 1900 or later")
    .max(new Date().getFullYear(), "Year cannot be in the future"),
  status: z
    .enum(["Disponible", "En Mission", "En Maintenance"])
    .default("Disponible"),
  currentMileage: z
    .number()
    .int("Mileage must be an integer")
    .min(0, "Mileage cannot be negative")
    .max(10000000, "Mileage exceeds maximum"),
  fuelType: z.enum(["Diesel", "Gasoline", "Other"]),
});

export const truckUpdateSchema = truckSchema.partial();

export const truckStatusSchema = z.object({
  status: z.enum(["Disponible", "En Mission", "En Maintenance"]),
});
