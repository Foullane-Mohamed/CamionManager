import { z } from "zod";

export const tireSchema = z.object({
  serialNumber: z.string().min(1, "Serial number is required"),
  brand: z.string().min(1, "Brand is required"),
  size: z.string().min(1, "Size is required"),
  status: z.enum(["Bon", "À remplacer", "Usé"]).default("Bon"),
  installationDate: z.string().min(1, "Installation date is required"),
  vehiclePosition: z.enum([
    "Front Left",
    "Front Right",
    "Rear Left",
    "Rear Right",
    "Spare",
    "Trailer Front Left",
    "Trailer Front Right",
    "Trailer Rear Left",
    "Trailer Rear Right",
  ]),
  associatedVehicleType: z.enum(["Truck", "Trailer"]),
  associatedVehicleId: z.string().min(1, "Associated vehicle is required"),
});

export const tireUpdateSchema = tireSchema.partial();

export const tireStatusSchema = z.object({
  status: z.enum(["Bon", "À remplacer", "Usé"]),
});
