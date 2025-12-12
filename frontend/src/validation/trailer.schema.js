import { z } from "zod";

export const trailerSchema = z.object({
  matricule: z
    .string()
    .min(3, "Matricule must be at least 3 characters")
    .max(20),
  type: z.enum([
    "Frigo",
    "Plateau",
    "Fourgon",
    "Citerne",
    "Benne",
    "Porte-conteneur",
  ]),
  maximumLoad: z.number().min(0, "Maximum load cannot be negative"),
  status: z
    .enum(["Disponible", "En Mission", "En Maintenance"])
    .default("Disponible"),
  currentMileage: z.number().min(0, "Mileage cannot be negative").default(0),
});

export const trailerUpdateSchema = trailerSchema.partial();

export const trailerStatusSchema = z.object({
  status: z.enum(["Disponible", "En Mission", "En Maintenance"]),
});
