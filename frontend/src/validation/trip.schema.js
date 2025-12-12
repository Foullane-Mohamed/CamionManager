import { z } from "zod";

export const tripSchema = z.object({
  assignedTruck: z.string().min(1, "Truck is required"),
  assignedTrailer: z.string().optional().or(z.literal("")),
  assignedDriver: z.string().min(1, "Driver is required"),
  startPoint: z.string().min(1, "Start point is required"),
  destinationPoint: z.string().min(1, "Destination point is required"),
  departureDate: z.string().min(1, "Departure date is required"),
  expectedArrivalDate: z.string().min(1, "Expected arrival date is required"),
  mileageAtDeparture: z.number().min(0, "Mileage cannot be negative"),
  driverRemarks: z.string().optional().or(z.literal("")),
});

export const tripUpdateSchema = z.object({
  assignedTruck: z.string().optional(),
  assignedTrailer: z.string().optional().or(z.literal("")),
  assignedDriver: z.string().optional(),
  startPoint: z.string().optional(),
  destinationPoint: z.string().optional(),
  departureDate: z.string().optional(),
  expectedArrivalDate: z.string().optional(),
  actualArrivalDate: z.string().optional().or(z.literal("")),
  status: z.enum(["À faire", "En cours", "Terminé"]).optional(),
  mileageAtDeparture: z.number().optional(),
  mileageAtArrival: z.number().optional(),
  driverRemarks: z.string().optional().or(z.literal("")),
});

export const tripStatusSchema = z.object({
  status: z.enum(["À faire", "En cours", "Terminé"]),
  actualArrivalDate: z.string().optional(),
  mileageAtArrival: z.number().optional(),
});
