/**
 * @swagger
 * components:
 *   schemas:
 *     Fuel:
 *       type: object
 *       required:
 *         - quantity
 *         - totalCost
 *         - pricePerLitre
 *         - fuelStationLocation
 *         - dateOfOperation
 *         - linkedDriver
 *         - linkedVehicle
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated MongoDB ID
 *         quantity:
 *           type: number
 *           minimum: 0
 *           description: Fuel quantity in litres
 *           example: 200
 *         totalCost:
 *           type: number
 *           minimum: 0
 *           description: Total cost of fuel
 *           example: 300.50
 *         pricePerLitre:
 *           type: number
 *           minimum: 0
 *           description: Price per litre
 *           example: 1.5025
 *         fuelStationLocation:
 *           type: string
 *           description: Location of the fuel station
 *           example: "Station Total - Paris Nord"
 *         dateOfOperation:
 *           type: string
 *           format: date-time
 *           description: Date and time of fuel purchase
 *         linkedTrip:
 *           type: string
 *           description: ID of the associated trip (optional)
 *         linkedDriver:
 *           type: string
 *           description: ID of the driver who purchased fuel
 *         linkedVehicle:
 *           type: string
 *           description: ID of the vehicle that was refueled
 *         notes:
 *           type: string
 *           description: Additional notes
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     FuelInput:
 *       type: object
 *       required:
 *         - quantity
 *         - totalCost
 *         - pricePerLitre
 *         - fuelStationLocation
 *         - dateOfOperation
 *         - linkedDriver
 *         - linkedVehicle
 *       properties:
 *         quantity:
 *           type: number
 *           example: 200
 *         totalCost:
 *           type: number
 *           example: 300.50
 *         pricePerLitre:
 *           type: number
 *           example: 1.5025
 *         fuelStationLocation:
 *           type: string
 *           example: "Station Total - Paris Nord"
 *         dateOfOperation:
 *           type: string
 *           format: date-time
 *           example: "2024-12-11T10:30:00Z"
 *         linkedTrip:
 *           type: string
 *           example: "507f1f77bcf86cd799439011"
 *         linkedDriver:
 *           type: string
 *           example: "507f1f77bcf86cd799439012"
 *         linkedVehicle:
 *           type: string
 *           example: "507f1f77bcf86cd799439013"
 *         notes:
 *           type: string
 *           example: "Regular refueling"
 */

import mongoose from "mongoose";

const fuelSchema = new mongoose.Schema(
  {
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [0, "Quantity cannot be negative"],
    },
    totalCost: {
      type: Number,
      required: [true, "Total cost is required"],
      min: [0, "Total cost cannot be negative"],
    },
    pricePerLitre: {
      type: Number,
      required: [true, "Price per litre is required"],
      min: [0, "Price per litre cannot be negative"],
    },
    fuelStationLocation: {
      type: String,
      required: [true, "Fuel station location is required"],
      trim: true,
    },
    dateOfOperation: {
      type: Date,
      required: [true, "Date of operation is required"],
    },
    linkedTrip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trip",
      default: null,
    },
    linkedDriver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Linked driver is required"],
    },
    linkedVehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Truck",
      required: [true, "Linked vehicle is required"],
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

fuelSchema.index({ linkedDriver: 1 });
fuelSchema.index({ linkedVehicle: 1 });
fuelSchema.index({ linkedTrip: 1 });
fuelSchema.index({ dateOfOperation: -1 });

const Fuel = mongoose.model("Fuel", fuelSchema);

export default Fuel;
